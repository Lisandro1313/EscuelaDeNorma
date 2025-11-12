# 🐘 Configuración de PostgreSQL para Campus Norma

## Opción 1: Docker (Recomendado)

### Instalar PostgreSQL con Docker:

```bash
# Ejecutar PostgreSQL en Docker
docker run --name postgres-campus \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=campus_norma \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d postgres:13

# Verificar que está funcionando
docker ps
```

### Comandos útiles de Docker:

```bash
# Iniciar contenedor existente
docker start postgres-campus

# Detener contenedor
docker stop postgres-campus

# Ver logs
docker logs postgres-campus

# Conectar a la base de datos
docker exec -it postgres-campus psql -U postgres -d campus_norma
```

## Opción 2: Instalación Local

### Windows:
1. Descargar desde: https://www.postgresql.org/download/windows/
2. Instalar con password: `admin`
3. Crear base de datos: `campus_norma`

### macOS:
```bash
# Con Homebrew
brew install postgresql
brew services start postgresql
createdb campus_norma
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb campus_norma
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'admin';"
```

## Configuración del Backend

1. **Verificar archivo `.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campus_norma
DB_USER=postgres
DB_PASSWORD=admin
```

2. **Inicializar base de datos:**
```bash
cd backend
npm run init-db
```

3. **Ejecutar servidor con PostgreSQL:**
```bash
npm run postgres
# o para desarrollo
npm run dev-postgres
```

## Verificación

1. **Probar conexión:**
   - Visita: http://localhost:5000/api/health
   - Debe mostrar: `"database": "connected"`

2. **Usuarios de prueba:**
   - **Admin:** admin@campus.com / password123
   - **Profesor:** profesor@campus.com / password123  
   - **Alumno:** alumno@campus.com / password123

3. **Funcionalidades disponibles:**
   - ✅ Autenticación JWT
   - ✅ CRUD de cursos y usuarios
   - ✅ Chat en tiempo real
   - ✅ Subida de archivos
   - ✅ Sistema de inscripciones
   - ✅ Notificaciones

## Troubleshooting

### Error de conexión:
```bash
# Verificar que PostgreSQL está corriendo
docker ps | grep postgres
# o
sudo systemctl status postgresql
```

### Error de permisos:
```bash
# Asegurar que el usuario postgres existe y tiene permisos
docker exec -it postgres-campus psql -U postgres -c "\du"
```

### Resetear base de datos:
```bash
# Eliminar y recrear contenedor
docker stop postgres-campus
docker rm postgres-campus
# Luego ejecutar el comando docker run nuevamente
```

## Estructura de la Base de Datos

- **usuarios**: Información de estudiantes, profesores y administradores
- **cursos**: Catálogo de cursos disponibles
- **clases**: Clases programadas con fechas y horarios
- **inscripciones**: Relación estudiante-curso con progreso
- **mensajes**: Sistema de chat por curso
- **archivos**: Gestión de archivos subidos
- **pagos**: Historial de pagos y transacciones
- **notificaciones**: Sistema de notificaciones

## Comandos NPM Disponibles

```bash
npm run start          # Servidor producción (sin DB)
npm run dev            # Desarrollo (sin DB)
npm run postgres       # Servidor con PostgreSQL
npm run dev-postgres   # Desarrollo con PostgreSQL  
npm run init-db        # Inicializar base de datos
```