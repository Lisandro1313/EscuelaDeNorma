const { pool } = require('../config/database');

class User {
  static async create(userData) {
    const { email, password, nombre, tipo = 'alumno', telefono, fecha_nacimiento, biografia } = userData;
    
    const query = `
      INSERT INTO usuarios (email, password, nombre, tipo, telefono, fecha_nacimiento, biografia)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, nombre, tipo, telefono, fecha_nacimiento, biografia, activo, fecha_registro
    `;
    
    const values = [email, password, nombre, tipo, telefono, fecha_nacimiento, biografia];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1 AND activo = true';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, email, nombre, tipo, telefono, fecha_nacimiento, biografia, 
             activo, fecha_registro, ultima_conexion, cursos_inscritos, 
             cursos_dictados, progreso
      FROM usuarios WHERE id = $1 AND activo = true
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateLastConnection(id) {
    const query = 'UPDATE usuarios SET ultima_conexion = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async enrollInCourse(userId, courseId) {
    const query = `
      UPDATE usuarios 
      SET cursos_inscritos = array_append(cursos_inscritos, $2)
      WHERE id = $1 AND NOT ($2 = ANY(cursos_inscritos))
      RETURNING cursos_inscritos
    `;
    const result = await pool.query(query, [userId, courseId]);
    
    // También crear registro en la tabla de inscripciones
    await pool.query(`
      INSERT INTO inscripciones (usuario_id, curso_id)
      VALUES ($1, $2)
      ON CONFLICT (usuario_id, curso_id) DO NOTHING
    `, [userId, courseId]);
    
    return result.rows[0];
  }

  static async updateProgress(userId, courseId, progress) {
    const query = `
      UPDATE usuarios 
      SET progreso = jsonb_set(progreso, '{${courseId}}', $3)
      WHERE id = $1
    `;
    await pool.query(query, [userId, courseId, progress]);
  }

  static async getAll() {
    const query = `
      SELECT id, email, nombre, tipo, fecha_registro, ultima_conexion, activo
      FROM usuarios WHERE activo = true
      ORDER BY fecha_registro DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = User;