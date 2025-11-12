# 🚀 Guía de Despliegue - Campus Norma

## 📋 Requisitos del Sistema

### Servidor
- **Sistema Operativo**: Ubuntu 20.04 LTS o superior
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Almacenamiento**: Mínimo 10GB disponibles
- **CPU**: 2 cores mínimo

### Software Requerido
- **Node.js**: v18.0.0 o superior
- **NPM**: v8.0.0 o superior
- **PM2**: Para gestión de procesos
- **Nginx**: Como proxy reverso (opcional pero recomendado)
- **PostgreSQL**: Base de datos (producción)
- **Redis**: Para cache y sesiones (opcional)

## 💳 Configuración de MercadoPago

### Credenciales Configuradas
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-7525066950773098-080914-8011d68481be952963a23ec9fc710d69-2591968924
MERCADOPAGO_PUBLIC_KEY=APP_USR-8011d68481be952963a23ec9fc710d69-080914-2591968924
MERCADOPAGO_WEBHOOK_SECRET=kc4XMksMl34GLrydCYhuEDTeheIYeKhc
```

### Funcionalidades Implementadas
- ✅ Pagos únicos por curso
- ✅ Pagos múltiples (carrito)
- ✅ Webhooks para confirmación automática
- ✅ Inscripción automática tras pago exitoso
- ✅ Páginas de resultado (éxito/fallo/pendiente)
- ✅ Integración completa con el sistema

### URLs de Retorno Configuradas
- Éxito: `/payment/success`
- Fallo: `/payment/failure`
- Pendiente: `/payment/pending`
- Webhook: `/api/payments/webhook`

## 🔧 Configuración Rápida

### Iniciar Servidor con MercadoPago

```bash
# Instalar dependencias de MercadoPago
cd backend
npm install mercadopago dotenv helmet cors compression morgan winston

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de MercadoPago

# Iniciar servidor
node server.js
```

### Probar Integración de Pagos

1. **Acceder al sistema**: http://localhost:3000
2. **Registrarse** como estudiante
3. **Ir a catálogo** de cursos
4. **Seleccionar un curso** y hacer clic en "Inscribirse"
5. **Procesar pago** con MercadoPago
6. **Verificar inscripción** automática tras pago exitoso

## 🌐 URLs de Producción

### Configurar Dominio
Actualizar `FRONTEND_URL` y `BACKEND_URL` en `.env`:

```env
FRONTEND_URL=https://campus-norma.com
BACKEND_URL=https://api.campus-norma.com
```

### Webhook de Producción
Configurar en MercadoPago dashboard:
```
https://api.campus-norma.com/api/payments/webhook
```

## 📊 Estado del Sistema

### ✅ Funcionalidades Completas
- Sistema de registro con roles
- Dashboard administrativo completo
- Dashboard especializado para estudiantes
- Sistema de pagos con MercadoPago
- Gestión de cursos y contenido
- 8 sistemas integrados (Notificaciones, Calendario, etc.)

### 🚀 Listo para Producción
- Configuración de seguridad con Helmet
- Compresión GZIP habilitada
- Manejo de errores robusto
- Variables de entorno configuradas
- PM2 para gestión de procesos
- Logs estructurados

---

**Sistema Campus Norma v1.0**  
**Fecha**: Octubre 2024  
**Estado**: ✅ Listo para Producción con MercadoPago