@echo off
echo ========================================
echo FlowLink - Rebuild All Components
echo CRITICAL: This rebuild includes session persistence fixes
echo ========================================
echo.

echo [1/3] Building Signaling Server (with grace period fix)...
cd signaling-server
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Signaling server build failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Signaling server built successfully
echo.

echo [2/3] Building Web Viewer (StrictMode disabled)...
cd web-viewer
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Web viewer build failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Web viewer built successfully
echo.

echo [3/3] Building Desktop Agent...
cd desktop-agent
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Desktop agent build failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Desktop agent built successfully
echo.

echo ========================================
echo ✓ Build Complete - All Fixes Applied!
echo ========================================
echo.
echo CRITICAL FIXES INCLUDED:
echo • Session persistence (10s grace period)
echo • React StrictMode disabled
echo • Offer/answer routing corrected
echo • End session button added
echo • Connection timeout handling
echo.
echo Next steps:
echo 1. Start signaling server: cd signaling-server ^&^& npm start
echo 2. Start web viewer: cd web-viewer ^&^& npm run dev
echo 3. Start desktop agent: cd desktop-agent ^&^& npm start
echo.
echo Then test connection - stream should appear in 5-10 seconds!
echo.
pause
