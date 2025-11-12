const { pool } = require('./database');

// Script para crear todas las tablas
const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('📊 Creando esquema de base de datos...');

    // Tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) NOT NULL DEFAULT 'alumno',
        telefono VARCHAR(20),
        fecha_nacimiento DATE,
        biografia TEXT,
        avatar VARCHAR(255),
        activo BOOLEAN DEFAULT true,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ultima_conexion TIMESTAMP,
        cursos_inscritos INTEGER[] DEFAULT '{}',
        cursos_dictados INTEGER[] DEFAULT '{}',
        progreso JSONB DEFAULT '{}'
      );
    `);

    // Tabla de cursos
    await client.query(`
      CREATE TABLE IF NOT EXISTS cursos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        profesor VARCHAR(255) NOT NULL,
        profesor_id INTEGER REFERENCES usuarios(id),
        categoria VARCHAR(100) NOT NULL,
        precio DECIMAL(10,2) NOT NULL DEFAULT 0,
        duracion VARCHAR(100),
        estudiantes INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        imagen VARCHAR(255) DEFAULT '📚',
        activo BOOLEAN DEFAULT true,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        contenido JSONB DEFAULT '[]',
        requisitos TEXT[],
        objetivos TEXT[]
      );
    `);

    // Tabla de clases
    await client.query(`
      CREATE TABLE IF NOT EXISTS clases (
        id SERIAL PRIMARY KEY,
        curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        fecha TIMESTAMP NOT NULL,
        duracion INTEGER DEFAULT 60,
        modalidad VARCHAR(50) DEFAULT 'virtual',
        capacidad_maxima INTEGER DEFAULT 50,
        url_reunion VARCHAR(255),
        estado VARCHAR(50) DEFAULT 'programada',
        grabacion_url VARCHAR(255),
        material_apoyo JSONB DEFAULT '[]',
        asistentes INTEGER[] DEFAULT '{}',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de inscripciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS inscripciones (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
        fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(50) DEFAULT 'activa',
        progreso DECIMAL(5,2) DEFAULT 0,
        fecha_completado TIMESTAMP,
        calificacion DECIMAL(3,2),
        comentario TEXT,
        UNIQUE(usuario_id, curso_id)
      );
    `);

    // Tabla de pagos
    await client.query(`
      CREATE TABLE IF NOT EXISTS pagos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        curso_id INTEGER REFERENCES cursos(id),
        monto DECIMAL(10,2) NOT NULL,
        moneda VARCHAR(3) DEFAULT 'USD',
        estado VARCHAR(50) DEFAULT 'pendiente',
        metodo_pago VARCHAR(100),
        referencia_externa VARCHAR(255),
        fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_vencimiento TIMESTAMP,
        detalles JSONB DEFAULT '{}'
      );
    `);

    // Tabla de mensajes (chat)
    await client.query(`
      CREATE TABLE IF NOT EXISTS mensajes (
        id SERIAL PRIMARY KEY,
        curso_id INTEGER REFERENCES cursos(id),
        usuario_id INTEGER REFERENCES usuarios(id),
        mensaje TEXT NOT NULL,
        tipo VARCHAR(50) DEFAULT 'texto',
        archivo_url VARCHAR(255),
        fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        editado BOOLEAN DEFAULT false,
        respuesta_a INTEGER REFERENCES mensajes(id)
      );
    `);

    // Tabla de archivos
    await client.query(`
      CREATE TABLE IF NOT EXISTS archivos (
        id SERIAL PRIMARY KEY,
        curso_id INTEGER REFERENCES cursos(id),
        usuario_id INTEGER REFERENCES usuarios(id),
        nombre_original VARCHAR(255) NOT NULL,
        nombre_archivo VARCHAR(255) NOT NULL,
        ruta VARCHAR(500) NOT NULL,
        tipo_mime VARCHAR(100),
        tamaño INTEGER,
        tipo_archivo VARCHAR(50),
        descripcion TEXT,
        publico BOOLEAN DEFAULT false,
        fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de notificaciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        titulo VARCHAR(255) NOT NULL,
        mensaje TEXT NOT NULL,
        tipo VARCHAR(50) DEFAULT 'info',
        leida BOOLEAN DEFAULT false,
        url VARCHAR(255),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_lectura TIMESTAMP
      );
    `);

    // Crear índices para mejor rendimiento
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);
      CREATE INDEX IF NOT EXISTS idx_cursos_categoria ON cursos(categoria);
      CREATE INDEX IF NOT EXISTS idx_cursos_profesor_id ON cursos(profesor_id);
      CREATE INDEX IF NOT EXISTS idx_clases_curso_id ON clases(curso_id);
      CREATE INDEX IF NOT EXISTS idx_clases_fecha ON clases(fecha);
      CREATE INDEX IF NOT EXISTS idx_inscripciones_usuario_id ON inscripciones(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_inscripciones_curso_id ON inscripciones(curso_id);
      CREATE INDEX IF NOT EXISTS idx_mensajes_curso_id ON mensajes(curso_id);
      CREATE INDEX IF NOT EXISTS idx_mensajes_fecha ON mensajes(fecha_envio);
      CREATE INDEX IF NOT EXISTS idx_archivos_curso_id ON archivos(curso_id);
      CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario_id ON notificaciones(usuario_id);
    `);

    console.log('✅ Esquema de base de datos creado exitosamente');
    
  } catch (error) {
    console.error('❌ Error creando esquema:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Función para insertar datos de prueba
const insertSampleData = async () => {
  const client = await pool.connect();
  
  try {
    console.log('📝 Insertando datos de prueba...');

    // Insertar usuarios de prueba
    await client.query(`
      INSERT INTO usuarios (email, password, nombre, tipo, biografia) VALUES
      ('admin@campus.com', '$2b$10$rOoF.4ZPYyqE/GWU0uR2wOoZ8bLfCpLF1zTF5bW.1bfJ4a0ZPjk0m', 'Administrador Principal', 'admin', 'Administrador del sistema Campus Norma'),
      ('profesor@campus.com', '$2b$10$rOoF.4ZPYyqE/GWU0uR2wOoZ8bLfCpLF1zTF5bW.1bfJ4a0ZPjk0m', 'Dr. García López', 'profesor', 'Profesor de Matemáticas con 15 años de experiencia'),
      ('alumno@campus.com', '$2b$10$rOoF.4ZPYyqE/GWU0uR2wOoZ8bLfCpLF1zTF5bW.1bfJ4a0ZPjk0m', 'María Estudiante', 'alumno', 'Estudiante entusiasta de matemáticas y ciencias')
      ON CONFLICT (email) DO NOTHING;
    `);

    // Insertar cursos de prueba
    await client.query(`
      INSERT INTO cursos (nombre, descripcion, profesor, profesor_id, categoria, precio, duracion, estudiantes, rating, imagen) VALUES
      ('Matemáticas Avanzadas', 'Cálculo diferencial e integral para estudiantes avanzados', 'Dr. García López', 2, 'Matemáticas', 25.00, '12 semanas', 45, 4.8, '🧮'),
      ('Historia del Arte', 'Un recorrido por las principales corrientes artísticas', 'Mtra. Ana Ruiz', 2, 'Arte', 20.00, '8 semanas', 32, 4.6, '🎨'),
      ('Programación Web', 'Desarrollo completo con React y Node.js', 'Ing. Carlos Tech', 2, 'Tecnología', 35.00, '16 semanas', 28, 4.9, '💻'),
      ('Inglés Avanzado', 'Perfecciona tu inglés con técnicas modernas', 'Prof. Sarah Wilson', 2, 'Idiomas', 22.00, '10 semanas', 38, 4.7, '🇺🇸')
      ON CONFLICT DO NOTHING;
    `);

    // Insertar clases de prueba
    await client.query(`
      INSERT INTO clases (curso_id, titulo, descripcion, fecha, duracion, url_reunion) VALUES
      (1, 'Introducción al Cálculo', 'Conceptos básicos de límites y derivadas', NOW() + INTERVAL '1 day', 60, 'https://meet.google.com/abc-defg-hij'),
      (1, 'Derivadas Avanzadas', 'Regla de la cadena y aplicaciones', NOW() + INTERVAL '1 week', 60, 'https://meet.google.com/klm-nopq-rst'),
      (2, 'Arte Renacentista', 'Análisis de obras de Leonardo y Miguel Ángel', NOW() + INTERVAL '2 days', 90, 'https://meet.google.com/uvw-xyza-bcd')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Datos de prueba insertados exitosamente');
    
  } catch (error) {
    console.error('❌ Error insertando datos:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createTables,
  insertSampleData
};