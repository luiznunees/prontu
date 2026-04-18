# Prontu - Gerador Automatico de Trabalhos em PowerShell
# Execute: .\gerar-trabalho.ps1

param(
    [string]$Enunciado = "",
    [string]$Disciplina = "Geral",
    [string]$Nome = "Aluno",
    [string]$Serie = "Medio",
    [string]$Cidade = "SP",
    [switch]$ComImagens
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Prontu - Gerador Automatico" -ForegroundColor Cyan
Write-Host "  Gere trabalhos via linha de comando" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $Enunciado) {
    $Enunciado = Read-Host "Digite o topico/enunciado do trabalho"
}

if (-not $Enunciado) {
    Write-Host "Erro: preciso de um topico!" -ForegroundColor Red
    exit 1
}

if (-not $Nome) {
    $Nome = Read-Host "Seu nome" "Aluno"
}
if (-not $Nome) { $Nome = "Aluno" }

Write-Host ""
Write-Host "========== Gerando ==========" -ForegroundColor Yellow
Write-Host "Topico: $Enunciado"
Write-Host "Disciplina: $Disciplina"
Write-Host "Aluno: $Nome"
Write-Host ""
Write-Host "Aguarde... (30-60 segundos)" -ForegroundColor Yellow
Write-Host ""

$body = @{
    enunciado = $Enunciado
    nomeAluno = $Nome
    escola = "Escola"
    disciplina = $Disciplina
    serie = $Serie
    cidade = $Cidade
    templateId = "classico"
    incluirImagens = $ComImagens.IsPresent
} | ConvertTo-Json

try {
    $headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer test-mode-123"
}

# Tentar porta 3000 primeiro (servidor principal)
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/gerar-pdf" `
            -Method Post `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 120
} catch {
    # Se não funcionar, tentar 3001
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/gerar-pdf" `
                -Method Post `
                -Headers $headers `
                -Body $body `
                -TimeoutSec 120
    } catch {
        Write-Host "Erro: Servidor não está a funcionar em nenhuma porta." -ForegroundColor Red
        exit 1
    }
}

    if ($response.error) {
        Write-Host "Erro: $($response.error)" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "========== Sucesso! ==========" -ForegroundColor Green
    
    if ($response.trabalho) {
        Write-Host "Titulo: $($response.trabalho.titulo)" -ForegroundColor Cyan
    }
    
    if ($response.pdf) {
        Write-Host "PDF: $($response.pdf)" -ForegroundColor Green
    }
    
    if ($response.downloadUrl) {
        Write-Host "Download: $($response.downloadUrl)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Trabalho gerado com sucesso!" -ForegroundColor Green

} catch {
    Write-Host "Erro ao gerar: $_" -ForegroundColor Red
    try {
        $errorResp = Invoke-RestMethod -Uri "http://localhost:3000/api/gerar-pdf" -Method Post -Headers $headers -Body $body -TimeoutSec 120 -ErrorAction SilentlyContinue
        Write-Host "Resposta: $errorResp" -ForegroundColor Yellow
    } catch {}
    exit 1
}