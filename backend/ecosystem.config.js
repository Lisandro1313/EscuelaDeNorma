module.exports = {
  apps: [{
    name: 'campus-norma',
    script: 'server.js',
    instances: 'max', // Usar todos los cores disponibles
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Configuración de logs
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Configuración de reinicio automático
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    max_memory_restart: '1G',
    
    // Configuración de reinicio en caso de error
    min_uptime: '10s',
    max_restarts: 5,
    
    // Variables de entorno específicas
    env_vars: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};