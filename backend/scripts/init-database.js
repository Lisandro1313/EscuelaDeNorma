const { testConnection, pool } = require('../src/config/database');
const { createTables, insertSampleData } = require('../src/config/schema');

async function initializeDatabase() {
  console.log('🔄 Inicializando base de datos Campus Norma...');
  
  try {
    // Probar conexión
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('\n❌ No se pudo conectar a PostgreSQL');
      console.log('\n💡 Para configurar PostgreSQL:');
      console.log('\n1. Instalar PostgreSQL:');
      console.log('   - Windows: Descargar desde https://www.postgresql.org/download/');
      console.log('   - macOS: brew install postgresql');
      console.log('   - Linux: sudo apt install postgresql');
      console.log('\n2. O usar Docker:');
      console.log('   docker run --name postgres-campus \\');
      console.log('     -e POSTGRES_PASSWORD=admin \\');
      console.log('     -e POSTGRES_DB=campus_norma \\');
      console.log('     -p 5432:5432 -d postgres:13');
      console.log('\n3. Configurar archivo .env con las credenciales correctas');
      process.exit(1);
    }

    // Crear tablas
    await createTables();
    
    // Insertar datos de prueba
    await insertSampleData();
    
    console.log('\n✅ Base de datos inicializada correctamente');
    console.log('\n📊 Datos disponibles:');
    console.log('   - Usuarios de prueba: admin@campus.com, profesor@campus.com, alumno@campus.com');
    console.log('   - Password para todos: password123');
    console.log('   - Cursos de ejemplo: Matemáticas, Arte, Programación, Inglés');
    console.log('   - Clases programadas y sistema de chat');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar inicialización
initializeDatabase();