#!/bin/bash

# Script de despliegue para Campus Norma
# Uso: ./deploy.sh [development|production]

ENV=${1:-development}

echo "🚀 Iniciando despliegue de Campus Norma en modo: $ENV"

# Crear directorios necesarios
mkdir -p logs uploads

# Instalar PM2 globalmente si no está instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

# Configurar según el entorno
if [ "$ENV" = "production" ]; then
    echo "🔧 Configurando para producción..."
    
    # Copiar configuración de producción
    cp .env.production .env
    
    # Instalar dependencias de producción
    npm ci --only=production
    
    # Optimizaciones de producción
    echo "⚡ Aplicando optimizaciones..."
    
    # Iniciar con PM2
    pm2 start ecosystem.config.js --env production
    
    # Configurar PM2 para auto-inicio
    pm2 startup
    pm2 save
    
else
    echo "🔧 Configurando para desarrollo..."
    
    # Instalar todas las dependencias
    npm install
    
    # Iniciar en modo desarrollo
    pm2 start ecosystem.config.js --env development
fi

# Verificar que el servidor esté funcionando
echo "🔍 Verificando estado del servidor..."
sleep 5

if pm2 list | grep -q "campus-norma"; then
    echo "✅ Campus Norma desplegado exitosamente!"
    echo "🌐 Servidor disponible en http://localhost:5000"
    
    # Mostrar logs
    echo "📋 Últimos logs:"
    pm2 logs campus-norma --lines 10
    
    echo ""
    echo "🛠️  Comandos útiles:"
    echo "   pm2 logs campus-norma    - Ver logs en tiempo real"
    echo "   pm2 restart campus-norma - Reiniciar aplicación"
    echo "   pm2 stop campus-norma    - Detener aplicación"
    echo "   pm2 monit               - Monitor de rendimiento"
    
else
    echo "❌ Error en el despliegue. Revisando logs..."
    pm2 logs campus-norma --lines 20
    exit 1
fi