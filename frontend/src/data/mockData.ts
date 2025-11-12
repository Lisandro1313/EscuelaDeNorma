// Usuarios de prueba
export const usuariosPrueba = [
  {
    id: 1,
    email: "alumno@campus.com",
    password: "123456",
    nombre: "María González",
    tipo: "alumno",
    avatar: "👩‍🎓",
    cursosInscritos: [1, 2, 3],
    progreso: {
      1: 75, // Matemáticas Avanzadas
      2: 45, // Historia del Arte  
      3: 90  // Programación Web
    }
  },
  {
    id: 2,
    email: "profesor@campus.com", 
    password: "123456",
    nombre: "Dr. García López",
    tipo: "profesor",
    avatar: "👨‍🏫",
    cursosDictados: [1, 4], // Matemáticas y Filosofía
    especialidad: "Matemáticas"
  },
  {
    id: 3,
    email: "admin@campus.com",
    password: "123456", 
    nombre: "Ana Ruiz",
    tipo: "admin",
    avatar: "👩‍💼",
    permisos: ["gestionar_cursos", "gestionar_usuarios", "ver_reportes"]
  }
];

// Datos de cursos
export const cursosPrueba = [
  {
    id: 1,
    nombre: "Matemáticas Avanzadas",
    descripcion: "Cálculo diferencial e integral para estudiantes avanzados",
    profesor: "Dr. García López",
    profesorId: 2,
    categoria: "matematicas",
    precio: 25,
    duracion: "12 semanas",
    estudiantes: 45,
    rating: 4.8,
    imagen: "🧮",
    modulos: [
      {
        id: 1,
        titulo: "Introducción al Cálculo",
        descripcion: "Conceptos fundamentales y límites",
        completado: true,
        duracion: "2 horas",
        recursos: ["📹 Video: Introducción", "📄 PDF: Ejercicios", "💬 Foro de discusión"]
      },
      {
        id: 2,
        titulo: "Derivadas",
        descripcion: "Reglas de derivación y aplicaciones",
        completado: true,
        duracion: "3 horas",
        recursos: ["📹 Video: Derivadas básicas", "📹 Video: Regla de la cadena", "📄 PDF: Problemas resueltos"]
      },
      {
        id: 3,
        titulo: "Integrales",
        descripcion: "Integración por partes y sustitución",
        completado: false,
        duracion: "3 horas",
        recursos: ["📹 Video: Integrales básicas", "🔒 Clase en vivo: Viernes 10:00", "📄 PDF: Ejercicios avanzados"]
      }
    ]
  },
  {
    id: 2,
    nombre: "Historia del Arte",
    descripcion: "Un recorrido por las principales corrientes artísticas",
    profesor: "Mtra. Ana Ruiz",
    profesorId: 3,
    categoria: "arte",
    precio: 20,
    duracion: "8 semanas",
    estudiantes: 32,
    rating: 4.9,
    imagen: "🎨"
  },
  {
    id: 3,
    nombre: "Programación Web",
    descripcion: "Desarrollo frontend y backend con tecnologías modernas",
    profesor: "Ing. Carlos Mendoza",
    profesorId: 4,
    categoria: "tecnologia",
    precio: 35,
    duracion: "16 semanas",
    estudiantes: 67,
    rating: 4.7,
    imagen: "💻"
  }
];