@echo off

:: Define variáveis iniciais
setlocal enabledelayedexpansion
set progress=0

:: Inicia o servidor Node.js em uma nova janela do terminal
start cmd /k "npm run dev"

:: Exibe mensagem inicial
echo Iniciando o servidor e aguardando portas 3000 e 3333...
echo.

:: Função para exibir a barra de progresso
:progressBar
set /a progress+=10
set bar=

for /l %%i in (1,1,!progress!) do (
  set bar=!bar!#
)

for /l %%i in (!progress!,1,100) do (
  set bar=!bar!-
)

cls
echo Progresso: !progress!%% [!bar!]
timeout /t 1 >nul
if !progress! lss 100 goto progressBar
goto check_ports

:: Verifica as portas 3000 e 3333
:check_ports
timeout /t 2 > nul
for /f "tokens=2 delims=:" %%A in ('netstat -ano ^| findstr "3000"') do (
  for /f "tokens=2 delims=:" %%B in ('netstat -ano ^| findstr "3333"') do (
    goto ports_ready
  )
)
goto check_ports

:ports_ready
echo As portas 3000 e 3333 estão ativas.
start http://localhost:3000
timeout /t 3 >nul
exit
