@echo off
setlocal
cd /d "%~dp0"

set "MYIN_SOURCE=%CD%"
set "MYIN_TARGET=%~dp0..\MYIN-GitHub-final-update"
set "MYIN_REPO=zuhairloya-pixel/Muslim-Youth-Internship-Network-MYIN---2026"
set "MYIN_BRANCH=agent/myin-intelligence-release"

echo.
echo Publishing the MYIN intelligence release to GitHub...
echo.

where gh >nul 2>nul
if errorlevel 1 (
  echo GitHub CLI could not be found. Close this terminal, open a new one, and try again.
  pause
  exit /b 1
)

gh auth status
if errorlevel 1 (
  echo.
  echo GitHub CLI is not authenticated. Run gh auth login and try again.
  pause
  exit /b 1
)

if exist "%MYIN_TARGET%" (
  echo.
  echo The publish folder already exists:
  echo %MYIN_TARGET%
  echo Rename that folder, then run this publisher again.
  pause
  exit /b 1
)

gh repo clone "%MYIN_REPO%" "%MYIN_TARGET%"
if errorlevel 1 goto failed

robocopy "%MYIN_SOURCE%" "%MYIN_TARGET%" /E /XD ".git" "node_modules" ".next" "dist" ".vinext" ".wrangler" "outputs" "work" "build" /XF "tsconfig.tsbuildinfo" "PUBLISH-MYIN.cmd" "PUBLISH-MYIN-FINAL-UPDATE.cmd" >nul
if errorlevel 8 goto failed

cd /d "%MYIN_TARGET%"
git switch -c "%MYIN_BRANCH%"
if errorlevel 1 goto failed

for /f "delims=" %%U in ('gh api user --jq .login') do set "MYIN_GITHUB_USER=%%U"
git config user.name "%MYIN_GITHUB_USER%"
git config user.email "%MYIN_GITHUB_USER%@users.noreply.github.com"

git add -A
git diff --cached --quiet
if not errorlevel 1 (
  echo No project changes were found to publish.
  pause
  exit /b 0
)

git commit -m "Complete MYIN intelligence release"
if errorlevel 1 goto failed

git push -u origin "%MYIN_BRANCH%"
if errorlevel 1 goto failed

gh pr create --draft --base main --head "%MYIN_BRANCH%" --title "Complete MYIN intelligence release" --body "Completes the MYIN hackathon experience with a premium landing page, student mission-control dashboard, detailed profile signals, dynamic transparent 100-point matching, secure server-side Gemini-ready endpoints, AI-assisted organization website understanding, editable opportunity extraction, cross-dashboard opportunity publishing, candidate pipeline, browser storage, responsive design, and updated validation. Gemini keys remain server-side and are not included in this pull request."
if errorlevel 1 goto failed

echo.
echo MYIN was published successfully. The draft pull request URL is shown above.
pause
exit /b 0

:failed
echo.
echo Publishing stopped because of the error above. No force push was used.
pause
exit /b 1
