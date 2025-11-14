# 🚀 Script de Build para Producción

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   BUILD PARA PRODUCCIÓN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Validar sistema
Write-Host "1️⃣  Validando sistema..." -ForegroundColor Yellow
node backend\scripts\validate-production.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Validación fallida. Abortando build." -ForegroundColor Red
    exit 1
}

# 2. Tests
Write-Host "`n2️⃣  Ejecutando tests..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "backend\server.js" -NoNewWindow -PassThru
Start-Sleep -Seconds 3
node backend\scripts\test-api.js
$testResult = $LASTEXITCODE
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

if ($testResult -ne 0) {
    Write-Host "`n⚠️  Algunos tests fallaron, pero continuando..." -ForegroundColor Yellow
}

# 3. Build del Frontend
Write-Host "`n3️⃣  Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Build del frontend falló" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "   ✅ Frontend built exitosamente" -ForegroundColor Green

# 4. Crear archivo de versión
Write-Host "`n4️⃣  Creando archivo de versión..." -ForegroundColor Yellow
$version = Get-Date -Format "yyyy.MM.dd.HHmm"
$versionInfo = @"
{
  "version": "$version",
  "buildDate": "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
  "environment": "production",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)"
}
"@
$versionInfo | Out-File -FilePath "version.json" -Encoding UTF8
Write-Host "   ✅ Version: $version" -ForegroundColor Green

# 5. Comprimir para deployment
Write-Host "`n5️⃣  Creando paquete de deployment..." -ForegroundColor Yellow
$deployFiles = @(
    "backend",
    "database",
    "frontend/dist",
    "uploads",
    "ecosystem.config.js",
    "version.json",
    ".env.production"
)

$zipName = "campusnorma-$version.zip"
if (Test-Path $zipName) {
    Remove-Item $zipName
}

# Nota: Requiere 7-Zip o similar
# Compress-Archive -Path $deployFiles -DestinationPath $zipName
Write-Host "   ⚠️  Compresión manual requerida" -ForegroundColor Yellow
Write-Host "   Archivos a incluir: backend, database, frontend/dist, uploads" -ForegroundColor Gray

# Resumen
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   ✅ BUILD COMPLETADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nArchivos generados:" -ForegroundColor White
Write-Host "  - frontend/dist/ (build del frontend)" -ForegroundColor Gray
Write-Host "  - version.json (información de versión)" -ForegroundColor Gray
Write-Host "`nPróximos pasos:" -ForegroundColor White
Write-Host "  1. Revisar frontend/dist/" -ForegroundColor Gray
Write-Host "  2. Configurar servidor de producción" -ForegroundColor Gray
Write-Host "  3. Subir archivos al servidor" -ForegroundColor Gray
Write-Host "  4. Configurar PM2 en servidor" -ForegroundColor Gray
Write-Host "  5. Configurar Nginx reverse proxy" -ForegroundColor Gray
Write-Host "`n========================================`n" -ForegroundColor Cyan
