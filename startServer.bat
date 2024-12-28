@echo off

start "" http://localhost:4173

start /b cmd /c "npm run preview > preview.log 2>&1"
start /b cmd /c "node backend/src/server.js > server.log 2>&1"

exit
