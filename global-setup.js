import { cleanupTestData } from './playwright/support/database.js';

export default async () => {
    console.log('Iniciando global setup...');
    console.log('🧹 Limpando dados de teste antes da execução...');

    try {
        await cleanupTestData();
        console.log('✅ Dados de teste limpos com sucesso.');
    } catch (error) {
        console.error('❌ Erro ao limpar dados de teste:', error);
        throw error;
    }

    console.log('Global setup concluído.');
};