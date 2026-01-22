import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'dba',
  password: 'dba',
  database: 'ShortDB',
});

/**
 * Remove todos os links e usuários
 * cujo email contém o domínio theotokus.com
 */
export async function cleanupTestData() {
  const query = `
    WITH users_to_delete AS (
        SELECT id
        FROM users
        WHERE email ILIKE '%@theotokus.com'
    ),
    deleted_links AS (
        DELETE FROM links
        WHERE user_id IN (SELECT id FROM users_to_delete)
    )
    DELETE FROM users
    WHERE id IN (SELECT id FROM users_to_delete);
  `;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(query);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1].includes('database.js')) {
  cleanupTestData()
    .then(() => {
      console.log('✅ Cleanup executado com sucesso');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Erro ao executar cleanup:', err);
      process.exit(1);
    });
}

