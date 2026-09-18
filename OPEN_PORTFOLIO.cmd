@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "Portfolio local server" /min py -3 -m http.server 8765 --bind 127.0.0.1 --directory "%~dp0"
  goto open
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "Portfolio local server" /min python -m http.server 8765 --bind 127.0.0.1 --directory "%~dp0"
  goto open
)
if exist "C:\Users\chentong\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" (
  start "Portfolio local server" /min "C:\Users\chentong\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8765 --bind 127.0.0.1 --directory "%~dp0"
  goto open
)
start "" "index.html"
echo 已打开基础页面。完整长视频需要 Python 本地服务或线上网站。
pause
exit /b
:open
ping 127.0.0.1 -n 2 >nul
start "" "http://127.0.0.1:8765/index.html"
