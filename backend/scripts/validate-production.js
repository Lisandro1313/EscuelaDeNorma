const fs = require('fs');
const path = require('path');

console.log('\n🔍 VALIDACIÓN PRE-PRODUCCIÓN\n');
console.log('=====================================\n');

let errors = 0;
let warnings = 0;

// 1. Verificar archivo .env
console.log('1️⃣  Verificando variables de entorno...');
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('   ⚠️  ADVERTENCIA: No se encontró archivo .env');
  warnings++;
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar variables críticas
  const requiredVars = [
    'JWT_SECRET',
    'MERCADOPAGO_ACCESS_TOKEN',
    'MERCADOPAGO_PUBLIC_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      console.log(`   ❌ ERROR: Falta variable ${varName}`);
      errors++;
    } else if (envContent.includes(`${varName}=`) && envContent.includes(`${varName}=\n`)) {
      console.log(`   ⚠️  ADVERTENCIA: Variable ${varName} está vacía`);
      warnings++;
    }
  });
  
  if (errors === 0 && warnings === 0) {
    console.log('   ✅ Variables de entorno configuradas');
  }
}

// 2. Verificar base de datos
console.log('\n2️⃣  Verificando base de datos...');
const dbPath = path.join(__dirname, '../../database/campus_norma.db');
if (!fs.existsSync(dbPath)) {
  console.log('   ❌ ERROR: No se encontró base de datos');
  errors++;
} else {
  const stats = fs.statSync(dbPath);
  console.log(`   ✅ Base de datos encontrada (${Math.round(stats.size / 1024)}KB)`);
}

// 3. Verificar carpeta de uploads
console.log('\n3️⃣  Verificando carpeta de uploads...');
const uploadsPath = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('   ⚠️  ADVERTENCIA: Creando carpeta uploads...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  warnings++;
} else {
  console.log('   ✅ Carpeta de uploads existe');
}

// 4. Verificar dependencias críticas
console.log('\n4️⃣  Verificando dependencias...');
const packagePath = path.join(__dirname, '../package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const criticalDeps = [
    'express',
    'socket.io',
    'jsonwebtoken',
    'helmet',
    'compression',
    'express-rate-limit'
  ];
  
  // Verificar bcrypt o bcryptjs
  const hasBcrypt = pkg.dependencies['bcrypt'] || pkg.dependencies['bcryptjs'];
  if (!hasBcrypt) {
    console.log('   ❌ ERROR: Falta dependencia bcrypt/bcryptjs');
    errors++;
  }
  
  criticalDeps.forEach(dep => {
    if (!pkg.dependencies[dep]) {
      console.log(`   ❌ ERROR: Falta dependencia ${dep}`);
      errors++;
    }
  });
  
  if (errors === 0) {
    console.log('   ✅ Todas las dependencias críticas instaladas');
  }
}

// 5. Verificar estructura de carpetas
console.log('\n5️⃣  Verificando estructura de carpetas...');
const requiredDirs = [
  '../src/models',
  '../src/routes',
  '../src/services',
  '../scripts'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`   ❌ ERROR: Falta carpeta ${dir}`);
    errors++;
  }
});

if (errors === 0) {
  console.log('   ✅ Estructura de carpetas correcta');
}

// 6. Verificar archivos críticos
console.log('\n6️⃣  Verificando archivos críticos...');
const criticalFiles = [
  '../server.js',
  '../../database/database.js',
  '../../database/init.sql'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ ERROR: Falta archivo ${file}`);
    errors++;
  }
});

if (errors === 0) {
  console.log('   ✅ Todos los archivos críticos presentes');
}

// 7. Verificar puerto disponible
console.log('\n7️⃣  Verificando configuración del servidor...');
const serverPath = path.join(__dirname, '../server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('helmet')) {
    console.log('   ✅ Helmet (seguridad) configurado');
  } else {
    console.log('   ⚠️  ADVERTENCIA: Helmet no detectado');
    warnings++;
  }
  
  if (serverContent.includes('compression')) {
    console.log('   ✅ Compression configurado');
  } else {
    console.log('   ⚠️  ADVERTENCIA: Compression no detectado');
    warnings++;
  }
  
  if (serverContent.includes('rateLimit')) {
    console.log('   ✅ Rate limiting configurado');
  } else {
    console.log('   ⚠️  ADVERTENCIA: Rate limiting no detectado');
    warnings++;
  }
}

// Resumen final
console.log('\n=====================================');
console.log('📊 RESUMEN DE VALIDACIÓN\n');
console.log(`   Errores críticos: ${errors}`);
console.log(`   Advertencias: ${warnings}`);

if (errors === 0 && warnings === 0) {
  console.log('\n✅ ¡SISTEMA LISTO PARA PRODUCCIÓN!');
  console.log('=====================================\n');
  process.exit(0);
} else if (errors === 0) {
  console.log('\n⚠️  Sistema funcional con advertencias');
  console.log('   Revisa las advertencias antes de desplegar');
  console.log('=====================================\n');
  process.exit(0);
} else {
  console.log('\n❌ SISTEMA NO LISTO PARA PRODUCCIÓN');
  console.log('   Corrige los errores antes de continuar');
  console.log('=====================================\n');
  process.exit(1);
}
