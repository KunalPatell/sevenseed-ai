# run_overnight.py
# Overnight pipeline execution script.
# Order of operations:
# 1. COMONK_DEEP_ENRICH.py (Fetch emails and phones for missing targets)
# 2. COMONK_VALIDATE_CONTACTS.py (Clean bad formats, syntax errors, verify active MX records)
# 3. final_sheet_polish.py (Index rows, sort priorities, color-code sheet)

import subprocess
import time
from datetime import datetime

LOG_FILE = "overnight_pipeline_log.txt"

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def run_script(script_name):
    log(f"Starting execution of {script_name}...")
    try:
        # Run with UTF-8 encoding support
        proc = subprocess.Popen(
            ["python", "-X", "utf8", script_name],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8"
        )
        
        # Read output in real-time
        while True:
            line = proc.stdout.readline()
            if not line and proc.poll() is not None:
                break
            if line:
                line_str = line.strip()
                # Print and write to log (avoid duplicate timestamping for subprocess output)
                print(f"  [{script_name}] {line_str}", flush=True)
                with open(LOG_FILE, "a", encoding="utf-8") as f:
                    f.write(f"  [{script_name}] {line_str}\n")
                    
        return_code = proc.poll()
        if return_code == 0:
            log(f"✅ {script_name} completed successfully.")
        else:
            log(f"⚠️ {script_name} exited with return code {return_code}.")
        return return_code
    except Exception as e:
        log(f"❌ Error executing {script_name}: {e}")
        return -1

def main():
    log("\n" + "="*80)
    log("  COMONK OVERNIGHT PIPELINE MANAGER")
    log("="*80 + "\n")

    # Step 1: Deep Enrichment
    log("STEP 1: Gathering missing emails & phone numbers...")
    run_script("COMONK_DEEP_ENRICH.py")
    
    # Wait a few seconds for file handlers to clear
    time.sleep(5)

    # Step 2: Validation and Cleanup
    log("STEP 2: Validating emails via DNS/MX lookup and formatting phone numbers...")
    run_script("COMONK_VALIDATE_CONTACTS.py")

    # Wait a few seconds
    time.sleep(5)

    # Step 3: Polish and Sort
    log("STEP 3: Sorting priorities and applying custom coloring to sheet...")
    run_script("final_sheet_polish.py")

    log("\n" + "="*80)
    log("  OVERNIGHT PIPELINE EXECUTION COMPLETED")
    log("="*80 + "\n")

if __name__ == "__main__":
    main()
