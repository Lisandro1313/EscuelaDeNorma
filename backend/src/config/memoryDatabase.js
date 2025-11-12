// Simulador de base de datos en memoria
// Para cuando PostgreSQL no esté disponible

class MemoryDatabase {
  constructor() {
    this.users = [
      {
        id: 1,
        email: 'admin@campus.com',
        password: '$2b$10$rOoF.4ZPYyqE/GWU0uR2wOoZ8bLfCpLF1zTF5bW.1bfJ4a0ZPjk0m', // password123
        nombre: 'Administrador Principal',
        tipo: 'admin',
        activo: true,
        fecha_registro: new Date(),
        cursos_inscritos: [],
        cursos_dictados: [],
        progreso: {}
      },
      {
        id: 2,
        email: 'profesor@campus.com',
        password: '$2b$10$rOoF.4ZPYyqE/GWU0uR2wOoZ8bLfCpLF1zTF5bW.1bfJ4a0ZPjk0m', // password123
        nombre: 'Dr. García López',
        tipo: 'profesor',
        activo: true,
        fecha_registro: new Date(),
        cursos_inscritos: [],
        cursos_dictados: [1, 2],
        progreso: {}
      },
      {
        id: 3,
        email: 'alumno@campus.com',
        password: '$2b$10$rOoF.4ZPYyqE/GWU0uR2wOoZ8bLfCpLF1zTF5bW.1bfJ4a0ZPjk0m', // password123
        nombre: 'María Estudiante',
        tipo: 'alumno',
        activo: true,
        fecha_registro: new Date(),
        cursos_inscritos: [1, 3],
        cursos_dictados: [],
        progreso: { 1: 65, 3: 80 }
      }
    ];

    this.courses = [
      {
        id: 1,
        nombre: 'Matemáticas Avanzadas',
        descripcion: 'Cálculo diferencial e integral para estudiantes avanzados',
        profesor: 'Dr. García López',
        profesor_id: 2,
        categoria: 'Matemáticas',
        precio: 25.00,
        duracion: '12 semanas',
        estudiantes: 45,
        rating: 4.8,
        imagen: '🧮',
        activo: true,
        fecha_creacion: new Date(),
        contenido: []
      },
      {
        id: 2,
        nombre: 'Historia del Arte',
        descripcion: 'Un recorrido por las principales corrientes artísticas',
        profesor: 'Mtra. Ana Ruiz',
        profesor_id: 2,
        categoria: 'Arte',
        precio: 20.00,
        duracion: '8 semanas',
        estudiantes: 32,
        rating: 4.6,
        imagen: '🎨',
        activo: true,
        fecha_creacion: new Date(),
        contenido: []
      },
      {
        id: 3,
        nombre: 'Programación Web',
        descripcion: 'Desarrollo completo con React y Node.js',
        profesor: 'Ing. Carlos Tech',
        profesor_id: 2,
        categoria: 'Tecnología',
        precio: 35.00,
        duracion: '16 semanas',
        estudiantes: 28,
        rating: 4.9,
        imagen: '💻',
        activo: true,
        fecha_creacion: new Date(),
        contenido: []
      },
      {
        id: 4,
        nombre: 'Inglés Avanzado',
        descripcion: 'Perfecciona tu inglés con técnicas modernas',
        profesor: 'Prof. Sarah Wilson',
        profesor_id: 2,
        categoria: 'Idiomas',
        precio: 22.00,
        duracion: '10 semanas',
        estudiantes: 38,
        rating: 4.7,
        imagen: '🇺🇸',
        activo: true,
        fecha_creacion: new Date(),
        contenido: []
      }
    ];

    this.messages = [];
    this.inscripciones = [
      { id: 1, usuario_id: 3, curso_id: 1, fecha_inscripcion: new Date(), estado: 'activa', progreso: 65 },
      { id: 2, usuario_id: 3, curso_id: 3, fecha_inscripcion: new Date(), estado: 'activa', progreso: 80 }
    ];

    this.nextUserId = 4;
    this.nextCourseId = 5;
    this.nextMessageId = 1;
  }

  // Simulación de métodos de User
  async findUserByEmail(email) {
    return this.users.find(user => user.email === email && user.activo);
  }

  async findUserById(id) {
    return this.users.find(user => user.id === parseInt(id) && user.activo);
  }

  async createUser(userData) {
    const newUser = {
      id: this.nextUserId++,
      ...userData,
      activo: true,
      fecha_registro: new Date(),
      cursos_inscritos: [],
      cursos_dictados: [],
      progreso: {}
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUserLastConnection(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    if (user) {
      user.ultima_conexion = new Date();
    }
  }

  async enrollUserInCourse(userId, courseId) {
    const user = this.users.find(u => u.id === parseInt(userId));
    if (user && !user.cursos_inscritos.includes(parseInt(courseId))) {
      user.cursos_inscritos.push(parseInt(courseId));
      
      // Crear inscripción
      this.inscripciones.push({
        id: this.inscripciones.length + 1,
        usuario_id: parseInt(userId),
        curso_id: parseInt(courseId),
        fecha_inscripcion: new Date(),
        estado: 'activa',
        progreso: 0
      });

      // Actualizar contador del curso
      const course = this.courses.find(c => c.id === parseInt(courseId));
      if (course) {
        course.estudiantes++;
      }
    }
    return user;
  }

  // Simulación de métodos de Course
  async findAllCourses() {
    return this.courses.filter(course => course.activo);
  }

  async findCourseById(id) {
    return this.courses.find(course => course.id === parseInt(id) && course.activo);
  }

  async searchCourses(term) {
    const searchTerm = term.toLowerCase();
    return this.courses.filter(course => 
      course.activo && (
        course.nombre.toLowerCase().includes(searchTerm) ||
        course.descripcion.toLowerCase().includes(searchTerm) ||
        course.categoria.toLowerCase().includes(searchTerm)
      )
    );
  }

  // Simulación de métodos de Message
  async findMessagesByCourse(courseId) {
    return this.messages
      .filter(msg => msg.curso_id === parseInt(courseId))
      .map(msg => {
        const user = this.users.find(u => u.id === msg.usuario_id);
        return {
          ...msg,
          usuario_nombre: user ? user.nombre : 'Usuario Desconocido',
          avatar: user ? user.avatar : null
        };
      })
      .sort((a, b) => new Date(a.fecha_envio) - new Date(b.fecha_envio));
  }

  async createMessage(messageData) {
    const newMessage = {
      id: this.nextMessageId++,
      ...messageData,
      fecha_envio: new Date(),
      editado: false
    };
    this.messages.push(newMessage);
    
    // Agregar datos del usuario
    const user = this.users.find(u => u.id === messageData.usuario_id);
    return {
      ...newMessage,
      usuario_nombre: user ? user.nombre : 'Usuario Desconocido',
      avatar: user ? user.avatar : null
    };
  }

  async testConnection() {
    return true; // Siempre conectado en memoria
  }
}

const memoryDb = new MemoryDatabase();

module.exports = {
  memoryDb,
  isUsingMemoryDb: true
};