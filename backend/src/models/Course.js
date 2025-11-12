const { pool } = require('../config/database');

class Course {
  static async create(courseData) {
    const { 
      nombre, descripcion, profesor, profesor_id, categoria, 
      precio, duracion, imagen = '📚', contenido = [], 
      requisitos = [], objetivos = []
    } = courseData;
    
    const query = `
      INSERT INTO cursos (nombre, descripcion, profesor, profesor_id, categoria, precio, duracion, imagen, contenido, requisitos, objetivos)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [nombre, descripcion, profesor, profesor_id, categoria, precio, duracion, imagen, JSON.stringify(contenido), requisitos, objetivos];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM cursos WHERE id = $1 AND activo = true';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll() {
    const query = `
      SELECT c.*, 
             COUNT(i.id) as estudiantes_inscritos,
             AVG(i.calificacion) as rating_promedio
      FROM cursos c
      LEFT JOIN inscripciones i ON c.id = i.curso_id AND i.estado = 'activa'
      WHERE c.activo = true
      GROUP BY c.id
      ORDER BY c.fecha_creacion DESC
    `;
    const result = await pool.query(query);
    
    return result.rows.map(course => ({
      ...course,
      estudiantes: parseInt(course.estudiantes_inscritos) || 0,
      rating: parseFloat(course.rating_promedio) || 0,
      contenido: typeof course.contenido === 'string' ? JSON.parse(course.contenido) : course.contenido
    }));
  }

  static async getByCategory(categoria) {
    const query = `
      SELECT c.*, 
             COUNT(i.id) as estudiantes_inscritos,
             AVG(i.calificacion) as rating_promedio
      FROM cursos c
      LEFT JOIN inscripciones i ON c.id = i.curso_id AND i.estado = 'activa'
      WHERE c.categoria = $1 AND c.activo = true
      GROUP BY c.id
      ORDER BY c.fecha_creacion DESC
    `;
    const result = await pool.query(query, [categoria]);
    
    return result.rows.map(course => ({
      ...course,
      estudiantes: parseInt(course.estudiantes_inscritos) || 0,
      rating: parseFloat(course.rating_promedio) || 0,
      contenido: typeof course.contenido === 'string' ? JSON.parse(course.contenido) : course.contenido
    }));
  }

  static async getByProfessor(profesorId) {
    const query = `
      SELECT c.*, 
             COUNT(i.id) as estudiantes_inscritos,
             AVG(i.calificacion) as rating_promedio
      FROM cursos c
      LEFT JOIN inscripciones i ON c.id = i.curso_id AND i.estado = 'activa'
      WHERE c.profesor_id = $1 AND c.activo = true
      GROUP BY c.id
      ORDER BY c.fecha_creacion DESC
    `;
    const result = await pool.query(query, [profesorId]);
    
    return result.rows.map(course => ({
      ...course,
      estudiantes: parseInt(course.estudiantes_inscritos) || 0,
      rating: parseFloat(course.rating_promedio) || 0,
      contenido: typeof course.contenido === 'string' ? JSON.parse(course.contenido) : course.contenido
    }));
  }

  static async updateStudentCount(id) {
    const query = `
      UPDATE cursos 
      SET estudiantes = (
        SELECT COUNT(*) FROM inscripciones 
        WHERE curso_id = $1 AND estado = 'activa'
      ),
      fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [id]);
  }

  static async addStudentToCourse(courseId, userId) {
    // Primero insertar en inscripciones
    const inscriptionQuery = `
      INSERT INTO inscripciones (usuario_id, curso_id)
      VALUES ($1, $2)
      ON CONFLICT (usuario_id, curso_id) DO NOTHING
      RETURNING *
    `;
    
    const inscriptionResult = await pool.query(inscriptionQuery, [userId, courseId]);
    
    // Actualizar contador de estudiantes
    await this.updateStudentCount(courseId);
    
    return inscriptionResult.rows[0];
  }

  static async getStudents(courseId) {
    const query = `
      SELECT u.id, u.nombre, u.email, i.fecha_inscripcion, i.progreso, i.estado
      FROM usuarios u
      JOIN inscripciones i ON u.id = i.usuario_id
      WHERE i.curso_id = $1 AND i.estado = 'activa'
      ORDER BY i.fecha_inscripcion DESC
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async search(searchTerm) {
    const query = `
      SELECT c.*, 
             COUNT(i.id) as estudiantes_inscritos,
             AVG(i.calificacion) as rating_promedio
      FROM cursos c
      LEFT JOIN inscripciones i ON c.id = i.curso_id AND i.estado = 'activa'
      WHERE (c.nombre ILIKE $1 OR c.descripcion ILIKE $1 OR c.categoria ILIKE $1) 
        AND c.activo = true
      GROUP BY c.id
      ORDER BY c.fecha_creacion DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    
    return result.rows.map(course => ({
      ...course,
      estudiantes: parseInt(course.estudiantes_inscritos) || 0,
      rating: parseFloat(course.rating_promedio) || 0,
      contenido: typeof course.contenido === 'string' ? JSON.parse(course.contenido) : course.contenido
    }));
  }
}

module.exports = Course;