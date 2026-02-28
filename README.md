# AI-Powered E-Commerce Price Comparison Engine

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![LangGraph](https://img.shields.io/badge/LangGraph-Pipeline-purple)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

An intelligent, **agentic** price comparison engine for **Indian e-commerce marketplaces**, powered by a **LangGraph** multi-agent pipeline, **Groq LLM** extraction, and **stealth Playwright** scraping.

Type a natural-language query like *"Samsung Galaxy S24 256GB"* — the system scrapes **10+ marketplaces in parallel**, extracts structured product data with AI, matches and ranks offers, and returns a comparison with an **AI-generated recommendation**.

Also includes a standalone **AI Shopping Chatbot** that fetches live prices from Google Shopping via SerpAPI.

---

## Features (Detailed)

### 1. Price Comparison Pipeline (LangGraph)
- **6-stage agentic pipeline** orchestrated by LangGraph `StateGraph`:
  - **Planner:** Parses user query, selects marketplaces
  - **Scrapers:** Parallel scraping of 12+ Indian marketplaces
  - **Extractor:** Normalizes raw listings, cleans URLs, parses prices/delivery
  - **Matcher:** Multi-gate product matching, LLM semantic fallback
  - **Ranker:** Mode-aware scoring (Cheapest, Fastest, Reliable, Balanced)
  - **Explainer:** AI-generated recommendation for best offer
- **LLM intelligence:** Groq Llama 3.3 70B for query parsing, matching, selector discovery, and recommendations
- **SSE streaming:** Real-time progress events per marketplace
- **Delivery info extraction:** Parsed delivery days, marketplace-specific fallbacks
- **Product image thumbnails:** Extracted from product cards
- **Working product URLs:** Cleaned per-site, search-URL fallback

### 2. Watchlist & Alerts
- **Save products to watchlist** with custom price drop thresholds
- **AI-generated email alerts** sent via Gmail SMTP when price drops or item is added
- **Automated scheduler** checks prices every 6 hours, sends alerts
- **SQLite fallback database** for watchlist and price history

### 3. AI Shopping Chatbot
- **Intent classification** (Groq LLM)
- **Live Google Shopping prices** via SerpAPI
- **Conversational AI** with context-aware responses
- **Product cards** with thumbnail, price, rating, delivery, and "View Deal" links

### 4. Modern Frontend
- **React 18 + Vite SPA**
- **Dark theme, glassmorphic UI**
- **Offer cards** with rank badge, platform icon, price, delivery, seller/rating, CTA button
- **Live progress tracking** (SSE)
- **Chatbot overlay** with floating "Ask AI" button
- **Watchlist modal:** Full-screen blur, threshold pills, success animation

---

## System Architecture (Detailed)

```mermaid
graph TD
    User[User (Web Browser)]
    FE[Frontend (React + Vite)]
    API[Backend API (FastAPI)]
    DB[(SQLite DB)]
    LLM[Groq LLM (AI)]
    SMTP[Gmail SMTP (Email)]
    Scrapers[Marketplace Scrapers]
    Scheduler[Price Monitor Scheduler]

    User --> FE
    FE -->|REST API| API
    API -->|CRUD| DB
    API -->|Run Scraper| Scrapers
    API -->|Generate Email| LLM
    API -->|Send Email| SMTP
    API -->|Schedule Checks| Scheduler
    Scheduler -->|Periodic Price Check| Scrapers
    Scrapers -->|Results| API
    API --> FE
```

- **Frontend:** React SPA, communicates with backend via REST API
- **Backend:** FastAPI app, orchestrates pipeline, watchlist, chatbot, and email
- **Database:** SQLite (fallback, async) for watchlist and price history
- **LLM:** Groq API for query parsing, matching, extraction, recommendations, and email content
- **Email:** Gmail SMTP for sending alerts and confirmations
- **Scrapers:** Playwright-based modules for each marketplace
- **Scheduler:** APScheduler for periodic price checks and alerting

---

## End-to-End Workflow (Step-by-Step)

1. **User** searches for a product or interacts with the chatbot on the frontend.
2. **Frontend** sends request to **Backend API** (`/api/compare` or `/api/chat`).
3. **API** triggers the LangGraph pipeline:
    - **Planner** parses query, selects marketplaces
    - **Scrapers** run in parallel, fetch product listings
    - **Extractor** normalizes data, cleans URLs, parses prices/delivery
    - **Matcher** matches products, scores offers
    - **Ranker** ranks offers by mode (Cheapest, Fastest, Reliable, Balanced)
    - **Explainer** generates AI recommendation
4. **API** streams results to frontend (SSE) or returns JSON.
5. **User** can save products to watchlist (with threshold).
6. **API** saves watchlist item, sends AI-generated confirmation email via Gmail SMTP.
7. **Scheduler** runs every 6 hours, checks prices, sends price drop alerts.
8. **Frontend** displays results, watchlist, and notifications.

---

## Installation & Setup (Step-by-Step)

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** and npm
- **Groq API Key** (required)
- **SerpAPI Key** (optional, for chatbot)
- **Gmail App Password** (for email alerts)

### Backend Setup
```bash
git clone https://github.com/SiddharajShirke/Ai-Powered-e-commerce-scraper-.git
cd Ai-Powered-e-commerce-scraper-
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

### Environment Configuration
```bash
cp .env.example .env
```
Edit `.env` and add your API keys:
```dotenv
GROQ_API_KEY=your_groq_api_key_here
SERPAPI_KEY=your_serpapi_key_here
SMTP_USER=your_gmail_address
SMTP_PASSWORD=your_gmail_app_password
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Running the Application
**Backend:**
```bash
python run.py
```
**Frontend:**
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Pipeline Stages (Detailed)

### Stage 1 — Planner (`agents/planner.py`)
- Parses query using Groq LLM
- Extracts product attributes (brand, model, storage, RAM, color, category)
- Selects target marketplaces
- Fallback to regex parsing if LLM fails

### Stage 2 — Scrapers (`agents/scraper.py`)
- Parallel scraping of all marketplaces
- Playwright stealth browser for anti-detection
- Amazon/Vijay Sales: Playwright + BeautifulSoup4
- Others: Playwright + Groq LLM extraction

### Stage 3 — Extractor (`agents/extractor.py`)
- Normalizes listings into `NormalizedOffer` objects
- Parses prices, delivery, cleans URLs
- Deduplication and fallback logic

### Stage 4 — Matcher (`agents/matcher.py`)
- Multi-gate matching (type, brand, model, storage, category, accessory)
- Weighted scoring, thresholding
- LLM semantic matching fallback
- Retry loop for zero matches

### Stage 5 — Ranker (`agents/ranker.py`)
- Mode-aware scoring (Cheapest, Fastest, Reliable, Balanced)
- Assigns badges (Best Price, Fastest Delivery, Most Trusted, Recommended)

### Stage 6 — Explainer (`agents/llm_ranker.py`)
- Generates AI recommendation for best offer

---

## Tech Stack (Detailed)

| Layer         | Technology                                                      |
|--------------|------------------------------------------------------------------|
| Frontend     | React 18, Vite 6, CSS Variables (dark mode)                      |
| Backend      | Python 3.11+, FastAPI, Uvicorn (async)                           |
| Pipeline     | LangGraph StateGraph with parallel fan-out/fan-in                |
| LLM          | Groq — Llama 3.3 70B Versatile + Llama 3.1 8B Instant            |
| Scraping     | Playwright (stealth anti-detection), BeautifulSoup4, lxml        |
| Chatbot      | SerpAPI Google Shopping + Groq conversational LLM                |
| Caching      | Redis (optional, 5-min TTL)                                      |
| Config       | YAML marketplace configs, Pydantic Settings, `.env`              |
| Dev          | Watchfiles hot-reload, Vite HMR proxy                            |

---

## API Endpoints (Detailed)

| Method | Endpoint                | Description                                                      |
|--------|------------------------|------------------------------------------------------------------|
| GET    | `/`                    | Server heartbeat                                                 |
| GET    | `/health`              | System readiness + LLM connectivity                              |
| GET    | `/api/marketplaces`    | List all configured marketplace scrapers                         |
| POST   | `/api/compare`         | Main endpoint — triggers LangGraph pipeline, SSE/JSON response   |
| POST   | `/api/compare/sync`    | Synchronous JSON-only version                                    |
| POST   | `/api/chat`            | Chatbot endpoint — Intent → SerpAPI → LLM response               |
| POST   | `/api/debug/compare`   | Debug mode — returns full pipeline state                         |

### Compare Request Body
```json
{
    "query": "Samsung Galaxy S24 128GB",
    "mode": "balanced",
    "preferences": {
        "mode": "balanced",
        "min_match_score": 0.4
    }
}
```

### Chat Request Body
```json
{
    "message": "Best phone under 20000",
    "chat_history": [
        { "role": "user", "content": "..." },
        { "role": "assistant", "content": "..." }
    ]
}
```

---

## Project Structure (Detailed)

```
├── run.py                      # Entry point — uvicorn + hot-reload
├── requirements.txt            # Python dependencies
├── .env.example                # Environment template
├── .gitignore
│
├── app/
│   ├── main.py                 # FastAPI app, SSE/sync/chat endpoints
│   ├── config.py               # Pydantic Settings (.env loader)
│   ├── schemas.py              # All data models (NormalizedOffer, etc.)
│   ├── state.py                # LangGraph CompareState TypedDict
│   ├── graph.py                # LangGraph StateGraph wiring
│   │
│   ├── agents/                 # Pipeline stage implementations
│   │   ├── planner.py          # Stage 1: Query parsing + marketplace selection
│   │   ├── scraper.py          # Stage 2: Scraper node factory (parallel)
│   │   ├── extractor.py        # Stage 3: Normalization, URL cleaning, delivery
│   │   ├── matcher.py          # Stage 4: Product matching (6-gate + scoring)
│   │   ├── ranker.py           # Stage 5: Mode-aware ranking + badges
│   │   ├── llm_extractor.py    # LLM CSS selector discovery
│   │   ├── llm_matcher.py      # LLM semantic matching
│   │   └── llm_ranker.py       # Stage 6: AI recommendation generator
│   │
│   ├── scraping/               # Marketplace scraper implementations
│   │   ├── sgai_scraper.py     # Core: Playwright + Groq LLM extraction
│   │   ├── amazon.py           # Amazon.in (Playwright + BS4)
│   │   ├── vijay_sales.py      # Vijay Sales (Playwright + BS4)
│   │   ├── flipkart.py         # Flipkart
│   │   ├── croma.py            # Croma
│   │   ├── jiomart.py          # JioMart
│   │   ├── meesho.py           # Meesho
│   │   ├── snapdeal.py         # Snapdeal
│   │   ├── tata_cliq.py        # Tata CLiQ
│   │   ├── reliance_digital.py # Reliance Digital
│   │   ├── samsung_shop.py     # Samsung Shop
│   │   └── base.py             # Base scraper (Requests + BS4)
│   │
│   ├── marketplaces/           # Marketplace configuration
│   │   ├── registry.py         # YAML config loader + registry
│   │   └── configs/            # Per-site YAML configs (selectors, URLs)
│   │       ├── amazon.yaml
│   │       ├── flipkart.yaml
│   │       └── ... (12 sites)
│   │
│   ├── watchlist/              # Watchlist, email sender, scheduler
│   │   ├── models.py           # SQLite fallback DB
│   │   ├── service.py          # CRUD for watchlist
│   │   ├── email_sender.py     # AI-generated email alerts
│   │   ├── scheduler.py        # APScheduler for price checks
│   │   ├── price_monitor.py    # Price check logic
│   │   └── schemas.py          # Watchlist models
│   │
│   ├── chatbot/                # AI Shopping Chatbot (Feature 2)
│   │   ├── intent.py           # Step 1: Intent classification (Groq)
│   │   ├── search.py           # Step 2: SerpAPI Google Shopping
│   │   ├── responder.py        # Step 3: LLM response generation
│   │   ├── service.py          # Orchestrator
│   │   └── schemas.py          # ChatRequest, ChatResponse, ShoppingResult
│   │
│   └── utils/
│       ├── llm_client.py       # Groq client with semaphore rate limiting
│       └── logger.py           # Centralized logging config
│
└── frontend/
    ├── package.json
    ├── vite.config.js          # Dev proxy (/api → :8000)
    └── src/
        ├── App.jsx             # Main comparison UI + OfferCard
        ├── main.jsx            # React entry
        ├── index.css           # All styles (dark theme + chatbot)
        └── components/
            ├── WatchlistButton.jsx   # Watchlist modal
            └── ChatbotAssistant.jsx  # Chatbot overlay component
```

---

## Supported Marketplaces (Detailed)

| Marketplace      | Scraping Method                | Delivery Extraction         |
|------------------|-------------------------------|----------------------------|
| Amazon.in        | Playwright + BS4              | CSS selectors + Prime      |
| Flipkart         | Playwright + Groq LLM         | LLM extraction             |
| Croma            | Playwright + Groq LLM         | LLM extraction             |
| JioMart          | Playwright + Groq LLM         | LLM extraction             |
| Reliance Digital | Playwright + Groq LLM         | LLM extraction             |
| Tata CLiQ        | Playwright + Groq LLM         | LLM extraction             |
| Vijay Sales      | Playwright + BS4              | CSS selectors              |
| Samsung Shop     | Playwright + Groq LLM         | LLM extraction             |
| Meesho           | Playwright + Groq LLM         | LLM + fallback estimate    |
| Snapdeal         | Playwright + Groq LLM         | LLM + fallback estimate    |
| Paytm Mall       | Playwright + Groq LLM         | LLM extraction             |
| Shopsy           | Playwright + Groq LLM         | LLM extraction             |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built to bring transparency and intelligence to consumer price discovery across India.*
