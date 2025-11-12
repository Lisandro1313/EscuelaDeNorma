const { pool } = require('../config/database');

class Message {
  static async create(messageData) {
    const { curso_id, usuario_id, mensaje, tipo = 'texto', archivo_url, respuesta_a } = messageData;
    
    const query = `
      INSERT INTO mensajes (curso_id, usuario_id, mensaje, tipo, archivo_url, respuesta_a)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [curso_id, usuario_id, mensaje, tipo, archivo_url, respuesta_a];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getByCourse(courseId, limit = 50, offset = 0) {
    const query = `
      SELECT m.*, u.nombre as usuario_nombre, u.avatar
      FROM mensajes m
      JOIN usuarios u ON m.usuario_id = u.id
      WHERE m.curso_id = $1
      ORDER BY m.fecha_envio DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [courseId, limit, offset]);
    return result.rows.reverse(); // Retornar en orden cronológico
  }

  static async getById(id) {
    const query = `
      SELECT m.*, u.nombre as usuario_nombre, u.avatar
      FROM mensajes m
      JOIN usuarios u ON m.usuario_id = u.id
      WHERE m.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, mensaje) {
    const query = `
      UPDATE mensajes 
      SET mensaje = $2, editado = true
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, mensaje]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM mensajes WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getRecent(limit = 10) {
    const query = `
      SELECT m.*, u.nombre as usuario_nombre, c.nombre as curso_nombre
      FROM mensajes m
      JOIN usuarios u ON m.usuario_id = u.id
      JOIN cursos c ON m.curso_id = c.id
      ORDER BY m.fecha_envio DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Message;