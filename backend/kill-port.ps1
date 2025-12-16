# Script to kill process using port 9999
param(
    [int]$Port = 9999
)

Write-Host "Finding process using port $Port..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if ($connections) {
    $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    
    foreach ($pid in $processes) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Stopping process: $($proc.ProcessName) (PID: $pid)" -ForegroundColor Red
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "Stopped process PID: $pid" -ForegroundColor Green
        }
    }
} else {
    Write-Host "No process using port $Port" -ForegroundColor Green
}

