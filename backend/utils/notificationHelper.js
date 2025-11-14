/**
 * Helper para enviar notificaciones de forma simple
 */

const logger = require('./logger');

class NotificationHelper {
  constructor(db, io) {
    this.db = db;
    this.io = io;
    this.Notification = require('../src/models/Notification');
    this.notificationModel = new this.Notification(db);
  }

  /**
   * Enviar notificación a un usuario
   */
  async sendToUser(userId, { title, message, type = 'info', related_type, related_id, action_url }) {
    try {
      // Guardar en base de datos
      const notification = await this.notificationModel.create({
        user_id: userId,
        title,
        message,
        type,
        related_type,
        related_id,
        action_url
      });

      // Enviar por Socket.IO en tiempo real
      if (this.io) {
        this.io.to(`user_${userId}`).emit('newNotification', {
          id: notification.id,
          title,
          message,
          type,
          timestamp: new Date(),
          read: false,
          icon: this.getIconForType(type)
        });
      }

      logger.info(`Notificación enviada a usuario ${userId}: ${title}`);
      return notification;
    } catch (error) {
      logger.error('Error enviando notificación:', error);
      throw error;
    }
  }

  /**
   * Enviar notificación a múltiples usuarios
   */
  async sendToMultipleUsers(userIds, { title, message, type = 'info', related_type, related_id, action_url }) {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title,
        message,
        type,
        related_type,
        related_id,
        action_url
      }));

      // Guardar todas en base de datos
      await this.notificationModel.createBulk(notifications);

      // Enviar por Socket.IO a todos
      if (this.io) {
        userIds.forEach(userId => {
          this.io.to(`user_${userId}`).emit('newNotification', {
            title,
            message,
            type,
            timestamp: new Date(),
            read: false,
            icon: this.getIconForType(type)
          });
        });
      }

      logger.info(`Notificación enviada a ${userIds.length} usuarios: ${title}`);
      return notifications;
    } catch (error) {
      logger.error('Error enviando notificaciones múltiples:', error);
      throw error;
    }
  }

  /**
   * Notificación de nuevo curso disponible
   */
  async notifyNewCourse(course, studentIds) {
    return this.sendToMultipleUsers(studentIds, {
      title: '🎓 Nuevo curso disponible',
      message: `"${course.nombre}" está ahora disponible`,
      type: 'info',
      related_type: 'course',
      related_id: course.id,
      action_url: `/courses/${course.id}`
    });
  }

  /**
   * Notificación de inscripción exitosa
   */
  async notifyEnrollmentSuccess(userId, course) {
    return this.sendToUser(userId, {
      title: '✅ Inscripción exitosa',
      message: `Te has inscrito en "${course.nombre}"`,
      type: 'success',
      related_type: 'enrollment',
      related_id: course.id,
      action_url: `/courses/${course.id}`
    });
  }

  /**
   * Notificación de pago aprobado
   */
  async notifyPaymentApproved(userId, course, amount) {
    return this.sendToUser(userId, {
      title: '💰 Pago aprobado',
      message: `Tu pago de $${amount} para "${course.nombre}" fue aprobado`,
      type: 'success',
      related_type: 'payment',
      related_id: course.id,
      action_url: `/courses/${course.id}`
    });
  }

  /**
   * Notificación de pago rechazado
   */
  async notifyPaymentRejected(userId, course, reason) {
    return this.sendToUser(userId, {
      title: '❌ Pago rechazado',
      message: `Tu pago para "${course.nombre}" fue rechazado. ${reason}`,
      type: 'error',
      related_type: 'payment',
      related_id: course.id,
      action_url: `/payments`
    });
  }

  /**
   * Notificación de nueva lección disponible
   */
  async notifyNewLesson(lesson, course, studentIds) {
    return this.sendToMultipleUsers(studentIds, {
      title: '📚 Nueva lección disponible',
      message: `"${lesson.titulo}" en "${course.nombre}"`,
      type: 'info',
      related_type: 'lesson',
      related_id: lesson.id,
      action_url: `/courses/${course.id}/lessons/${lesson.id}`
    });
  }

  /**
   * Notificación de nuevo comentario en foro
   */
  async notifyNewForumComment(userId, post, commenter) {
    return this.sendToUser(userId, {
      title: '💬 Nuevo comentario',
      message: `${commenter.nombre} comentó en "${post.title}"`,
      type: 'info',
      related_type: 'forum_post',
      related_id: post.id,
      action_url: `/forums/posts/${post.id}`
    });
  }

  /**
   * Notificación de progreso completado
   */
  async notifyProgressMilestone(userId, course, percentage) {
    let emoji = '🎯';
    if (percentage === 100) emoji = '🎉';
    else if (percentage >= 75) emoji = '🌟';
    else if (percentage >= 50) emoji = '💪';

    return this.sendToUser(userId, {
      title: `${emoji} Progreso del ${percentage}%`,
      message: `Has completado el ${percentage}% de "${course.nombre}"`,
      type: 'success',
      related_type: 'progress',
      related_id: course.id,
      action_url: `/courses/${course.id}`
    });
  }

  /**
   * Notificación de certificado disponible
   */
  async notifyCertificateReady(userId, course) {
    return this.sendToUser(userId, {
      title: '🏆 Certificado disponible',
      message: `Tu certificado de "${course.nombre}" está listo para descargar`,
      type: 'success',
      related_type: 'certificate',
      related_id: course.id,
      action_url: `/certificates/${course.id}`
    });
  }

  /**
   * Notificación de nuevo mensaje
   */
  async notifyNewMessage(userId, sender, message) {
    return this.sendToUser(userId, {
      title: '💌 Nuevo mensaje',
      message: `${sender.nombre}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
      type: 'info',
      related_type: 'message',
      related_id: sender.id,
      action_url: `/messages/${sender.id}`
    });
  }

  /**
   * Obtener icono según tipo
   */
  getIconForType(type) {
    const icons = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }
}

module.exports = NotificationHelper;
