@echo off
chcp 65001 >nul
title Prontu - Gerador Automatico de Trabalhos

echo ========================================
echo   Prontu - Gerador Automatico
echo   Gere trabalhos em linha de comando
echo ========================================
echo.

pergunta:
set /p ENUNCIADO=Digite o topico ou enunciado do trabalho: 
if "%ENUNCIADO%"=="" goto pergunta

echo.
set /p DISCIPLINA=Disciplina (ex: Biologia, Historia, Geografia) [default: Geral]: 
if "%DISCIPLINA%"=="" set DISCIPLINA=Geral

echo.
set /p NOME=Seu nome [default: Aluno]: 
if "%NOME%"=="" set NOME=Aluno

echo.
echo.
echo ========== Gerando ==========
echo Topico: %ENUNCIADO%
echo Disciplina: %DISCIPLINA%
echo Aluno: %NOME%
echo.
echo Aguarde... (pode levar 30-60 segundos)
echo.

REM Fazer requisicao para API local
curl -s -X POST http://localhost:3000/api/gerar-pdf ^
  -H "Content-Type: application/json" ^
  -d "{\"enunciado\":\"%ENUNCIADO%\",\"nomeAluno\":\"%NOME%\",\"disciplina\":\"%DISCIPLINA%\",\"serie\":\"Medio\",\"cidade\":\"SP\",\"incluirImagens\":false}" ^
  -o "%TEMP%\prontu_result.json"

type "%TEMP%\prontu_result.json"

echo.
echo.
set /p NOVA=Gerar outro trabalho? (S/N): 
if /i "%NOVA%"=="S" goto pergunta

echo.
echo Obrigado por usar Prontu!
pause