# Implementation Plan — Add Logic, Features & Interactive Demos

We will take the backend modules/endpoints that were mined from your other directories (like `Nearby-Hospital-locator`, `Emergency-Calls-Priority-System`, `OCR-Text-Extractor`, and `bestseller-analytics`) and fully integrate them into both the Next.js React dashboard portals (under `apps/`) and the static marketing pages (under the root folder) using interactive live sandbox widgets.

Additionally, we will save the two integration reference documents you provided directly to the workspace as persistent markdown documentation.

---

## 📌 Proposed Changes

We will group our changes by component layers:

### 📑 Workspace Documentation

We will save the two reference documents you provided so they are persisted in your workspace for audit and record-keeping:
- #### [NEW] [SOURCE_TO_TARGET_AUDIT.md](file:///e:/Project/My%20Startups/SOURCE_TO_TARGET_AUDIT.md)
  - Contains the complete Source-to-Target Features Integration Audit report detailing how each folder is mapped.
- #### [NEW] [SUJIT_INTEGRATION_WALKTHROUGH.md](file:///e:/Project/My%20Startups/SUJIT_INTEGRATION_WALKTHROUGH.md)
  - Contains the Walkthrough detailing the Sujit project integrations, helper modules, and compilation verification status.

### 1️⃣ Marketing Site Generator (`generate_sites.py`)

Currently, the generated marketing sites (`index.html`) under the root folder of the workspace are entirely static. We will add logic and interactive widgets to make them come alive:
- **Set Local `app_url` Links**: Define the correct local app URLs for each startup in `generate_sites.py` (e.g., `http://localhost:8003/app/` for AVPU, `http://localhost:8007/app/` for AVP Emart) so the "Launch Portal App" buttons link directly to the functional React/Next.js dashboards.
- **AI Live Sandbox Widgets**: Add a new "Try the AI Live" card section to the templates inside `generate_sites.py`. For each company, this widget will feature an interactive form that calls the corresponding local FastAPI endpoint:
  - **Sevenseed**: Venture idea evaluator (`/api/tools/evaluate` on port 8001).
  - **Sevenforce**: Agent simulator (calls `/api/agent/run` on port 8002).
  - **AVPU**: Study planner (`/api/tools/study-plan` on port 8003).
  - **Decode Forest Pharmacy**: Drug interaction checker (`/api/tools/interactions` on port 8004).
  - **Breakdown Factor**: BOQ estimator (`/api/tools/boq` on port 8005).
  - **AVP Charitable Trust**: Needs assessor (`/api/needs` on port 8006).
  - **AVP Emart**: Live price comparator search (`/api/compare` on port 8007).
- **Inline JS Event Handlers**: Update the template's `APP_JS` section to wire up the interactive widgets to execute `fetch` requests and display results directly on the marketing landing pages.

### 2️⃣ React Next.js Frontends (`apps/<slug>/frontend/`)

We will add missing UI panels and pages to wire up the backend logic:
- #### [MODIFY] [page.tsx](file:///e:/Project/My%20Startups/apps/decode-forest-pharmacy/frontend/src/app/app/page.tsx)
  - Add a **Hospital Locator** panel to the sidebar and UI layout.
  - Allow users to enter a city and radius, call the `/api/tools/nearby-hospitals` endpoint, and render the results with Google Maps links and phone numbers.
- #### [MODIFY] [page.tsx](file:///e:/Project/My%20Startups/apps/avp-charitable-trust/frontend/src/app/app/page.tsx)
  - Add an **Emergency Call Triage** panel to the sidebar and UI.
  - Allow users to upload or record an audio message, call the `/api/tools/emergency-voice-prioritize` endpoint, and display the transcribed text, urgency level, and action plan.
- #### [MODIFY] [page.tsx](file:///e:/Project/My%20Startups/apps/breakdown-factor/frontend/src/app/app/page.tsx)
  - Add a **Site Doc & Signage OCR** panel to the sidebar and UI.
  - Allow users to upload an image of a permit, load limit sign, or delivery note, call the `/api/tools/site-doc-ocr` endpoint, and display safety alerts and summaries.
- #### [MODIFY] [page.tsx](file:///e:/Project/My%20Startups/apps/avp-emart/frontend/src/app/app/page.tsx)
  - Add a **Price Forecasting** panel to the sidebar and UI.
  - Allow users to search for a product and call `/api/tools/price-forecast` to display advanced pricing statistics and confidence levels.

### 3️⃣ Fast API Backends (`apps/<slug>/backend/`)

- Ensure the endpoints needed by the frontends are properly imported and active.
- Verify that `requirements.txt` dependencies (such as `pandas` for hospital locations and `easyocr` + `opencv-python-headless` for site document OCR) are installed and import cleanly.

---

## 🔍 Verification Plan

### Automated Tests
We will execute:
- Compile check: `python -m py_compile main.py features.py` in each backend directory to ensure zero syntax or import errors.
- Build check: Run `npm run build` inside `frontend/` folders to verify Next.js builds successfully.

### Manual Verification
- We will boot the services using `run_all.py` and test the interactive AI sandbox widgets on the marketing pages (`http://localhost:8001`, etc.) as well as the new dashboard panels inside the portals (`http://localhost:8003/app/`, etc.).
