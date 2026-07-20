@echo off
:restart
echo [%date% %time%] Starting COMONK Overnight Deep Enricher...
cd /d "C:\Users\Capermint\Project\linkdin"
python -X utf8 COMONK_OVERNIGHT_DEEP_ENRICH.py
echo [%date% %time%] Script stopped. Restarting in 15 seconds...
timeout /t 15 /nobreak
goto restart
