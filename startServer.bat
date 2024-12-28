@echo off

start "" http://localhost:4173

start cmd /k "npm run preview"
start cmd /k "node backend/src/server.js"

exit
