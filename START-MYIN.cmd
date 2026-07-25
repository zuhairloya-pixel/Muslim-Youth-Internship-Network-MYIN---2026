@echo off
setlocal
cd /d "%~dp0"

echo.
echo Starting MYIN...
echo.

where npm >nul 2>nul
if not errorlevel 1 (
  echo Installing project packages with npm...
  call npm install
  if errorlevel 1 goto failed
  echo.
  echo Opening the local MYIN server...
  call npm run dev
  goto finished
)

set "MYIN_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "MYIN_PNPM=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"

if exist "%MYIN_NODE%\node.exe" if exist "%MYIN_PNPM%" (
  set "PATH=%MYIN_NODE%;%PATH%"
  echo Using the Node runtime included with Codex...
  call "%MYIN_PNPM%" install
  if errorlevel 1 goto failed
  echo.
  echo Opening the local MYIN server...
  call "%MYIN_PNPM%" run dev
  goto finished
)

echo Node.js could not be found.
echo Install the Node.js LTS version from https://nodejs.org and run this file again.
pause
exit /b 1

:failed
echo.
echo MYIN could not start. Review the error above, then try again.
pause
exit /b 1

:finished
endlocal
