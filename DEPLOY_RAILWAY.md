# 🚀 GUÍA DE DEPLOY EN RAILWAY.APP

## ✅ PREPARATIVOS COMPLETADOS

Ya están listos estos archivos:
- ✅ `backend/railway.json` - Configuración Railway backend
- ✅ `frontend/railway.json` - Configuración Railway frontend  
- ✅ `backend/.env.railway` - Variables de entorno

---

## 📋 PASO A PASO PARA DESPLEGAR

### 1️⃣ PREPARAR REPOSITORIO GITHUB

```bash
# Si no has hecho commit de los últimos cambios:
git add .
git commit -m "Preparado para Railway deployment"
git push origin main
```

### 2️⃣ CREAR CUENTA EN RAILWAY

1. Ve a: **https://railway.app**
2. Click en **"Start a New Project"**
3. Conecta tu cuenta de GitHub
4. Autoriza Railway

### 3️⃣ DESPLEGAR BACKEND

1. En Railway, click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona: **`EscuelaDeNorma`**
4. Railway detectará automáticamente que es Node.js
5. Click en el servicio creado
6. Ve a **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

### 4️⃣ CONFIGURAR VARIABLES DE ENTORNO (Backend)

En Railway, ve a **Variables** y agrega:

```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=CambiaMePorAlgoSeguro123456789XYZ
MERCADOPAGO_ACCESS_TOKEN=APP_USR-6695050923550599-110410-56bc2e79fc9f3b8f20aa40ddd97c65f0-2095898034
MERCADOPAGO_PUBLIC_KEY=APP_USR-0e6b9b97-3c0f-4d69-8a07-9c9ba3fc8769
```

⚠️ **Railway genera automáticamente**:
- `DATABASE_URL` (si agregas PostgreSQL)
- Una URL pública para tu backend

### 5️⃣ AGREGAR BASE DE DATOS (Opcional)

Railway usa SQLite por defecto, pero para producción PostgreSQL es mejor:

1. En tu proyecto Railway, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway automáticamente conecta y crea `DATABASE_URL`
3. **NO necesitas hacer nada más**, Railway lo configura solo

### 6️⃣ OBTENER URL DEL BACKEND

1. En el servicio backend, ve a **Settings**
2. Copia la URL (algo como `https://backend-production-xxxx.up.railway.app`)
3. Guárdala, la necesitarás para el frontend

### 7️⃣ DESPLEGAR FRONTEND

1. En Railway, click **"New Service"** en el mismo proyecto
2. Selecciona tu repo **`EscuelaDeNorma`** otra vez
3. Railway detectará automáticamente que es Vite/React
4. Ve a **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -p $PORT`

### 8️⃣ CONFIGURAR VARIABLES DE ENTORNO (Frontend)

En el servicio frontend, ve a **Variables** y agrega:

```bash
VITE_API_URL=https://TU-BACKEND-URL.railway.app/api
```

⚠️ **Reemplaza** `TU-BACKEND-URL` con la URL del paso 6

### 9️⃣ ACTUALIZAR CORS EN BACKEND

1. Copia la URL del frontend (ejemplo: `https://frontend-production-xxxx.up.railway.app`)
2. En Variables del **backend**, agrega:

```bash
CORS_ORIGIN=https://tu-frontend-url.railway.app
FRONTEND_URL=https://tu-frontend-url.railway.app
```

3. Click **"Redeploy"** en el backend

### 🔟 ACTUALIZAR API URL EN FRONTEND

Si tu frontend tiene hardcoded `http://localhost:5000`, debes cambiarlo:

**Archivo:** `frontend/src/services/api.ts` (o similar)

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://tu-backend.railway.app/api';
```

Luego haz commit y push:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

Railway automáticamente redespleará.

---

## ✅ VERIFICACIÓN FINAL

### Backend funcionando:
- ✅ Visita: `https://tu-backend.railway.app/api/health`
- Deberías ver: `{ "status": "ok", "message": "Campus Norma API funcionando" }`

### Frontend funcionando:
- ✅ Visita: `https://tu-frontend.railway.app`
- Deberías ver el login con el logo ESFD

### Login funcional:
- ✅ Usuario: `norma.admin@escuelanorma.com`
- ✅ Password: `Norma2025!Secure`

---

## 🔄 REDESPLEGAR CAMBIOS

Cada vez que hagas `git push`, Railway redespleará automáticamente:

```bash
# Hacer cambios en tu código
git add .
git commit -m "Descripción de cambios"
git push origin main

# Railway detecta el push y redespleará automáticamente (2-3 minutos)
```

---

## 💰 COSTOS

Railway es **GRATIS** con:
- ✅ $5 USD de crédito mensual
- ✅ 500 horas de ejecución/mes
- ✅ Suficiente para 1-2 proyectos pequeños

**Tu proyecto consume aproximadamente**:
- Backend: ~$3/mes
- Frontend: ~$1/mes
- PostgreSQL: Gratis

**Total: ~$4/mes** (dentro del plan gratuito)

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Backend no inicia:
1. Ve a **Deployments** → Click en el último deploy
2. Ve a **Logs** para ver errores
3. Verifica variables de entorno

### Frontend no conecta con backend:
1. Verifica `VITE_API_URL` en frontend
2. Verifica `CORS_ORIGIN` en backend
3. Asegúrate que ambos tienen HTTPS

### Base de datos no funciona:
1. Verifica que PostgreSQL esté conectado
2. Verifica que `DATABASE_URL` existe en variables
3. Railway la crea automáticamente al agregar PostgreSQL

---

## 📞 SIGUIENTES PASOS

1. ✅ Desplegar backend y frontend
2. ✅ Probar login y funcionalidades
3. ✅ Compartir URL pública
4. ⚠️ Considerar dominio personalizado (opcional)
5. ⚠️ Configurar backups de base de datos

---

## 🌐 DOMINIO PERSONALIZADO (Opcional)

Railway permite dominios custom gratis:

1. En tu servicio, ve a **Settings** → **Domains**
2. Click **"Add Custom Domain"**
3. Ingresa tu dominio (ejemplo: `campus.escuelanorma.com`)
4. Railway te dará registros DNS para configurar
5. Agrega los registros en tu proveedor de dominios
6. Espera 24-48 horas para propagación DNS

**Proveedores de dominios gratis:**
- Freenom.com (dominios .tk, .ml, .ga)
- DuckDNS (subdominios gratis)

---

## ✅ ¡LISTO PARA PRODUCCIÓN!

Tu Campus Virtual estará disponible 24/7 en:
- 🌐 Frontend: `https://tu-app.railway.app`
- 🔧 Backend: `https://tu-backend.railway.app`
- 📊 Panel Railway: `https://railway.app/dashboard`

**¡A disfrutar tu plataforma educativa en producción! 🎉**
