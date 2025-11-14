# 📢 Sistema de Notificaciones - Campus Norma

## ✅ Estado: 100% FUNCIONAL Y CONECTADO

El sistema de notificaciones está **completamente implementado** y **funcionando en tiempo real**.

---

## 🏗️ Arquitectura

### Backend

#### 1. **Modelo de Base de Datos** (`backend/src/models/Notification.js`)
```javascript
- Tabla: notifications
  * id, user_id, title, message, type
  * related_type, related_id
  * read, action_url
  * created_at, read_at

- Tabla: notification_preferences
  * user_id, email_enabled, push_enabled
  * assignment_notifications, message_notifications
  * course_notifications, payment_notifications
```

#### 2. **APIs REST** (`backend/src/routes/notifications.js`)
```javascript
GET    /api/notifications                    // Obtener notificaciones
GET    /api/notifications/unread-count       // Contador no leídas
PUT    /api/notifications/:id/read           // Marcar como leída
PUT    /api/notifications/mark-all-read      // Marcar todas
DELETE /api/notifications/:id                // Eliminar notificación
```

#### 3. **NotificationHelper** (`backend/utils/notificationHelper.js`)
Helper para enviar notificaciones fácilmente desde cualquier parte del código:

```javascript
const notificationHelper = req.app.get('notificationHelper');

// Métodos disponibles:
await notificationHelper.sendToUser(userId, {...})
await notificationHelper.sendToMultipleUsers([ids], {...})
await notificationHelper.notifyNewCourse(course, studentIds)
await notificationHelper.notifyEnrollmentSuccess(userId, course)
await notificationHelper.notifyPaymentApproved(userId, course, amount)
await notificationHelper.notifyPaymentRejected(userId, course, reason)
await notificationHelper.notifyNewLesson(lesson, course, studentIds)
await notificationHelper.notifyNewForumComment(userId, post, commenter)
await notificationHelper.notifyProgressMilestone(userId, course, percentage)
await notificationHelper.notifyCertificateReady(userId, course)
await notificationHelper.notifyNewMessage(userId, sender, message)
```

#### 4. **Socket.IO - Tiempo Real**
```javascript
io.to(`user_${userId}`).emit('newNotification', {...})
```

---

### Frontend

#### 1. **NotificationCenter Component** (`frontend/src/components/Notifications/NotificationCenter.tsx`)

**Características:**
- ✅ Carga notificaciones del usuario al iniciar
- ✅ Muestra contador de no leídas en badge
- ✅ Dropdown con lista de notificaciones
- ✅ Marca como leída al hacer click
- ✅ Botón "Marcar todas como leídas"
- ✅ Botón de eliminar por notificación
- ✅ Escucha Socket.IO para notificaciones en tiempo real
- ✅ Browser notifications (permiso del navegador)

**UI:**
```tsx
<NotificationCenter />  // En Navbar.tsx
```

---

## 🚀 Notificaciones Automáticas Implementadas

### ✅ Ya Funcionando:

#### 1. **Pago Aprobado** (`backend/src/routes/payments.js`)
```javascript
// Cuando MercadoPago confirma un pago
await notificationHelper.notifyPaymentApproved(userId, course, amount)
```
> "💰 Pago aprobado - Tu pago de $X para 'Curso' fue aprobado"

#### 2. **Inscripción Gratuita** (`backend/src/routes/enrollments.js`)
```javascript
// Cuando un usuario se inscribe a curso gratuito
await notificationHelper.notifyEnrollmentSuccess(userId, course)
```
> "✅ Inscripción exitosa - Te has inscrito en 'Curso'"

---

### 📦 Disponibles en Helper (listas para usar):

#### 3. **Nuevo Curso Disponible**
```javascript
await notificationHelper.notifyNewCourse(course, studentIds)
```
> "🎓 Nuevo curso disponible - 'Curso' está ahora disponible"

#### 4. **Nueva Lección**
```javascript
await notificationHelper.notifyNewLesson(lesson, course, studentIds)
```
> "📚 Nueva lección disponible - 'Lección' en 'Curso'"

#### 5. **Nuevo Comentario en Foro**
```javascript
await notificationHelper.notifyNewForumComment(userId, post, commenter)
```
> "💬 Nuevo comentario - Usuario comentó en 'Post'"

#### 6. **Progreso de Curso**
```javascript
await notificationHelper.notifyProgressMilestone(userId, course, percentage)
```
> "🎯 Progreso del 50% - Has completado el 50% de 'Curso'"
> "🎉 Progreso del 100% - ¡Curso completado!"

#### 7. **Certificado Disponible**
```javascript
await notificationHelper.notifyCertificateReady(userId, course)
```
> "🏆 Certificado disponible - Tu certificado está listo"

#### 8. **Nuevo Mensaje**
```javascript
await notificationHelper.notifyNewMessage(userId, sender, message)
```
> "💌 Nuevo mensaje - Usuario: mensaje..."

---

## 💻 Cómo Usar en Tu Código

### Backend - Enviar Notificación

```javascript
// En cualquier ruta o controlador

// 1. Obtener el helper
const notificationHelper = req.app.get('notificationHelper');

// 2. Enviar notificación
if (notificationHelper) {
  await notificationHelper.sendToUser(userId, {
    title: 'Título de la notificación',
    message: 'Mensaje descriptivo',
    type: 'success',  // 'info' | 'success' | 'warning' | 'error'
    related_type: 'course',  // opcional
    related_id: courseId,    // opcional
    action_url: '/courses/123'  // opcional
  });
}

// O usar un método específico
await notificationHelper.notifyPaymentApproved(userId, course, amount);
```

### Frontend - Recibir Notificaciones

El componente `NotificationCenter` ya está integrado en el `Navbar` y:
1. ✅ Carga notificaciones al iniciar sesión
2. ✅ Escucha Socket.IO automáticamente
3. ✅ Actualiza contador en tiempo real
4. ✅ Muestra browser notification si está permitido

---

## 🔧 Tipos de Notificaciones

| Tipo | Color | Emoji | Uso |
|------|-------|-------|-----|
| `info` | Azul | ℹ️ | Información general |
| `success` | Verde | ✅ | Operaciones exitosas |
| `warning` | Amarillo | ⚠️ | Advertencias |
| `error` | Rojo | ❌ | Errores |

---

## 📊 Estructura de una Notificación

```typescript
interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  related_type?: string  // 'course', 'payment', 'forum_post', etc.
  related_id?: number
  action_url?: string    // URL para click
  read: boolean
  created_at: Date
  read_at?: Date
}
```

---

## 🎯 Próximos Pasos (Opcional)

### Funcionalidades Adicionales:

1. **Email Notifications**
   - Enviar emails además de notificaciones in-app
   - Usar NodeMailer o SendGrid

2. **Preferencias por Usuario**
   - Panel de configuración
   - Activar/desactivar tipos de notificaciones
   - Ya existe tabla `notification_preferences`

3. **Notificaciones Push**
   - Web Push API
   - Service Workers
   - Firebase Cloud Messaging

4. **Agrupación de Notificaciones**
   - "3 nuevas notificaciones sobre Curso X"
   - Reduce spam

5. **Historial Completo**
   - Página dedicada a ver todas las notificaciones
   - Filtros por tipo/fecha/leído

---

## 🔍 Verificación

### Cómo probar que funciona:

1. **Iniciar servidor:**
```bash
cd backend
node server.js
```

2. **Iniciar frontend:**
```bash
cd frontend
npm start
```

3. **Pruebas:**
   - Inscríbete en un curso gratuito → Recibirás notificación ✅
   - Realiza un pago → Recibirás notificación cuando se apruebe ✅
   - Revisa el ícono 🔔 en el navbar → Contador de no leídas
   - Click en una notificación → Se marca como leída
   - Socket.IO conectado → Notificaciones en tiempo real

---

## 📝 Archivos Modificados/Creados

### Archivos Nuevos:
```
backend/utils/notificationHelper.js           [NUEVO] Helper completo
SISTEMA_NOTIFICACIONES.md                    [NUEVO] Esta documentación
```

### Archivos Modificados:
```
backend/server.js                            [ACTUALIZADO] Integra helper
backend/src/routes/payments.js               [ACTUALIZADO] Notif pago aprobado
backend/src/routes/enrollments.js            [ACTUALIZADO] Notif inscripción
frontend/.../NotificationCenter.tsx          [ACTUALIZADO] APIs conectadas
```

### Archivos Ya Existentes (funcionando):
```
backend/src/models/Notification.js           [COMPLETO] Modelo DB
backend/src/routes/notifications.js          [COMPLETO] 5 APIs
frontend/src/services/socket.ts              [COMPLETO] Socket.IO
```

---

## ✅ Conclusión

**El sistema de notificaciones está 100% funcional:**

✅ Base de datos con 2 tablas
✅ Modelo completo con todos los métodos
✅ 5 APIs REST funcionando
✅ Helper con 10+ métodos para enviar notificaciones
✅ Socket.IO para tiempo real
✅ Frontend completo con UI
✅ Notificaciones automáticas en pagos e inscripciones
✅ Browser notifications
✅ Contador de no leídas

**¡El sistema está listo para producción!** 🎉

---

## 🆘 Soporte

Si necesitas agregar más tipos de notificaciones, simplemente usa el `NotificationHelper`:

```javascript
const notificationHelper = req.app.get('notificationHelper');
await notificationHelper.sendToUser(userId, {
  title: 'Tu título',
  message: 'Tu mensaje',
  type: 'success'
});
```

¡Así de simple! 🚀
