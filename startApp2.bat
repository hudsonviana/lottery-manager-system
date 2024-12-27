@echo off

echo Iniciando o servidor...
start cmd /k "npm run dev"

echo Verificando portas 3000 e 3333...
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
exit
