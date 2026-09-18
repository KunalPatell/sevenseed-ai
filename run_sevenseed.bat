@echo off
echo ======================================================================
echo   Starting Sevenseed AI Venture Studio Hub (Port 8000)
echo   Master Hub:       http://localhost:8000/
echo   AVPU:             http://localhost:8000/avpu/
echo   AVP Emart:        http://localhost:8000/avp-emart/
echo   Pharmacy:         http://localhost:8000/pharmacy/
echo   Sevenforce:       http://localhost:8000/sevenforce/
echo   Rakshak AI:       http://localhost:8000/rakshak-ai/
echo   Breakdown:        http://localhost:8000/breakdown/
echo   Charitable Trust: http://localhost:8000/trust/
echo   Comonk AI:        http://localhost:8000/comonk-ai/
echo ======================================================================
cd /d "%~dp0apps\sevenseed\backend"
"C:\Users\kunal\AppData\Local\Programs\Python\Python312\python.exe" main.py
pause
