# Script để restart backend server
Write-Host "🔍 Đang tìm process sử dụng port 9999..." -ForegroundColor Yellow

# Tìm process đang sử dụng port 9999
$process = Get-NetTCPConnection -LocalPort 9999 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "⚠️  Tìm thấy process PID: $process" -ForegroundColor Red
    Write-Host "🛑 Đang dừng process..." -ForegroundColor Yellow
    Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Đã dừng process" -ForegroundColor Green
} else {
    Write-Host "✅ Không có process nào đang sử dụng port 9999" -ForegroundColor Green
}

Write-Host "🚀 Đang khởi động backend server..." -ForegroundColor Cyan
npm start

