@echo off
setlocal
cd /d "%~dp0"

set "MYIN_SOURCE=%CD%"
set "MYIN_TARGET=%~dp0..\MYIN-GitHub-publish"
set "MYIN_REPO=zuhairloya-pixel/Muslim-Youth-Internship-Network-MYIN---2026"
set "MYIN_BRANCH=agent/initial-myin-mvp"

echo.
echo Publishing MYIN to GitHub...
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

robocopy "%MYIN_SOURCE%" "%MYIN_TARGET%" /E /XD ".git" "node_modules" ".next" "dist" ".vinext" ".wrangler" "outputs" "work" /XF "tsconfig.tsbuildinfo" "PUBLISH-MYIN.cmd" >nul
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

git commit -m "Add initial MYIN hackathon MVP"
if errorlevel 1 goto failed

git push -u origin "%MYIN_BRANCH%"
if errorlevel 1 goto failed

gh pr create --draft --base main --head "%MYIN_BRANCH%" --title "Add initial MYIN hackathon MVP" --body "Adds the complete Muslim Youth Internship Network hackathon MVP: student opportunity matching, the transparent 100-point rubric, organization submission and extraction, privacy-safe candidate recommendations, email preview, impact dashboard, responsive styling, local launcher, documentation, and automated checks. The project was added to demonstrate a safe end-to-end student and organization experience. Validation completed before publication: production build, automated tests, TypeScript checks, and linting."
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
