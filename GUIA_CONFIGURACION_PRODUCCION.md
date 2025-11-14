# 🚀 Guía Paso a Paso - Configuración para Producción

## 📋 CONFIGURACIÓN MERCADOPAGO (30 minutos)

### Paso 1: Crear Cuenta de Producción

1. **Ir a MercadoPago Developers:**
   ```
   https://www.mercadopago.com.ar/developers/
   ```

2. **Iniciar sesión** con tu cuenta de MercadoPago

3. **Ir a "Tus aplicaciones"** → **"Crear aplicación"**

4. **Completar datos:**
   - Nombre: "Campus Norma"
   - Descripción: "Plataforma educativa"
   - Tipo: "Marketplace" o "Pagos"

### Paso 2: Obtener Credenciales de PRODUCCIÓN

1. **En tu aplicación** → **"Credenciales"**

2. **Copiar credenciales de PRODUCCIÓN** (NO las de Test):
   ```
   Access Token: APP_USR-XXXXX-XXXXXX-XXXXX
   Public Key: APP_USR-XXXXX-XXXXXX-XXXXX
   ```

3. **Actualizar en `backend/.env`:**
   ```env
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-[TU-TOKEN-DE-PRODUCCION]
   MERCADOPAGO_PUBLIC_KEY=APP_USR-[TU-PUBLIC-KEY-DE-PRODUCCION]
   ```

### Paso 3: Configurar Webhooks

1. **En MercadoPago Developers** → **Tu aplicación** → **"Webhooks"**

2. **URL del webhook:**
   ```
   https://tu-dominio.com/api/payments/webhook
   ```
   (Si estás en local: `https://tu-ip-publica:5000/api/payments/webhook`)

3. **Eventos a escuchar:**
   - ✅ payment
   - ✅ merchant_order

4. **Guardar**

### Paso 4: Probar Pago Real

```bash
# Reiniciar backend con nuevas credenciales
cd backend
node server.js

# En el navegador, hacer una compra de $1 para probar
```

---

## 🌐 OPCIONES DE HOSTING

### OPCIÓN A: Heroku (Más Fácil) - $7/mes

#### 1. Crear cuenta en Heroku
```
https://signup.heroku.com/
```

#### 2. Instalar Heroku CLI
```powershell
# Windows con Chocolatey
choco install heroku-cli

# O descargar de:
https://devcenter.heroku.com/articles/heroku-cli
```

#### 3. Deploy Backend
```bash
cd backend

# Login
heroku login

# Crear app
heroku create campus-norma-api

# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=campus_virtual_jwt_secret_production_2024
heroku config:set MERCADOPAGO_ACCESS_TOKEN=[tu-token]
heroku config:set MERCADOPAGO_PUBLIC_KEY=[tu-key]
heroku config:set FRONTEND_URL=https://campus-norma.vercel.app
heroku config:set BACKEND_URL=https://campus-norma-api.herokuapp.com

# Crear Procfile
echo "web: node server.js" > Procfile

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a campus-norma-api
git push heroku main
```

#### 4. Deploy Frontend en Vercel
```bash
cd frontend

# Instalar Vercel CLI
npm i -g vercel

# Login y deploy
vercel login
vercel --prod

# Configurar variables de entorno en Vercel Dashboard:
# VITE_API_URL=https://campus-norma-api.herokuapp.com
```

**URLs resultantes:**
- Frontend: `https://campus-norma.vercel.app`
- Backend: `https://campus-norma-api.herokuapp.com`

---

### OPCIÓN B: VPS (DigitalOcean/AWS) - $5-10/mes

#### 1. Crear Droplet/EC2
```
- SO: Ubuntu 22.04 LTS
- Plan: $5/mes (1GB RAM)
- Región: Más cercana a tus usuarios
```

#### 2. Conectar por SSH
```bash
ssh root@tu-ip-del-servidor
```

#### 3. Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

#### 4. Subir código
```bash
# En tu PC local
scp -r backend root@tu-ip:/var/www/
scp -r frontend/dist root@tu-ip:/var/www/

# En el servidor
cd /var/www/backend
npm install --production
```

#### 5. Configurar PM2
```bash
# En el servidor
cd /var/www/backend
pm2 start server.js --name campus-backend
pm2 save
pm2 startup
```

#### 6. Instalar Nginx
```bash
sudo apt update
sudo apt install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/campus-norma
```

**Contenido de la configuración:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/campus-norma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. SSL con Let's Encrypt (GRATIS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com -d www.tudominio.com -d api.tudominio.com
```

---

### OPCIÓN C: Railway (Fácil + Gratis hasta $5/mes)

#### 1. Crear cuenta
```
https://railway.app/
```

#### 2. Deploy Backend
```bash
cd backend

# Conectar con GitHub
railway login

# Crear proyecto
railway init

# Deploy
railway up
```

#### 3. Configurar variables de entorno
En Railway Dashboard → Variables:
```
NODE_ENV=production
JWT_SECRET=campus_virtual_jwt_secret_production_2024
MERCADOPAGO_ACCESS_TOKEN=[tu-token]
MERCADOPAGO_PUBLIC_KEY=[tu-key]
FRONTEND_URL=https://tu-frontend.vercel.app
```

#### 4. Frontend en Vercel (mismo que Opción A)

---

## 🔑 CONFIGURACIÓN FINAL

### 1. Actualizar `backend/.env`
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=campus_virtual_jwt_secret_production_2024

# MercadoPago PRODUCCIÓN
MERCADOPAGO_ACCESS_TOKEN=APP_USR-[TU-TOKEN-REAL]
MERCADOPAGO_PUBLIC_KEY=APP_USR-[TU-KEY-REAL]
MERCADOPAGO_WEBHOOK_SECRET=kc4XMksMl34GLrydCYhuEDTeheIYeKhc

# URLs de producción
FRONTEND_URL=https://tudominio.com
BACKEND_URL=https://api.tudominio.com
```

### 2. Build del Frontend
```bash
cd frontend
npm run build

# Resultado: carpeta dist/ lista para subir
```

### 3. Actualizar Frontend para usar API de producción
```bash
# frontend/.env.production
VITE_API_URL=https://api.tudominio.com
VITE_SOCKET_URL=https://api.tudominio.com
```

---

## ✅ CHECKLIST FINAL

### Antes de Lanzar:
- [ ] ✅ MercadoPago credenciales de producción configuradas
- [ ] ✅ NODE_ENV=production
- [ ] ✅ URLs actualizadas en .env
- [ ] ✅ Build de frontend generado
- [ ] ✅ Backend deployado
- [ ] ✅ Frontend deployado
- [ ] ✅ DNS configurado (si usas dominio propio)
- [ ] ✅ SSL activo (HTTPS)
- [ ] ✅ Webhooks de MercadoPago configurados

### Pruebas:
- [ ] ✅ Registro de usuario funciona
- [ ] ✅ Login funciona
- [ ] ✅ Crear curso funciona
- [ ] ✅ Inscripción gratuita funciona
- [ ] ✅ **Pago de $1 funciona (CRÍTICO)**
- [ ] ✅ Chat funciona
- [ ] ✅ Foros funcionan
- [ ] ✅ Notificaciones llegan
- [ ] ✅ Subir archivos funciona

---

## 🆘 TROUBLESHOOTING

### Error: "CORS policy"
```javascript
// backend/server.js - Verificar CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL,  // Debe coincidir exactamente
  credentials: true
};
app.use(cors(corsOptions));
```

### Error: Pagos no funcionan
```bash
# Verificar:
1. Credenciales de PRODUCCIÓN (no TEST)
2. Webhook configurado en MercadoPago
3. URL del webhook accesible públicamente
4. BACKEND_URL correcto en .env
```

### Error: Socket.IO no conecta
```javascript
// frontend - Verificar URL del socket
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['websocket', 'polling']
});
```

---

## 📞 SOPORTE

Si tienes problemas:

1. **Ver logs:**
   ```bash
   # Heroku
   heroku logs --tail -a campus-norma-api
   
   # VPS con PM2
   pm2 logs campus-backend
   
   # Railway
   railway logs
   ```

2. **Verificar estado:**
   ```bash
   # Health check
   curl https://tu-api.com/api/health
   ```

3. **Reiniciar:**
   ```bash
   # Heroku
   heroku restart -a campus-norma-api
   
   # PM2
   pm2 restart campus-backend
   ```

---

## ⏱️ TIEMPO ESTIMADO

- **MercadoPago:** 30 minutos
- **Heroku + Vercel:** 1 hora
- **VPS completo:** 2-3 horas
- **Railway + Vercel:** 45 minutos
- **Pruebas finales:** 30 minutos

**TOTAL:** 2-4 horas dependiendo de la opción

---

## 🎯 RECOMENDACIÓN

**Para empezar RÁPIDO:**
1. ✅ Configura MercadoPago (30 min)
2. ✅ Deploy en Heroku + Vercel (1 hora)
3. ✅ Prueba con pago de $1
4. ✅ Lanza!

**Para producción seria (>100 usuarios):**
1. ✅ VPS + Dominio propio + SSL
2. ✅ PostgreSQL en vez de SQLite
3. ✅ Backups automáticos
4. ✅ Monitoring (Sentry, LogRocket)

---

¿Por dónde quieres empezar? ¿MercadoPago primero o deploy?
