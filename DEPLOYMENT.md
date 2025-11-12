# 🚀 Guía de Deployment - Campus Virtual Norma

## 📋 Opciones de Hosting Recomendadas

### 🎨 **Frontend (React + TypeScript + Vite)**

#### **Opción 1: Vercel (RECOMENDADO)**
- ✅ **Ventajas:** Fácil deployment, CDN global, dominio gratis, SSL automático
- 💰 **Costo:** Gratis para proyectos personales
- 🔗 **Deploy:** Conectar repo GitHub → Deploy automático

#### **Opción 2: Netlify**
- ✅ **Ventajas:** Similar a Vercel, interfaz amigable
- 💰 **Costo:** Gratis con límites generosos

### 🔧 **Backend (Node.js + Express + Socket.IO)**

#### **Opción 1: Railway (RECOMENDADO)**
- ✅ **Ventajas:** PostgreSQL incluído, fácil configuración, WebSocket support
- 💰 **Costo:** $5/mes con $5 gratis mensuales
- 🔗 **Deploy:** Conectar repo GitHub → Deploy automático

#### **Opción 2: Heroku**
- ✅ **Ventajas:** Tradicional, muchos addons
- ⚠️ **Limitación:** Ya no tiene plan gratuito
- 💰 **Costo:** $7/mes + $9/mes por PostgreSQL

#### **Opción 3: Render**
- ✅ **Ventajas:** Buen plan gratuito
- ⚠️ **Limitación:** Se duerme después de 15 min de inactividad

### 🗄️ **Base de Datos**

#### **Opción 1: Railway PostgreSQL (incluído)**
- ✅ Viene con el hosting del backend
- 💾 512MB gratis, luego escalable

#### **Opción 2: Supabase**
- ✅ PostgreSQL gratuito hasta 500MB
- 🔗 **URL:** supabase.com

#### **Opción 3: Neon**
- ✅ PostgreSQL serverless, plan gratuito generoso
- 🔗 **URL:** neon.tech

---

## 🛠️ Pasos para Deployment

### 1. **Preparar el Backend**

```bash
# 1. Crear cuenta en Railway
# 2. Conectar repo de GitHub
# 3. Configurar variables de entorno:

PORT=5000
NODE_ENV=production
JWT_SECRET=tu_jwt_secret_super_seguro
DATABASE_URL=postgresql://...  # Railway lo provee automáticamente
MERCADOPAGO_ACCESS_TOKEN=APP_USR_tu_token_real
MERCADOPAGO_PUBLIC_KEY=APP_USR_tu_public_key_real
FRONTEND_URL=https://tu-dominio.vercel.app
CORS_ORIGIN=https://tu-dominio.vercel.app
```

### 2. **Preparar el Frontend**

```bash
# 1. Actualizar la URL del API en el frontend
# En src/services/api.ts cambiar:
const API_BASE_URL = 'https://tu-backend.railway.app/api';

# 2. Build del frontend
npm run build

# 3. Deploy en Vercel
# - Conectar repo GitHub
# - Vercel detecta automáticamente Vite
# - Deploy automático
```

### 3. **Configurar MercadoPago para Producción**

1. **Crear cuenta de vendedor en MercadoPago**
2. **Obtener credenciales de producción:**
   - Ir a: developers.mercadopago.com
   - Crear aplicación
   - Copiar ACCESS_TOKEN y PUBLIC_KEY de PRODUCCIÓN
3. **Configurar en variables de entorno del backend**

---

## 🔒 Configuraciones de Seguridad

### **Backend (server.js)**
```javascript
// Configurar CORS para producción
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Configurar Socket.IO para producción
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});
```

### **Frontend**
- ✅ Variables de entorno para URLs del API
- ✅ HTTPS obligatorio en producción
- ✅ Configurar dominio personalizado

---

## 📊 Estimación de Costos Mensuales

### **Opción Económica (Railway + Vercel)**
- 🎨 Frontend (Vercel): **$0** (gratis)
- 🔧 Backend + DB (Railway): **$0-5** (primer mes gratis)
- **Total: $0-5/mes**

### **Opción Professional (Heroku + Vercel)**
- 🎨 Frontend (Vercel): **$0** (gratis)
- 🔧 Backend (Heroku): **$7/mes**
- 🗄️ PostgreSQL: **$9/mes**
- **Total: $16/mes**

---

## 🌐 Dominios Personalizados

### **Frontend**
- Vercel: Dominio gratis `.vercel.app` o personalizado
- Netlify: Dominio gratis `.netlify.app` o personalizado

### **Backend**
- Railway: Dominio gratis `.railway.app` o personalizado
- Heroku: Dominio gratis `.herokuapp.com` o personalizado

---

## ✅ Checklist de Deployment

- [ ] Crear cuentas en Railway y Vercel
- [ ] Configurar variables de entorno
- [ ] Obtener credenciales de MercadoPago para producción
- [ ] Actualizar URLs en el frontend
- [ ] Deploy del backend en Railway
- [ ] Deploy del frontend en Vercel
- [ ] Configurar dominio personalizado (opcional)
- [ ] Probar toda la funcionalidad en producción
- [ ] Configurar monitoreo y backups

---

**🎉 ¡Tu Campus Virtual estará listo para competir con Coursera y Udemy!**