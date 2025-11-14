# 🚀 TESTING LOCAL - Empezar AHORA (5 minutos)

## ✅ EL BACKEND YA ESTÁ CORRIENDO

El servidor backend está activo en: **http://localhost:5000**

---

## 🎯 PASO 1: Iniciar el Frontend

### Abrir una nueva terminal PowerShell:

```powershell
cd C:\Users\Usuario\CampusNorma\frontend
npm start
```

**Espera 30 segundos...** El navegador se abrirá automáticamente en:
```
http://localhost:3000
```

---

## 👤 PASO 2: Crear Cuenta de Administrador

Ya existe una cuenta de admin creada:

```
Email:    norma.admin@escuelanorma.com
Password: Norma2025!Secure
```

### Acciones del Admin:
1. **Ver todos los usuarios**
2. **Crear/editar/eliminar usuarios**
3. **Ver estadísticas del sistema**
4. **Ver activity logs**
5. **Gestionar cursos**

---

## 👨‍🏫 PASO 3: Crear Cuenta de Profesor

1. En el navegador, ir a: **http://localhost:3000/register**

2. Registrarse como **Profesor**:
   ```
   Nombre: Juan Pérez
   Email: juan.profesor@escuela.com
   Password: profesor123
   Tipo: Profesor
   ```

3. **Iniciar sesión** con esa cuenta

4. **Crear un curso gratuito:**
   - Título: "Introducción a JavaScript"
   - Descripción: "Aprende los fundamentos..."
   - Precio: **0** (gratis)
   - Categoría: Programación
   - Click en **"Crear curso"**

5. **Agregar módulos y lecciones:**
   - Crear módulo: "Fundamentos"
   - Crear lección: "Variables y Tipos de Datos"
   - Agregar contenido (texto/video)

---

## 🎓 PASO 4: Crear Cuenta de Estudiante

1. **Cerrar sesión** (o abrir navegador en modo incógnito)

2. **Registrarse como Estudiante:**
   ```
   Nombre: María González
   Email: maria.estudiante@gmail.com
   Password: estudiante123
   Tipo: Estudiante
   ```

3. **Explorar catálogo de cursos**

4. **Inscribirse en curso gratuito:**
   - Buscar "Introducción a JavaScript"
   - Click en **"Inscribirse Gratis"**
   - ✅ Deberías recibir una notificación

5. **Ver contenido del curso:**
   - Lecciones disponibles
   - Videos
   - Recursos descargables

---

## 🎮 PASO 5: Probar Funcionalidades

### Como Estudiante:

#### A) Foros
1. Ir a **"Foros"** en el menú
2. Crear un nuevo post: "¿Cómo declaro una variable?"
3. Agregar categoría y contenido
4. Publicar

#### B) Chat en Vivo
1. Ir a **"Chat"** en el menú
2. Seleccionar "Curso: Introducción a JavaScript"
3. Enviar mensaje
4. (Abre otra sesión de estudiante para ver chat en tiempo real)

#### C) Gamificación
1. Ir a **"Gamificación"**
2. Ver tus puntos (recibes puntos por inscribirse, completar lecciones)
3. Ver logros desbloqueados
4. Ver leaderboard

#### D) Progreso
1. Completar una lección
2. Ver barra de progreso del curso
3. Cuando completes 100% → recibirás certificado

---

## 💰 PASO 6: Probar Pagos (MercadoPago Test)

### Crear Curso de Pago (como Profesor):

1. Iniciar sesión como profesor
2. Crear nuevo curso:
   ```
   Título: "React Avanzado"
   Precio: 100  (no poner 0)
   ```

### Comprar Curso (como Estudiante):

1. Iniciar sesión como estudiante
2. Ver curso "React Avanzado"
3. Click en **"Comprar por $100"**
4. Serás redirigido a MercadoPago

**Datos de tarjeta de prueba:**
```
Número: 5031 7557 3453 0604
Vencimiento: 11/25
CVV: 123
Nombre: APRO (para aprobar) o OTHE (para rechazar)
DNI: 12345678
```

5. **Completar pago**
6. Serás redirigido de vuelta
7. ✅ Deberías recibir notificación de "Pago aprobado"
8. ✅ Ahora tendrás acceso al curso

---

## 🔔 PASO 7: Probar Notificaciones

Las notificaciones aparecen en el ícono 🔔 en la barra superior.

**Ya deberías tener notificaciones de:**
- ✅ Inscripción gratuita
- ✅ Pago aprobado (si hiciste la compra)

**Para ver más notificaciones:**
1. Como estudiante, inscríbete a otro curso gratis
2. Como profesor, publica una nueva lección
3. Como estudiante, comenta en un foro

---

## 👥 PASO 8: Probar Panel de Admin

1. Iniciar sesión como admin:
   ```
   norma.admin@escuelanorma.com
   Norma2025!Secure
   ```

2. **Ver Dashboard Admin:**
   - Total de usuarios
   - Total de cursos
   - Ingresos totales
   - Gráficos de crecimiento

3. **Gestionar Usuarios:**
   - Ver lista de todos los usuarios
   - Editar datos de un usuario
   - Desactivar/activar usuario
   - Eliminar usuario

4. **Activity Logs:**
   - Ver todas las acciones del sistema
   - Filtrar por tipo (login, inscripción, pago, etc.)
   - Filtrar por fecha
   - Ver estadísticas

---

## 📱 PASO 9: Probar Desde Otro Dispositivo (Opcional)

Si quieres probar desde tu celular o tablet en la misma red:

1. **Obtener tu IP local:**
   ```powershell
   ipconfig
   # Buscar "IPv4 Address" en "Wi-Fi" o "Ethernet"
   # Ejemplo: 192.168.1.100
   ```

2. **En tu celular/tablet:**
   - Conectar a la misma red Wi-Fi
   - Abrir navegador
   - Ir a: `http://192.168.1.100:3000` (usa tu IP)

3. **Probar:**
   - Registro
   - Login
   - Ver cursos
   - Chat (entre celular y PC en tiempo real)

---

## 🧪 CHECKLIST DE PRUEBAS

### Autenticación:
- [ ] Registrarse como estudiante ✅
- [ ] Registrarse como profesor ✅
- [ ] Iniciar sesión ✅
- [ ] Cerrar sesión ✅

### Cursos (Profesor):
- [ ] Crear curso gratuito ✅
- [ ] Crear curso de pago ✅
- [ ] Crear módulos ✅
- [ ] Crear lecciones ✅
- [ ] Subir archivos ✅
- [ ] Publicar curso ✅

### Cursos (Estudiante):
- [ ] Ver catálogo ✅
- [ ] Inscribirse gratis ✅
- [ ] Comprar con MercadoPago ✅
- [ ] Ver contenido ✅
- [ ] Completar lección ✅
- [ ] Ver progreso ✅

### Foros:
- [ ] Crear post ✅
- [ ] Comentar en post ✅
- [ ] Dar like ✅

### Chat:
- [ ] Enviar mensaje ✅
- [ ] Recibir mensaje en tiempo real ✅

### Gamificación:
- [ ] Ver puntos ✅
- [ ] Ver logros ✅
- [ ] Ver leaderboard ✅

### Notificaciones:
- [ ] Recibir notificación ✅
- [ ] Marcar como leída ✅
- [ ] Eliminar notificación ✅

### Admin:
- [ ] Ver dashboard ✅
- [ ] Gestionar usuarios ✅
- [ ] Ver activity logs ✅

---

## 🐛 Si Algo No Funciona:

### 1. Backend no responde:
```powershell
# Verificar que esté corriendo
Get-Process node

# Si no está, iniciar:
cd backend
node server.js
```

### 2. Frontend no carga:
```powershell
# Detener y reiniciar
# Ctrl+C en la terminal del frontend
npm start
```

### 3. Error de CORS:
```
Verificar que backend esté en puerto 5000
Verificar que frontend esté en puerto 3000
```

### 4. Pagos no funcionan:
```
Es normal - las credenciales son de TEST
Solo funcionan con tarjetas de prueba de MercadoPago
Para pagos reales, configurar credenciales de producción
```

---

## 🎉 ¡LISTO PARA PROBAR!

**URLs Importantes:**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health
- **Admin:** norma.admin@escuelanorma.com / Norma2025!Secure

---

## 📸 Capturas Recomendadas:

Mientras pruebas, toma capturas de:
1. ✅ Dashboard de estudiante con cursos
2. ✅ Panel de profesor creando curso
3. ✅ Foro con discusiones
4. ✅ Chat en tiempo real
5. ✅ Notificaciones funcionando
6. ✅ Panel de admin con estadísticas

Esto te servirá para:
- Mostrar el sistema a usuarios potenciales
- Documentación
- Marketing

---

## ⏰ Tiempo Estimado:

- **Setup inicial:** 5 minutos
- **Crear cuentas y cursos:** 15 minutos
- **Probar todas las funcionalidades:** 30 minutos
- **TOTAL:** ~1 hora para exploración completa

---

¡Disfruta probando tu plataforma! 🚀
