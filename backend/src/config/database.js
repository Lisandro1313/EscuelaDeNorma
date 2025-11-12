const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'campus_norma',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
  // Configuración para desarrollo local
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo número de conexiones
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Probar la conexión
pool.on('connect', () => {
  console.log('🐘 Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en PostgreSQL:', err);
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL funcionando:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    console.log('💡 Sugerencia: Instala PostgreSQL o usa Docker:');
    console.log('   docker run --name postgres-campus -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=campus_norma -p 5432:5432 -d postgres:13');
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};