-- Base de datos para Campus Norma
-- Creación de tablas principales

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'alumno',
    telefono VARCHAR(20),
    biografia TEXT,
    activo BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    profesor VARCHAR(255),
    profesor_id INTEGER,
    categoria VARCHAR(100),
    precio DECIMAL(10,2) DEFAULT 0,
    duracion VARCHAR(100),
    estudiantes INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    imagen VARCHAR(255),
    publicado BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profesor_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT false,
    progress DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    preference_id VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INTEGER DEFAULT 1,
    publicado BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    tipo VARCHAR(50) DEFAULT 'texto',
    orden INTEGER DEFAULT 1,
    duracion INTEGER DEFAULT 0,
    recursos TEXT,
    publicado BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT false,
    tiempo_visto INTEGER DEFAULT 0,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    UNIQUE(user_id, lesson_id)
);

-- Crear usuario administrador por defecto
INSERT OR IGNORE INTO users (id, email, password, nombre, tipo) VALUES 
(1, 'admin@campusnorma.com', '$2b$10$8K1p/a0drcZmxSLb4fA.M.QtJ5mKGf5L4tGe8/W9/WkVb2kP7mKOy', 'Administrador', 'admin');

-- Tabla de eventos/calendario
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    type VARCHAR(50) DEFAULT 'class',
    course_id INTEGER,
    instructor_id INTEGER,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id)
);

-- Tabla de evaluaciones/quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id INTEGER NOT NULL,
    instructor_id INTEGER NOT NULL,
    time_limit INTEGER DEFAULT 60,
    attempts_allowed INTEGER DEFAULT 1,
    passing_score INTEGER DEFAULT 70,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id)
);

-- Tabla de preguntas de quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple-choice',
    options TEXT, -- JSON con las opciones
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    explanation TEXT,
    order_num INTEGER DEFAULT 1,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Tabla de intentos de quiz
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    answers TEXT, -- JSON con las respuestas
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);