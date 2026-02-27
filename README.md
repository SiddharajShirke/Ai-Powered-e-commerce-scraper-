Application Architecture — Agents, Groq LLM & API Layer
Overview
This is an agentic price comparison engine for Indian e-commerce. A user submits a product query (e.g. "Samsung Galaxy S24 256GB"), and the system scrapes multiple sites, normalizes the data, filters irrelevant results, ranks offers, and returns a structured comparison with an AI-generated recommendation.

The backend is a 5-stage agent pipeline orchestrated by 
main.py
, where each agent transforms a shared 
PipelineState
 object and passes it to the next.

The Pipeline — Stage by Stage
POST /api/compare
1. Planner
2. Scraper
3. Extractor
4. Matcher
5. Ranker
LLM Explanation
JSON Response
Stage 1 — Planner (
planner.py
)
Input	Output
Raw query string (e.g. "samsung galaxy s24 256gb black")	
NormalizedProduct
 + selected_marketplace_keys
What it does:

LLM Parse (via Groq) — sends the query to llama-3.3-70b-versatile with a system prompt asking it to extract {brand, model, storage, ram, color, category, optimized_search_query} as JSON
Regex Fallback — if the LLM call fails (rate limit, key missing), falls back to regex parsing with hardcoded brand/storage/color patterns
Marketplace Selection — picks which sites to scrape based on brand affinity (e.g. Samsung Shop only for Samsung queries)
Groq LLM usage: Parses "iPhone 15 Pro 256GB Natural Titanium" → {brand: "Apple", model: "iPhone 15 Pro", storage: "256GB", color: "Natural Titanium", category: "smartphone", search_query: "Apple iPhone 15 Pro 256GB"}

Stage 2 — Scraper (
scraper.py
 → 
sgai_scraper.py
)
Input	Output
search_query + marketplace_keys	List[RawListing] + List[SiteStatus]
What it does:

The orchestrator in 
sgai_scraper.py
 routes each site to its scraper:

Amazon/Vijay Sales → dedicated Playwright+BS4 scrapers (CSS selectors, no LLM)
All other sites (Flipkart, Croma, JioMart, etc.) → Playwright + Groq LLM extraction
For Playwright+LLM sites, the flow is:

Launch stealth Chromium via Playwright → navigate to search URL → scroll the page
Extract page text with _body_text() (strips scripts/styles, keeps [URL:...] markers)
Truncate text via 
_build_llm_input()
 (word budget + 8K char cap)
Send to Groq (llama-3.1-8b-instant) with a prompt asking for JSON product listings
Parse the LLM response into 
RawListing
 objects
For dedicated scrapers (Amazon, Vijay Sales):

Launch stealth Chromium → fetch HTML
Parse product cards with BeautifulSoup CSS selectors (.a-price-whole, .product-card__inner, etc.)
No LLM call needed — structured data extracted directly from DOM
Groq LLM usage: For non-dedicated sites, the LLM reads raw page text and extracts product fields. The prompt asks for up to N products as a JSON array with title, price, rating, delivery, url. The fast model (llama-3.1-8b-instant) is used here for speed.

Stage 3 — Extractor (
extractor.py
)
Input	Output
List[RawListing] (text fields)	List[NormalizedOffer] (numeric fields)
What it does:

Converts text fields into numeric fields:
price_text: "₹55,999" → discounted_price: 55999.0
rating_text: "4.3 out of 5" → seller_rating: 4.3
delivery_text: "Get it by Mon" → delivery_days_min: 1, delivery_days_max: 3
Computes effective_price (the real cost after discounts)
Deduplicates by URL or platform+title
Does NOT use Groq — purely regex-based parsing
Stage 4 — Matcher (
matcher.py
)
Input	Output
List[NormalizedOffer] + 
NormalizedProduct
 (target)	List[NormalizedOffer] (filtered, scored)
What it does: Scores each offer 0.0–1.0 based on how well it matches the target product:

Hard reject (score=0): wrong variant (S23 when searching S24), wrong category (case/cover), wrong storage (128GB vs 256GB), wrong model number
Positive scoring: brand match (+0.25), model token overlap (+0.50), storage match (+0.25)
Rejects accessories (cases, chargers, screen guards, etc.)
Does NOT use Groq in the main path — purely token-based matching
There's also an 
llm_matcher.py
 available for semantic matching when regex confidence is uncertain (0.3–0.75 range), but it's not called in the current pipeline.

Stage 5 — Ranker (
ranker.py
)
Input	Output
List[NormalizedOffer] (matched)	List[NormalizedOffer] (ranked, with badges)
What it does:

Computes a 0–1 final score using weighted factors based on user preference mode:
Mode	Price Weight	Delivery Weight	Trust Weight
cheapest	0.80	0.10	0.10
fastest	0.15	0.70	0.15
reliable	0.20	0.20	0.60
balanced	0.40	0.30	0.30
Assigns badges: "Best Price", "Fastest Delivery", "Most Trusted", "Recommended"
Sorts by final score → the #1 offer becomes the recommendation
Does NOT use Groq — purely algorithmic
Post-Pipeline: LLM Explanation (
llm_ranker.py
)
After ranking, the pipeline optionally calls Groq to generate a 2-3 sentence natural language recommendation explaining why the top offer is the best choice. This is non-critical — if it fails, the pipeline still returns results without an explanation.

How Agents Interact — The PipelineState
All agents communicate through a single shared object: 
PipelineState
.

PipelineState
writes
writes
reads
reads
writes
writes
reads
writes
reads
reads
writes
reads
writes
request: CompareRequest
normalized_product: NormalizedProduct
selected_marketplace_keys: List[str]
raw_listings: List[RawListing]
site_statuses: List[SiteStatus]
normalized_offers: List[NormalizedOffer]
matched_offers: List[NormalizedOffer]
final_offers: List[NormalizedOffer]
Planner
Scraper
Extractor
Matcher
Ranker
Pattern: Each agent reads from upstream fields and writes to its own downstream field. The state flows sequentially — Planner → Scraper → Extractor → Matcher → Ranker.

Groq LLM Summary
Component	Model Used	Purpose	Critical?
Planner	llama-3.3-70b-versatile	Parse query → product attributes	No (regex fallback)
Scraper (SGAI path)	llama-3.1-8b-instant	Extract products from raw page text	Yes (for non-dedicated sites)
LLM Extractor	llama-3.1-8b-instant	Per-card extraction when CSS fails	Optional
LLM Matcher	llama-3.3-70b-versatile	Semantic matching for uncertain cases	Optional (not called currently)
LLM Explanation	llama-3.3-70b-versatile	Generate recommendation text	No (non-critical)
All LLM calls go through 
llm_client.py
 — a singleton 
GroqLLMClient
 with a semaphore (max 3 concurrent) to respect Groq's free-tier rate limit (30 req/min).

The API Layer
The backend is a FastAPI application serving a React frontend.

Endpoint	Method	Purpose
/	GET	App info and version
/health	GET	LLM status, Groq key presence, marketplace count
/api/marketplaces	GET	List all configured marketplaces with metadata
/api/health/scrapers	GET	Per-site readiness status
/api/compare	POST	Main endpoint — runs the full 5-stage pipeline
/api/debug/compare	POST	Same pipeline but returns all intermediate data
/api/compare Flow
Frontend → POST /api/compare { query: "Samsung Galaxy S24" }
         → _run_pipeline(request)
           → Planner → Scraper → Extractor → Matcher → Ranker → LLM Explanation
         → CompareResponse {
             final_offers: [...ranked offers...],
             recommendation: top offer,
             explanation: "Samsung Galaxy S24 on Amazon at ₹55,999 is...",
             site_statuses: [{amazon: ok}, {flipkart: ok}, ...],
             errors: []
           }
The frontend (React via Vite) calls this endpoint, shows a loading state while the pipeline runs (~15-30s), then renders the comparison table with badges, prices, and the AI recommendation.


Comment
Ctrl+Alt+M
