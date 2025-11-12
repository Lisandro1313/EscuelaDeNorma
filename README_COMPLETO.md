# 🎓 Campus Virtual - Sistema Completo de Gestión Educativa

Un sistema completo de campus virtual con funcionalidades avanzadas para gestión educativa, pagos integrados, chat en tiempo real y más.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

#### 🔐 Autenticación y Autorización
- Sistema de login con JWT
- Roles de usuario (Estudiante, Profesor, Administrador)
- Protección de rutas
- Sesiones persistentes

#### 💬 Chat en Tiempo Real
- Chat por curso usando Socket.io
- Mensajes instantáneos
- Conexión automática por curso
- Estado de conexión en tiempo real

#### 💳 Sistema de Pagos
- **Integración completa con MercadoPago**
- Creación de preferencias de pago
- Procesamiento de webhooks
- Modo demo para desarrollo
- Validación de tarjetas de crédito
- Formateo de moneda
- Confirmación de pagos

#### 📚 Gestión de Cursos
- Catálogo completo de cursos
- Vista detallada de cursos
- Sistema de inscripciones
- Clases en vivo y grabadas
- Gestión de recursos

#### 📁 Gestión de Archivos
- Subida de archivos con Multer
- Validación de tipos de archivo
- Almacenamiento organizado
- Límites de tamaño

#### 🗄️ Base de Datos
- **PostgreSQL** como base de datos principal
- Esquema completo con relaciones
- Fallback a base de datos en memoria
- Detección automática de disponibilidad

### 🛠️ Tecnologías Utilizadas

#### Backend
- **Node.js** con Express
- **Socket.io** para tiempo real
- **PostgreSQL** con driver pg
- **JWT** para autenticación
- **MercadoPago SDK** para pagos
- **Multer** para archivos
- **Helmet** para seguridad
- **CORS** configurado
- **dotenv** para variables de entorno

#### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Context API** para estado global
- **Socket.io-client** para tiempo real

## 📁 Estructura del Proyecto

```
CampusNorma/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Configuración PostgreSQL
│   │   │   └── schema.js            # Esquema completo de BD
│   │   ├── models/
│   │   │   ├── User.js              # Modelo de usuarios
│   │   │   ├── Course.js            # Modelo de cursos
│   │   │   └── Message.js           # Modelo de mensajes
│   │   └── services/
│   │       └── MercadoPagoService.js # Servicio de pagos
│   ├── uploads/                     # Archivos subidos
│   ├── server.js                    # Servidor principal
│   ├── .env                         # Variables de entorno
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   └── Login.tsx        # Componente de login
│   │   │   ├── Courses/
│   │   │   │   ├── CourseCatalog.tsx # Catálogo de cursos
│   │   │   │   └── CourseDetail.tsx  # Detalle del curso
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.tsx     # Panel principal
│   │   │   ├── Landing/
│   │   │   │   └── LandingPage.tsx   # Página de inicio
│   │   │   ├── Layout/
│   │   │   │   └── Navbar.tsx        # Barra de navegación
│   │   │   └── Payment/
│   │   │       └── PaymentPage.tsx   # Página de pago
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Contexto de autenticación
│   │   ├── services/
│   │   │   ├── api.ts               # Cliente API
│   │   │   ├── payment.ts           # Servicio de pagos
│   │   │   └── socket.ts            # Cliente Socket.io
│   │   └── App.tsx                  # Componente principal
│   ├── server.js                    # Servidor estático
│   └── package.json
└── README.md                        # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+ (opcional, hay fallback)
- Cuenta de MercadoPago para pagos reales

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd CampusNorma
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

#### Variables de Entorno (.env)
```env
# Base de datos
DATABASE_URL=postgresql://username:password@localhost:5432/campus_virtual
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campus_virtual
DB_USER=username
DB_PASSWORD=password

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_de_mercadopago
MERCADOPAGO_DEMO_MODE=true

# Servidor
PORT=5000
FRONTEND_URL=http://localhost:3000

# Socket.io
SOCKET_ORIGINS=http://localhost:3000
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
```

### 4. Configurar PostgreSQL (Opcional)

#### Opción A: Docker
```bash
docker run --name postgres-campus \
  -e POSTGRES_DB=campus_virtual \
  -e POSTGRES_USER=campus_user \
  -e POSTGRES_PASSWORD=campus_pass \
  -p 5432:5432 \
  -d postgres:15
```

#### Opción B: Instalación Local
1. Instalar PostgreSQL
2. Crear base de datos `campus_virtual`
3. Ejecutar el esquema desde `backend/src/config/schema.js`

### 5. Ejecutar la Aplicación

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🔄 Flujo de Trabajo

### 1. Autenticación
1. Usuario accede a landing page
2. Hace login con credenciales
3. Obtiene JWT token
4. Navega al dashboard

### 2. Explorar Cursos
1. Accede al catálogo desde el navbar
2. Filtra cursos por categoría/búsqueda
3. Ve detalles del curso
4. Decide comprar

### 3. Proceso de Pago
1. Hace clic en "Comprar Curso"
2. Redirección a página de pago
3. Selecciona método de pago
4. Procesa con MercadoPago
5. Confirmación de inscripción

### 4. Acceso al Curso
1. Curso aparece como "Inscrito"
2. Acceso al chat en tiempo real
3. Visualización de clases
4. Descarga de recursos

## 🧪 Datos de Demostración

### Usuarios de Prueba
```javascript
// Estudiante
{
  email: "estudiante@demo.com",
  password: "123456",
  tipo: "estudiante"
}

// Profesor
{
  email: "profesor@demo.com", 
  password: "123456",
  tipo: "profesor"
}

// Administrador
{
  email: "admin@demo.com",
  password: "123456", 
  tipo: "admin"
}
```

### Cursos Disponibles
- Desarrollo Web Frontend con React ($299.99)
- Diseño UX/UI Profesional ($249.99)
- Marketing Digital Avanzado ($199.99)
- Python para Data Science ($349.99)
- Inglés de Negocios ($179.99)
- Finanzas Personales ($149.99)

## 💳 Configuración de MercadoPago

### Modo Demo (Desarrollo)
```javascript
// En .env
MERCADOPAGO_DEMO_MODE=true
MERCADOPAGO_ACCESS_TOKEN=TEST-token-aqui
```

### Modo Producción
```javascript
// En .env
MERCADOPAGO_DEMO_MODE=false
MERCADOPAGO_ACCESS_TOKEN=APP_USR-token-real-aqui
```

### Tarjetas de Prueba (Modo Demo)
```
Visa: 4509 9535 6623 3704
CVV: 123
Vencimiento: 11/25
Nombre: APRO

Mastercard: 5031 7557 3453 0604  
CVV: 123
Vencimiento: 11/25
Nombre: APRO
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario

### Cursos
- `GET /api/courses` - Listar cursos
- `GET /api/courses/:id` - Obtener curso
- `POST /api/courses/:id/enroll` - Inscribirse a curso

### Pagos
- `POST /api/payment/create` - Crear preferencia de pago
- `POST /api/payment/webhook` - Webhook de MercadoPago
- `GET /api/payment/status/:id` - Estado del pago

### Archivos
- `POST /api/upload` - Subir archivo
- `GET /api/files/:filename` - Descargar archivo

## 🔒 Seguridad

### Medidas Implementadas
- Helmet para headers de seguridad
- CORS configurado apropiadamente
- JWT con expiración
- Validación de entrada
- Sanitización de archivos
- Rate limiting (recomendado para producción)

## 🚀 Deployment

### Variables de Entorno para Producción
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
MERCADOPAGO_ACCESS_TOKEN=APP_USR-real-token
MERCADOPAGO_DEMO_MODE=false
JWT_SECRET=super-secure-secret
FRONTEND_URL=https://tu-dominio.com
```

### Docker (Opcional)
```dockerfile
# Ejemplo de Dockerfile para backend
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

## 🧪 Testing

### Funcionalidades a Probar
1. ✅ Login/logout funcionando
2. ✅ Navegación entre páginas
3. ✅ Catálogo de cursos cargando
4. ✅ Detalle de curso mostrando información
5. ✅ Redirección a pago desde curso
6. ✅ Configuración de MercadoPago cargando
7. ✅ Chat en tiempo real (requiere usuarios múltiples)
8. ✅ Subida de archivos
9. ✅ Base de datos PostgreSQL (si disponible)
10. ✅ Fallback a memoria si no hay PostgreSQL

## 📈 Próximas Funcionalidades

### En Desarrollo
- [ ] Videollamadas para clases en vivo
- [ ] Sistema de calificaciones
- [ ] Notificaciones push
- [ ] Dashboard de analytics para profesores
- [ ] Sistema de certificados
- [ ] App móvil con React Native

### Mejoras Técnicas
- [ ] Tests unitarios e integración
- [ ] CI/CD pipeline
- [ ] Monitoreo y logging
- [ ] Cache con Redis
- [ ] CDN para archivos estáticos
- [ ] Backup automático de base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

### Problemas Comunes

#### PostgreSQL no disponible
- El sistema automáticamente usa base de datos en memoria
- Funcionalidad completa disponible sin PostgreSQL

#### MercadoPago error de configuración
- Verificar ACCESS_TOKEN en .env
- Usar modo demo para desarrollo
- Verificar conectividad a internet

#### Socket.io no conecta
- Verificar CORS en backend
- Verificar URL de frontend en .env
- Revisar firewall/proxy

### Contacto
- Email: soporte@campusvirtual.com
- Issues: GitHub Issues
- Documentación: Wiki del proyecto

---

🎓 **Campus Virtual** - Sistema completo de gestión educativa con tecnologías modernas y integración de pagos.

*Desarrollado con ❤️ usando React, Node.js, PostgreSQL y MercadoPago*