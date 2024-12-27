@echo off

for %%p in (3000 3333) do (
  for /f "tokens=5" %%a in ('netstat -a -n -o ^| findstr "%%p"') do (
    taskkill /f /pid %%a
  )
)

echo Tasks running on ports 3000 and 3333 has been killed.