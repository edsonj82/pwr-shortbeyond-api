import { Pool } from 'pg';

import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

// module.exports = {
//   cleanupTestData,
// };

// Permite executar o script diretamente via Node.js  

// if (process.argv[1].includes('database.js')) {
//   cleanupTestData()
//     .then(() => {
//       console.log('✅ Cleanup executado com sucesso');
//       process.exit(0);
//     })
//     .catch(err => {
//       console.error('❌ Erro ao executar cleanup:', err);
//       process.exit(1);
//     });
// }