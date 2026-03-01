@echo off
REM AuthGuard AI Setup Script for Windows
REM This script helps configure AI features for AuthGuard

echo.
echo ========================================
echo   AuthGuard - AI Integration Setup
echo ========================================
echo.

REM Check if .env exists
if exist .env (
    echo [OK] .env file already exists
    set /p overwrite="Do you want to overwrite it? (y/N): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled. Edit .env manually to add your API key.
        pause
        exit /b 0
    )
)

REM Copy .env.example to .env
if exist .env.example (
    copy .env.example .env > nul
    echo [OK] Created .env file from template
) else (
    echo [WARNING] .env.example not found. Creating new .env file...
    (
        echo # Anthropic Claude API Configuration
        echo VITE_ANTHROPIC_API_KEY=
    ) > .env
)

echo.
echo Configuration Steps:
echo.
echo 1. Visit: https://console.anthropic.com/
echo 2. Sign up or log in to your account
echo 3. Navigate to 'API Keys' section
echo 4. Click 'Create Key'
echo 5. Copy your API key (starts with sk-ant-api03-...)
echo.
set /p api_key="Paste your Anthropic API key here: "

if "%api_key%"=="" (
    echo.
    echo [WARNING] No API key provided. You can add it later in .env file
    echo.
    echo To add it manually:
    echo 1. Open .env file in a text editor
    echo 2. Set VITE_ANTHROPIC_API_KEY=your-key-here
) else (
    REM Update .env with the API key
    powershell -Command "(Get-Content .env) -replace 'VITE_ANTHROPIC_API_KEY=.*', 'VITE_ANTHROPIC_API_KEY=%api_key%' | Set-Content .env"
    echo [OK] API key configured in .env
)

echo.
echo ========================================
echo   Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Install dependencies:  npm install
echo 2. Start dev server:      npm run dev
echo 3. Open http://localhost:5173
echo.
echo For more information, see AI_INTEGRATION.md
echo.
pause
