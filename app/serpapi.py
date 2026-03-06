# -*- coding: utf-8 -*-
"""
SerpAPI integration for price comparison (Feature 1).
"""
import asyncio
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

async def fetch_serpapi_prices(query: str) -> list:
    try:
        from serpapi import GoogleSearch
        api_key = getattr(settings, "serpapi_key", "").strip()
        if not api_key:
            logger.error("SERPAPI_KEY not set in .env — cannot fetch prices")
            return []
        params = {
            "engine": "google_shopping",
            "q": query,
            "api_key": api_key,
            "gl": "in",
            "hl": "en",
            "num": 10,
        }
        loop = asyncio.get_event_loop()
        search = GoogleSearch(params)
        results = await loop.run_in_executor(None, search.get_dict)
        shopping_results = results.get("shopping_results", [])
        prices = []
        for item in shopping_results:
            prices.append({
                "title": item.get("title", ""),
                "price": item.get("price", None),
                "source": item.get("source", None),
                "link": item.get("product_link") or item.get("link"),
            })
        logger.info("SerpAPI: %d prices found for '%s'", len(prices), query[:60])
        return prices
    except Exception as e:
        logger.error("SerpAPI fetch failed: %s", str(e)[:150])
        return []
