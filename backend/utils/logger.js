// Sistema de logging profesional para producción
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.ensureLogsDir();
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  ensureLogsDir() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    }) + '\n';
  }

  writeToFile(filename, content) {
    if (this.isProduction) {
      const filePath = path.join(this.logsDir, filename);
      fs.appendFileSync(filePath, content, 'utf8');
    }
  }

  info(message, meta = {}) {
    const formatted = this.formatMessage('INFO', message, meta);
    if (!this.isProduction) {
      console.log(`ℹ️  ${message}`, meta);
    }
    this.writeToFile('info.log', formatted);
    this.writeToFile('combined.log', formatted);
  }

  error(message, error = null, meta = {}) {
    const errorMeta = error ? {
      error: {
        message: error.message,
        stack: error.stack,
        ...error
      },
      ...meta
    } : meta;

    const formatted = this.formatMessage('ERROR', message, errorMeta);
    
    if (!this.isProduction) {
      console.error(`❌ ${message}`, error || meta);
    }
    
    this.writeToFile('error.log', formatted);
    this.writeToFile('combined.log', formatted);
  }

  warn(message, meta = {}) {
    const formatted = this.formatMessage('WARN', message, meta);
    if (!this.isProduction) {
      console.warn(`⚠️  ${message}`, meta);
    }
    this.writeToFile('warn.log', formatted);
    this.writeToFile('combined.log', formatted);
  }

  debug(message, meta = {}) {
    if (!this.isProduction) {
      console.log(`🔍 ${message}`, meta);
      const formatted = this.formatMessage('DEBUG', message, meta);
      this.writeToFile('debug.log', formatted);
    }
  }

  success(message, meta = {}) {
    const formatted = this.formatMessage('SUCCESS', message, meta);
    if (!this.isProduction) {
      console.log(`✅ ${message}`, meta);
    }
    this.writeToFile('combined.log', formatted);
  }

  // Log específico para actividad de usuario
  activity(userId, action, details = {}) {
    this.info('User Activity', {
      userId,
      action,
      ...details
    });
  }

  // Log específico para API requests
  apiRequest(method, url, statusCode, responseTime, meta = {}) {
    this.info('API Request', {
      method,
      url,
      statusCode,
      responseTime,
      ...meta
    });
  }

  // Log específico para transacciones de pago
  payment(userId, amount, status, paymentId, meta = {}) {
    this.info('Payment Transaction', {
      userId,
      amount,
      status,
      paymentId,
      ...meta
    });
  }

  // Limpiar logs antiguos (mantener solo últimos 30 días)
  cleanOldLogs() {
    try {
      const files = fs.readdirSync(this.logsDir);
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

      files.forEach(file => {
        const filePath = path.join(this.logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtimeMs < thirtyDaysAgo) {
          fs.unlinkSync(filePath);
          this.info('Log file removed (older than 30 days)', { file });
        }
      });
    } catch (error) {
      this.error('Error cleaning old logs', error);
    }
  }
}

// Singleton instance
const logger = new Logger();

// Limpiar logs antiguos al iniciar (solo en producción)
if (process.env.NODE_ENV === 'production') {
  logger.cleanOldLogs();
}

module.exports = logger;
