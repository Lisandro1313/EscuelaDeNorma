# 🧪 PLAN DE TEST COMPLETO - CAMPUS NORMA
## Test de Producción para Entrega Final

---

## 📋 **RESUMEN EJECUTIVO**

Este documento contiene el plan de pruebas completo del sistema Campus Norma, diseñado para validar todas las funcionalidades antes de la entrega final.

**Última actualización:** 11 de Noviembre de 2025
**Estado:** ✅ Listo para ejecutar

---

## 🎯 **OBJETIVOS DEL TEST**

1. ✅ Validar flujo completo de registro y autenticación
2. ✅ Verificar creación y gestión de cursos
3. ✅ Probar inscripción gratuita y de pago
4. ✅ Validar sistema de contenido (módulos y lecciones)
5. ✅ Verificar visualización de cursos por estudiantes
6. ✅ Probar chat en tiempo real
7. ✅ Validar perfiles y permisos
8. ✅ Verificar integración con MercadoPago
9. ✅ Probar funcionalidades avanzadas (calendario, evaluaciones)

---

## 🔧 **PRE-REQUISITOS**

### Antes de Empezar
- ✅ Backend corriendo en puerto 5000
- ✅ Frontend corriendo en puerto 3000
- ✅ Base de datos SQLite inicializada
- ✅ Navegador con cookies habilitadas

### Cuentas de Prueba Disponibles
```
👨‍🎓 Estudiante:
   Email: alumno@test.com
   Pass: 123456

👨‍🏫 Profesor:
   Email: profesor@test.com
   Pass: 123456

👩‍💼 Administrador:
   Email: admin@campusnorma.com
   Pass: admin123
```

---

## 📝 **CASOS DE PRUEBA**

---

### **TEST 1: REGISTRO Y AUTENTICACIÓN** ⚡
**Objetivo:** Validar que nuevos usuarios pueden registrarse e iniciar sesión

#### 1.1 Registro de Estudiante
1. Ir a http://localhost:3000
2. Click en "Comenzar Ahora" o "Registrarse"
3. Seleccionar tipo "Estudiante" 👩‍🎓
4. Completar formulario:
   - Nombre: "Juan Pérez"
   - Email: "juan.perez@test.com"
   - Contraseña: "123456"
   - Confirmar contraseña: "123456"
5. Click en "Registrarse"

**✅ Resultado esperado:**
- Redirige a Dashboard
- Muestra mensaje de bienvenida
- Token guardado en localStorage

---

#### 1.2 Registro de Profesor
1. Logout del usuario anterior
2. Click en "Registrarse"
3. Seleccionar tipo "Profesor" 👨‍🏫
4. Completar formulario:
   - Nombre: "María González"
   - Email: "maria.prof@test.com"
   - Contraseña: "123456"
   - Confirmar contraseña: "123456"
   - **Código de Profesor: "PROF2024"** ⚠️
5. Click en "Registrarse"

**✅ Resultado esperado:**
- Acepta código PROF2024, DOCENTE123, o MAESTRO456
- Redirige a Dashboard de profesor
- Muestra opciones para crear cursos

---

#### 1.3 Login con Cuenta Existente
1. Logout
2. Ir a Login
3. Usar credenciales:
   - Email: alumno@test.com
   - Pass: 123456
4. Click en "Iniciar Sesión"

**✅ Resultado esperado:**
- Login exitoso
- Redirige a Dashboard
- Muestra cursos inscritos

---

#### 1.4 Login con Botones de Prueba Rápida
1. En página de Login
2. Click en botón "👨‍🎓 Alumno: alumno@test.com / 123456"

**✅ Resultado esperado:**
- Login automático instantáneo
- No requiere escribir credenciales

---

### **TEST 2: CREACIÓN Y GESTIÓN DE CURSOS (PROFESOR)** 📚
**Objetivo:** Validar que profesores pueden crear y gestionar cursos

#### 2.1 Crear Curso Nuevo
1. Login como profesor (profesor@test.com)
2. Ir a "Mis Cursos" o "Dashboard"
3. Click en "Crear Curso"
4. Completar:
   - Nombre: "React Avanzado 2024"
   - Descripción: "Aprende React con Hooks, Context y Redux"
   - Categoría: "Programación"
   - Precio: 15000 (para curso de pago)
   - Duración: "40 horas"
5. Click en "Crear Curso"

**✅ Resultado esperado:**
- Curso creado exitosamente
- Aparece en "Mis Cursos"
- Estado: "Borrador" (no publicado)

---

#### 2.2 Crear Curso GRATUITO
1. Crear nuevo curso con los mismos pasos
2. **Nombre:** "Introducción a Python - GRATIS"
3. **Precio: 0** ⚠️ (IMPORTANTE)
4. Resto de datos igual
5. Guardar

**✅ Resultado esperado:**
- Curso con precio = 0 guardado
- Debe permitir inscripción directa sin pago

---

#### 2.3 Agregar Módulos al Curso
1. Entrar al curso "React Avanzado 2024"
2. Click en "Gestionar Contenido"
3. Click en "➕ Nuevo Módulo"
4. **Completar MODAL NUEVO (mejorado):**
   - 📌 Título: "Módulo 1: Introducción"
   - 📝 Descripción: "Fundamentos de React y setup del proyecto"
   - 🔢 Orden: 1
5. Click en "✨ Crear Módulo"

**✅ Resultado esperado:**
- Modal grande y cómodo
- Campos bien espaciados y claros
- Módulo creado y visible en lista
- Icono de ✅ Módulo Creado

---

#### 2.4 Agregar Lecciones a Módulo
1. En el módulo creado, click en "➕ Lección"
2. **Completar MODAL NUEVO (mejorado):**
   - 📌 Título: "Instalación y Configuración"
   - 🎯 Tipo: 🎥 Video
   - 🔢 Orden: 1
   - ⏱️ Duración: 15 minutos
   - 📄 Contenido: "En esta lección aprenderás a instalar React..."
3. **Sección de Recursos Adicionales:**
   - ➕ Agregar Recurso
   - Tipo: 🎥 Video
   - Título: "Video Tutorial"
   - URL: https://youtube.com/example
4. Click en "✨ Crear Lección"

**✅ Resultado esperado:**
- Modal de lección GRANDE con scroll
- Formulario organizado en secciones claras
- Headers con degradados (verde-teal)
- Recurso agregado y visible
- Lección creada exitosamente

---

#### 2.5 Crear Múltiples Lecciones de Diferentes Tipos
Crear 3 lecciones más:

**Lección 2:**
- Título: "¿Qué son los Componentes?"
- Tipo: 📝 Texto
- Duración: 10 min
- Contenido: "Los componentes son..."

**Lección 3:**
- Título: "Documentación Oficial"
- Tipo: 📋 PDF
- Duración: 20 min

**Lección 4:**
- Título: "Quiz Final del Módulo"
- Tipo: 🧩 Quiz
- Duración: 15 min

**✅ Resultado esperado:**
- 4 lecciones creadas con diferentes tipos
- Cada una con su icono distintivo
- Ordenadas correctamente
- Badges de colores según tipo

---

### **TEST 3: INSCRIPCIÓN A CURSOS** 💳
**Objetivo:** Validar inscripción gratuita y de pago

#### 3.1 Inscripción a Curso GRATUITO (Nuevo Flujo)
1. Logout del profesor
2. Login como alumno@test.com
3. Ir a "Catálogo de Cursos"
4. Buscar curso "Introducción a Python - GRATIS" (precio = $0)
5. Click en el curso
6. Verificar que muestra **"GRATIS"** en lugar de precio
7. Click en **"Inscribirse Ahora"**

**✅ Resultado esperado:**
- **NO redirige a MercadoPago** ⚡
- Inscripción DIRECTA sin pago
- Mensaje: "¡Te has inscrito exitosamente!"
- El curso aparece en "Mis Cursos"
- Puede acceder al contenido inmediatamente

---

#### 3.2 Inscripción a Curso de PAGO
1. En catálogo, buscar "React Avanzado 2024" (precio > 0)
2. Click en el curso
3. Verificar precio: "$15,000"
4. Click en "Inscribirse"

**✅ Resultado esperado:**
- **SÍ redirige a página de pago**
- Muestra resumen del curso
- Botón "💳 Pagar con MercadoPago"
- Información de seguridad visible

---

#### 3.3 Proceso de Pago con MercadoPago
1. En página de pago, click en "Pagar con MercadoPago"
2. **Debería redirigir a sandbox de MercadoPago**

**✅ Resultado esperado:**
- Redirige a checkout de MercadoPago
- Muestra datos del curso
- Preferencia creada en backend
- Webhook configurado para notificaciones

**⚠️ NOTA:** Si MercadoPago no está configurado:
- Muestra modo DEMO
- Permite simular pago exitoso
- Inscribe al usuario igual

---

### **TEST 4: VISUALIZACIÓN DE CONTENIDO (ESTUDIANTE)** 📖
**Objetivo:** Validar que estudiantes pueden ver y completar lecciones

#### 4.1 Acceder a Curso Inscrito
1. Como alumno@test.com
2. Ir a "Mis Cursos"
3. Click en curso "Introducción a Python - GRATIS"
4. Click en "Ver Contenido"

**✅ Resultado esperado:**
- Vista dividida: Sidebar con módulos + Contenido
- Lista de lecciones visible
- Primera lección seleccionada automáticamente

---

#### 4.2 Navegar Entre Lecciones
1. En sidebar, click en diferentes lecciones
2. Verificar cada tipo:
   - 📝 Texto: Muestra contenido formateado
   - 🎥 Video: Muestra reproductor (o mensaje)
   - 📋 PDF: Muestra visor o link
   - 🧩 Quiz: Muestra preguntas (si implementado)

**✅ Resultado esperado:**
- Contenido cambia dinámicamente
- Lección actual resaltada en sidebar
- Recursos adicionales visibles

---

#### 4.3 Marcar Lección como Completada
1. Al final de una lección
2. Click en "Marcar como Completada"

**✅ Resultado esperado:**
- Checkbox marcado con ✅
- Barra de progreso actualizada
- Progreso guardado en backend

---

#### 4.4 Ver Progreso del Curso
1. Verificar barra de progreso en cada módulo
2. Verificar progreso general del curso

**✅ Resultado esperado:**
- Progreso calculado: (lecciones completadas / total) * 100
- Actualiza en tiempo real
- Persiste al refrescar página

---

### **TEST 5: CHAT EN TIEMPO REAL** 💬
**Objetivo:** Validar sistema de chat con Socket.IO

#### 5.1 Abrir Chat en Curso
1. Como alumno, dentro de un curso
2. Click en icono de Chat (si visible)
3. Escribir mensaje: "Hola, tengo una duda"
4. Enviar

**✅ Resultado esperado:**
- Mensaje enviado
- Aparece con nombre y timestamp
- Guardado en base de datos

---

#### 5.2 Chat Multiusuario
1. Abrir 2 ventanas de navegador
2. Login en una como alumno@test.com
3. Login en otra como profesor@test.com
4. Ambos entrar al mismo curso
5. Escribir mensajes desde ambas cuentas

**✅ Resultado esperado:**
- Mensajes aparecen en TIEMPO REAL en ambas ventanas
- Sin necesidad de refrescar
- Socket.IO funciona correctamente

---

### **TEST 6: PERFILES Y PERMISOS** 👤
**Objetivo:** Validar permisos según roles

#### 6.1 Permisos de Estudiante
Como alumno@test.com verificar:
- ✅ PUEDE: Ver catálogo, inscribirse, ver contenido
- ❌ NO PUEDE: Crear cursos, editar lecciones, ver gestión

---

#### 6.2 Permisos de Profesor
Como profesor@test.com verificar:
- ✅ PUEDE: Crear cursos, editar contenido, ver estudiantes
- ❌ NO PUEDE: Editar cursos de otros profesores
- ✅ PUEDE: Ver solo sus propios cursos en gestión

---

#### 6.3 Permisos de Administrador
Como admin@campusnorma.com verificar:
- ✅ PUEDE: Ver todos los cursos
- ✅ PUEDE: Ver usuarios
- ✅ PUEDE: Acceder a estadísticas
- ✅ PUEDE: Gestionar cualquier curso

---

### **TEST 7: EDICIÓN Y ACTUALIZACIÓN** ✏️
**Objetivo:** Validar edición de contenido existente

#### 7.1 Editar Módulo
1. Como profesor en gestión de curso
2. Click en "Editar" de un módulo
3. Cambiar título y descripción
4. Guardar

**✅ Resultado esperado:**
- Modal se abre con datos pre-cargados
- Cambios guardados correctamente
- Vista actualizada

---

#### 7.2 Editar Lección
1. Click en "✏️ Editar" de una lección
2. Cambiar contenido
3. Agregar un recurso adicional
4. Guardar

**✅ Resultado esperado:**
- Modal grande con scroll
- Datos pre-cargados
- Recursos existentes visibles
- Nuevo recurso agregado

---

#### 7.3 Eliminar Contenido
1. Eliminar una lección
2. Confirmar popup
3. Eliminar un módulo (con sus lecciones)

**✅ Resultado esperado:**
- Confirmación antes de eliminar
- Eliminación en cascada
- Vista actualizada

---

### **TEST 8: FUNCIONALIDADES AVANZADAS** 🚀
**Objetivo:** Probar calendario y evaluaciones (si están implementadas)

#### 8.1 Calendario de Eventos
1. Como profesor, ir a Calendario
2. Crear evento:
   - Título: "Clase en vivo"
   - Fecha: Mañana
   - Hora: 18:00
   - Link: https://meet.google.com/xyz
3. Guardar

**✅ Resultado esperado:**
- Evento creado
- Visible en calendario
- Estudiantes inscritos ven el evento

---

#### 8.2 Sistema de Evaluaciones
1. Como profesor, crear quiz en lección tipo "Quiz"
2. Agregar preguntas con opciones múltiples
3. Como estudiante, responder quiz
4. Ver resultados

**✅ Resultado esperado:**
- Quiz funcional
- Calificación automática
- Resultados guardados

---

### **TEST 9: INTERFAZ Y UX** 🎨
**Objetivo:** Validar mejoras visuales

#### 9.1 Modales Mejorados
Verificar nuevos modales:
- ✅ Modal de Módulo: Tamaño grande, header con degradado azul-púrpura
- ✅ Modal de Lección: Extra grande con scroll, header verde-teal
- ✅ Campos bien espaciados con iconos
- ✅ Sección de recursos con diseño card
- ✅ Botones con iconos y hover effects

---

#### 9.2 CourseManagement UI
Verificar pantalla de gestión:
- ✅ Header con degradado
- ✅ Cards de módulos con sombras
- ✅ Badges de tipos de lección con colores
- ✅ Botones con iconos modernos
- ✅ Empty states con ilustraciones

---

### **TEST 10: RENDIMIENTO Y ESTABILIDAD** ⚡
**Objetivo:** Validar que el sistema es estable

#### 10.1 Carga de Datos
1. Crear curso con 5 módulos
2. Cada módulo con 10 lecciones
3. Cargar vista de gestión

**✅ Resultado esperado:**
- Carga en menos de 3 segundos
- No hay errores en consola
- Scroll fluido

---

#### 10.2 Prueba de Estrés
1. Abrir múltiples pestañas
2. Login en cada una con diferentes usuarios
3. Navegar por el sistema
4. Crear contenido

**✅ Resultado esperado:**
- Sin caídas del servidor
- Respuestas rápidas
- Socket.IO estable

---

## 🐛 **BUGS CONOCIDOS Y LIMITACIONES**

### Issues Actuales
1. **MercadoPago en Modo Demo**
   - Status: ⚠️ Requiere configuración de credenciales de producción
   - Workaround: Modo demo funcional para pruebas

2. **Upload de Archivos**
   - Status: ⚠️ Solo URLs externas por ahora
   - Workaround: Usar links de Google Drive, YouTube, etc.

3. **Notificaciones**
   - Status: ⚠️ No hay sistema de notificaciones push
   - Workaround: Notificaciones en dashboard

---

## ✅ **CHECKLIST FINAL DE VALIDACIÓN**

Antes de dar por completado el test, verificar:

- [ ] Registro de estudiante funciona
- [ ] Registro de profesor con código funciona
- [ ] Login con cuentas de prueba funciona
- [ ] Creación de cursos gratis funciona
- [ ] Creación de cursos pagos funciona
- [ ] Modal de módulo se ve bien y funciona
- [ ] Modal de lección se ve bien y funciona
- [ ] Inscripción gratuita directa (sin MercadoPago)
- [ ] Inscripción de pago redirige a pago
- [ ] Estudiante puede ver contenido
- [ ] Progreso se guarda correctamente
- [ ] Chat en tiempo real funciona
- [ ] Permisos por rol funcionan
- [ ] Edición de contenido funciona
- [ ] Eliminación de contenido funciona
- [ ] UI/UX mejorado visible
- [ ] No hay errores críticos en consola

---

## 📊 **RESULTADOS ESPERADOS**

### Métricas de Éxito
- ✅ 100% de funcionalidades core funcionando
- ✅ UI moderna y profesional
- ✅ Sistema estable sin crashes
- ✅ Tiempos de respuesta < 2 segundos
- ✅ Experiencia fluida en navegación

---

## 🚀 **PRÓXIMOS PASOS POST-TEST**

1. **Si todos los tests pasan:**
   - ✅ Sistema listo para entrega
   - 📝 Generar documentación final
   - 🎥 Preparar demo para presentación

2. **Si hay fallos:**
   - 🐛 Documentar bugs encontrados
   - 🔧 Priorizar fixes críticos
   - 🔄 Re-ejecutar tests afectados

---

## 📞 **CONTACTO Y SOPORTE**

**Desarrollador:** GitHub Copilot & Usuario
**Fecha Entrega:** Por definir
**Versión Sistema:** 1.0.0
**Stack:** React + TypeScript + Node.js + SQLite + Socket.IO

---

## 🎯 **CONCLUSIÓN**

Este plan de test cubre:
- ✅ Autenticación completa
- ✅ CRUD de cursos
- ✅ Inscripciones (gratis y pagas)
- ✅ Visualización de contenido
- ✅ Chat en tiempo real
- ✅ Permisos y roles
- ✅ UI/UX mejorado
- ✅ Funcionalidades avanzadas

**¡Ejecuta estos tests y documenta los resultados antes de la entrega final!** 🚀

---

**Última actualización:** 11 de Noviembre de 2025
