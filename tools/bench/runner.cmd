@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Function to run benchmark
call :run_benchmark "node:http" "node --import @swc-node/register/esm-register ./servers/node-http.ts"
call :run_benchmark "node-fetch-server" "node ./servers/node-fetch-server.mjs"
call :run_benchmark "express" "node ./servers/express.mjs"
goto :eof

:run_benchmark
set "SERVER_NAME=%~1"
set "START_COMMAND=%~2"

set PORT=3000

echo.
echo Running benchmark for %SERVER_NAME% ...
echo.

:: Start the server
start "" /B cmd /C "%START_COMMAND%" > nul 2>&1
set "SERVER_PID=%!"

:: Wait for the server to start
timeout /t 2 > nul

:: Run Artillery benchmark
artillery quick --duration 30 --rate 400 http://127.0.0.1:%PORT%

:: Kill the server process
taskkill /PID %SERVER_PID% /F > nul 2>&1

goto :eof
