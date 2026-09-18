@echo off
setlocal
cls
echo ======================================================================
echo             SEVENSEED PLATFORM — LOCAL RUNNER MENU
echo ======================================================================
echo   [1] Run Sevenseed Master Hub (All 8 Ventures on Port 8000)
echo   [2] Run AVPU - AI University (Port 8002)
echo   [3] Run AVP Emart - Smart Shopping & Comparator (Port 8001)
echo   [4] Run Decode Forest Pharmacy (Port 8005)
echo   [5] Run Sevenforce - AI Swarm & Workforce (Port 8006)
echo   [6] Run Rakshak AI - Vision Security (Port 8007)
echo   [7] Run Breakdown Factor - Construction AI (Port 8003)
echo   [8] Run AVP Charitable Trust (Port 8004)
echo   [9] Run Comonk AI - Career Intelligence (Port 8008)
echo   [10] Run All-Ventures Benchmark Verification Suite
echo   [0] Exit
echo ======================================================================
set /p choice="Select an option (0-10): "

if "%choice%"=="1" (
    echo Starting Sevenseed Master Hub on http://localhost:8000 ...
    cd /d "%~dp0apps\sevenseed\backend"
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
) else if "%choice%"=="2" (
    echo Starting AVPU on http://localhost:8002 ...
    cd /d "%~dp0apps\avpu\backend"
    set PORT=8002
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
) else if "%choice%"=="3" (
    echo Starting AVP Emart on http://localhost:8001 ...
    cd /d "%~dp0apps\avp-emart\backend"
    set PORT=8001
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
) else if "%choice%"=="4" (
    echo Starting Decode Forest Pharmacy on http://localhost:8005 ...
    cd /d "%~dp0apps\decode-forest-pharmacy\backend"
    set PORT=8005
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
) else if "%choice%"=="5" (
    echo Starting Sevenforce on http://localhost:8006 ...
    cd /d "%~dp0apps\sevenforce\backend"
    set PORT=8006
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
) else if "%choice%"=="6" (
    echo Starting Rakshak AI on http://localhost:8007 ...
    cd /d "%~dp0apps\rakshak-ai\backend"
    set PORT=8007
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
) else if "%choice%"=="7" (
    echo Starting Breakdown Factor on http://localhost:8003 ...
    cd /d "%~dp0apps\breakdown-factor\backend"
    set PORT=8003
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
) else if "%choice%"=="8" (
    echo Starting AVP Charitable Trust on http://localhost:8004 ...
    cd /d "%~dp0apps\avp-charitable-trust\backend"
    set PORT=8004
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
) else if "%choice%"=="9" (
    echo Starting Comonk AI on http://localhost:8008 ...
    cd /d "%~dp0apps\comonk-ai"
    set PORT=8008
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" comonk_backend.py
) else if "%choice%"=="10" (
    cd /d "%~dp0"
    "C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" tests\test_all_ventures_benchmarks.py
    pause
) else (
    echo Exiting.
)
