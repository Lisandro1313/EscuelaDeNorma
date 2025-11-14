# 🚀 GUÍA RÁPIDA DE DESPLIEGUE - Campus Virtual Norma

## ⚡ **COMANDOS RÁPIDOS**

### **1. Verificación Pre-Despliegue**
```powershell
# Validar que todo esté listo
cd backend
node scripts/validate-production.js

# Debería mostrar: ✅ ¡SISTEMA LISTO PARA PRODUCCIÓN!
```

### **2. Configurar Variables de Producción**
```powershell
# Editar archivo backend/.env
# Actualizar:
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.com
BACKEND_URL=https://api.tu-dominio.com
MERCADOPAGO_ACCESS_TOKEN=tu_token_real
MERCADOPAGO_PUBLIC_KEY=tu_key_real
```

### **3. Build del Frontend**
```powershell
cd frontend
npm install
npm run build

# Esto genera la carpeta frontend/dist
```

### **4. Instalar Dependencias del Backend**
```powershell
cd backend
npm install --production
```

### **5. Iniciar con PM2 (Recomendado)**
```powershell
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar el servidor
cd backend
pm2 start ecosystem.config.js --env production

# Ver logs
pm2 logs

# Ver status
pm2 status

# Guardar configuración
pm2 save

# Auto-iniciar en reinicio del servidor
pm2 startup
```

### **6. Iniciar Manualmente (Alternativa)**
```powershell
cd backend
npm start

# O con node directamente
node server.js
```

---

## 🌐 **OPCIONES DE HOSTING**

### **Opción 1: VPS (DigitalOcean, Linode, AWS EC2)**

**Requisitos del Servidor:**
- RAM: 1GB mínimo (2GB recomendado)
- CPU: 1 core mínimo
- Disco: 20GB mínimo
- SO: Ubuntu 20.04 o superior

**Instalación:**
```bash
# 1. Conectar al servidor
ssh root@tu-servidor-ip

# 2. Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2
npm install -g pm2

# 4. Clonar repositorio
git clone https://github.com/Lisandro1313/EscuelaDeNorma.git
cd EscuelaDeNorma

# 5. Instalar dependencias
cd backend && npm install --production
cd ../frontend && npm install && npm run build

# 6. Configurar .env
nano backend/.env
# (Pegar configuración de producción)

# 7. Iniciar con PM2
cd backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 8. Configurar Nginx (reverse proxy)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/campus-norma
```

**Configuración Nginx:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Frontend
    location / {
        root /ruta/a/EscuelaDeNorma/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/campus-norma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Instalar SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

---

### **Opción 2: Heroku**

```bash
# 1. Instalar Heroku CLI
# Descargar desde: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Crear app
heroku create campus-norma-app

# 4. Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_secret_seguro
heroku config:set MERCADOPAGO_ACCESS_TOKEN=tu_token

# 5. Desplegar
git push heroku main

# 6. Ver logs
heroku logs --tail
```

---

### **Opción 3: Vercel (Frontend) + Railway (Backend)**

**Frontend en Vercel:**
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod
```

**Backend en Railway:**
```bash
# 1. Ir a railway.app
# 2. Conectar repositorio de GitHub
# 3. Configurar variables de entorno
# 4. Deploy automático
```

---

### **Opción 4: Docker (Cualquier plataforma)**

```bash
# 1. Build imagen
docker build -t campus-norma .

# 2. Run contenedor
docker run -d \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=tu_secret \
  --name campus-norma \
  campus-norma

# 3. Ver logs
docker logs -f campus-norma
```

---

## 🔧 **MANTENIMIENTO**

### **Actualizar el Sistema**
```bash
# 1. Hacer cambios en código
git pull origin main

# 2. Instalar nuevas dependencias (si hay)
cd backend && npm install
cd ../frontend && npm install && npm run build

# 3. Reiniciar PM2
pm2 restart campus-norma
```

### **Ver Logs**
```bash
# Logs de PM2
pm2 logs campus-norma

# Logs del sistema (si usaste logger)
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### **Backup de Base de Datos**
```bash
# Manual
cp database/campus_norma.db database/backup_$(date +%Y%m%d).db

# Automático (agregar a crontab)
crontab -e
# Agregar:
0 2 * * * cp /ruta/database/campus_norma.db /ruta/backups/campus_$(date +\%Y\%m\%d).db
```

### **Monitoreo**
```bash
# Ver uso de recursos
pm2 monit

# Estadísticas
pm2 show campus-norma
```

---

## 🔒 **SEGURIDAD POST-DESPLIEGUE**

1. **Cambiar credenciales por defecto**:
   ```
   Email: norma.admin@escuelanorma.com
   Password: Norma2025!Secure
   ```

2. **Configurar firewall**:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

3. **Actualizar secrets de JWT**:
   ```bash
   # Generar nuevo secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   # Actualizar en .env
   ```

4. **Configurar SSL obligatorio** (en Nginx o tu plataforma)

5. **Monitorear logs regularmente**:
   ```bash
   tail -f backend/logs/error.log
   ```

---

## 📊 **MÉTRICAS Y SALUD**

### **Health Check**
```bash
# Verificar que el servidor responda
curl http://tu-dominio.com/api/health

# Debería retornar:
# {
#   "status": "healthy",
#   "uptime": 12345,
#   "database": "connected",
#   "socketIO": "active",
#   "memory": { "heapUsed": "50MB", "heapTotal": "100MB" }
# }
```

### **Endpoints de Monitoreo**
- Health Check: `GET /api/health`
- Activity Logs (Admin): `GET /api/admin/activity-logs`
- Stats (Admin): `GET /api/admin/stats`

---

## 🆘 **TROUBLESHOOTING**

### **Error: Puerto 5000 en uso**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux
lsof -ti:5000 | xargs kill -9
```

### **Error: Base de datos no encontrada**
```bash
# Verificar que existe
ls -la database/campus_norma.db

# Si no existe, el sistema la crea automáticamente al iniciar
```

### **Error: ECONNREFUSED en Socket.IO**
```bash
# Verificar que el puerto esté abierto
# Verificar CORS en server.js línea 26
# Verificar URL en frontend socket.ts
```

---

## ✅ **CHECKLIST POST-DESPLIEGUE**

- [ ] Servidor ejecutándose correctamente
- [ ] Frontend accesible en el dominio
- [ ] API respondiendo en /api/health
- [ ] Socket.IO conectado (chat funciona)
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Creación de cursos funciona
- [ ] Inscripción gratuita funciona
- [ ] MercadoPago configurado (si necesitas pagos)
- [ ] Logs guardándose correctamente
- [ ] SSL configurado (HTTPS)
- [ ] Backup automático configurado
- [ ] PM2 guardado y auto-inicio configurado
- [ ] Credenciales de admin cambiadas
- [ ] Variables de entorno actualizadas

---

## 📞 **CONTACTO Y SOPORTE**

- **GitHub**: https://github.com/Lisandro1313/EscuelaDeNorma
- **Email de Admin**: norma.admin@escuelanorma.com

---

**¡SISTEMA 100% LISTO PARA PRODUCCIÓN! 🚀**

**Última actualización**: 14 de Noviembre 2025
