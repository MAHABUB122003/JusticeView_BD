@echo off
title SecureWAF - Web Application Firewall
color 0A
echo.
echo  ============================================
echo   SecureWAF - Web Application Firewall
echo  ============================================
echo.
echo  Dashboard:   http://localhost:5000/admin
echo  API:         http://localhost:5000/api
echo  Register:    http://localhost:5000/connect
echo.
echo  Default Login: admin / admin123
echo  ============================================
echo.

cd /d "%~dp0"
python app.py

if %ERRORLEVEL% neq 0 (
    echo.
    echo  [ERROR] Make sure Python is installed.
    echo  Run: pip install -r requirements.txt
    echo.
    pause
)
