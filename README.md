# AI-Powered E-Commerce Price Scraper Engine

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![React](https://img.shields.io/badge/React-18.0+-blue.svg)

An intelligent, agentic price comparison engine tailored for Indian e-commerce platforms. 

Users simply type a natural language query (e.g., *"Samsung Galaxy S24 256GB Black"*). Under the hood, the system coordinates an advanced pipeline of AI extraction agents and stealth web scrapers to gather real-time data from platforms like Amazon, Flipkart, Croma, Vijay Sales, JioMart, and Reliance Digital. The engine normalizes the data, filters out spurious accessories, ranks top offers based on multiple factors (price, delivery, trust), and returns a structured comparison along with a natural-language AI recommendation.

---

## 🏗️ System Architecture

The backend pipeline is orchestrated by a multi-agent system in `main.py`, where a shared `PipelineState` flows through 5 distinct functional stages.

```mermaid
graph TD
    classDef agent fill:#f9f,stroke:#333,stroke-width:2px;
    classDef data fill:#e1f5fe,stroke:#01579b,stroke-width:1px;
    classDef ext fill:#fff3e0,stroke:#e65100,stroke-width:1px;
    
    User[User / Frontend] -->|POST /api/compare| API[FastAPI Orchestrator]
    
    subgraph "5-Stage Agent Pipeline"
        P[1. Planner Agent]:::agent --> S[2. Scraper Agent]:::agent
        S --> E[3. Extractor Agent]:::agent
        E --> M[4. Matcher Agent]:::agent
        M --> R[5. Ranker Agent]:::agent
    end
    
    API --> P
    R --> LLM[LLM Explanation]:::agent
    LLM --> API
    API -->|JSON CompareResponse| User
    
    %% Planner details
    P -.->|Query parsing| Groq1[Groq: Llama 3.3 70B]:::ext
    
    %% Scraper details
    S -.->|Dedicated Scraper| PW[Playwright + BS4]:::ext
    S -.->|SGAI Fallback Scraper| Groq2[Groq: Llama 3.1 8B]:::ext
    
    %% Shared State
    State[(Shared PipelineState)]:::data
    P ==>|writes| State
    S ==>|reads/writes| State
    E ==>|reads/writes| State
    M ==>|reads/writes| State
    R ==>|reads/writes| State
```

---

## 🔄 User Flow Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React / Vite UI
    participant API as FastAPI Backend
    participant Pipeline as Agentic Pipeline
    participant LLM as Groq LLM API
    participant Stores as E-Commerce Sites

    User->>Frontend: Enters Product Query
    Frontend->>API: POST /api/compare {query}
    API->>Pipeline: Initialize PipelineState
    
    Note over Pipeline: Stage 1: Planner
    Pipeline->>LLM: Parse attributes (brand, model, storage)
    LLM-->>Pipeline: Extracted attributes & categories
    Pipeline->>Pipeline: Select relevant marketplaces
    
    Note over Pipeline: Stage 2: Scraper
    par Concurrent Scraping
        Pipeline->>Stores: Launch Stealth Playwright
        Stores-->>Pipeline: Raw HTML / Text
    end
    Pipeline->>LLM: Fallback extract JSON from generic text
    LLM-->>Pipeline: List of Raw Listings
    
    Note over Pipeline: Stage 3: Extractor
    Pipeline->>Pipeline: Clean currency/strings to integers/floats
    
    Note over Pipeline: Stage 4: Matcher
    Pipeline->>Pipeline: Score Listings (Reject accessories, wrong variants)
    
    Note over Pipeline: Stage 5: Ranker
    Pipeline->>Pipeline: Rank based on price, delivery, and trust weights
    
    Note over Pipeline: Post-Process: Explanation
    Pipeline->>LLM: "Explain why offer #1 is the best"
    LLM-->>Pipeline: AI Justification summary
    
    Pipeline-->>API: CompareResponse
    API-->>Frontend: JSON Dashboard Data
    Frontend-->>User: Visual Price Comparison & AI Recommendation
```

---

## ⚙️ The Pipeline — End-to-End Workflow

### Stage 1 — Planner (`planner.py`)
- **Input:** Raw query string.
- **Action:** Uses Groq (llama-3.3-70b-versatile) to extract structured fields `{brand, model, storage, ram, color, category, optimized_search_query}`.
- **Resilience:** Regex fallback activated if the LLM rate limit triggers.
- **Routing:** Dynamically selects marketplaces based on brand affinity (e.g., skips irrelevant sites).

### Stage 2 — Scraper (`scraper.py` → `sgai_scraper.py`)
- **Input:** Search query & chosen marketplaces.
- **Action:**
  - *Dedicated Sites (Amazon, Vijay Sales):* Direct HTML extraction using Playwright + BeautifulSoup. High speed, reliable CSS parsing.
  - *Generic Sites:* Launches Playwright stealth instances, extracts clean viewport body text, and pipes it to Groq (llama-3.1-8b-instant) for intelligent, generalized JSON extraction.

### Stage 3 — Extractor (`extractor.py`)
- **Input:** Text-heavy `RawListing` objects.
- **Action:** Highly aggressive Regex routines convert text strings into clean numeric structures (e.g., `"₹55,999"` → `55999.0`, `"Get it by Mon"` → `min/max delivery days`). Deals with deduplication.

### Stage 4 — Matcher (`matcher.py`)
- **Input:** Clean numerics + Intent Target.
- **Action:** Scoring engine checks variant mismatches (S23 vs S24), invalidates accessories (charging blocks, covers), and computes a confidence score `[0.0 - 1.0]`. Low scores are pruned.

### Stage 5 — Ranker (`ranker.py`)
- **Input:** Verified matched offers.
- **Action:** Adjusts rankings based on the user's focus (cheapest vs. fastest vs. most reliable). Injects aesthetic UI badges ("Best Price", "Most Trusted"). The `#1` ranked offer triggers the LLM explanation generator.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, TailwindCSS (Responsive, Glassmorphic UI)
- **Backend Core:** Python 3.11+, FastAPI (Async Orchestration)
- **Scraping Engine:** Playwright (Stealth Plugins), BeautifulSoup4
- **AI/LLM Layer:** Groq APIs, featuring Llama 3 70B (Deep extraction) and Llama 3 8B (Fast parsing).
- **Concurrency:** `asyncio`, Semaphore-based LLM rate limiting.

---

## 💻 Installation & Setup

### 1. Pre-requisites
- Python 3.11+
- Node.js v18+
- Go to [Groq Console](https://console.groq.com/keys) to generate your API key.

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/SiddharajShirke/Ai-Powered-e-commerce-scraper-.git
cd Ai-Powered-e-commerce-scraper-

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Install stealth browsers
playwright install
playwright install-deps

# Set up environment variables
cp .env.example .env
nano .env  # Add your GROQ_API_KEY
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Running the Complete System
Start the FastAPI server:
```bash
# In the root project directory (ensure venv is active)
uvicorn app.main:app --reload --port 8000
```
Open `http://localhost:5173` in your browser.

---

## 📡 Essential API Routes

- **`GET /`**: Server Heartbeat.
- **`GET /health`**: LLM connectivity status & system readiness.
- **`GET /api/marketplaces`**: Available vendor scraping modules.
- **`POST /api/compare`**: The main orchestration endpoint. Triggers the 5-stage pipeline and returns the full `CompareResponse`. 
- **`POST /api/debug/compare`**: Similar to above but dumps the `PipelineState` step by step for telemetry.

---
*Built to bring total transparency and speed to consumer price discovery.*
