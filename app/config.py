# -*- coding: utf-8 -*-
from __future__ import annotations
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # ── Groq LLM ─────────────────────────────────────────────────────────────
    groq_api_key:       str  = ""
    groq_primary_model: str  = "llama-3.3-70b-versatile"
    groq_fast_model:    str  = "llama-3.1-8b-instant"
    llm_enabled:        bool = True
    llm_max_concurrent: int  = 3

    # ── Browser ───────────────────────────────────────────────────────────────
    playwright_headless: bool = True

    # ── Marketplaces ─────────────────────────────────────────────────────────
    marketplaces_dir: str = "app/marketplaces/configs"

    # ── CORS ─────────────────────────────────────────────────────────────────
    allowed_origins: str = "http://127.0.0.1:8000,http://localhost:8000,http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins(self) -> List[str]:
        """Split comma-separated ALLOWED_ORIGINS into a list."""
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    # ── Redis (optional caching) ─────────────────────────────────────────────
    redis_url: str = ""       # e.g. redis://localhost:6379/0

    # ── SerpAPI (Feature 2 — Chatbot Assistant) ───────────────────────────────
    serpapi_key: str = ""     # Get key at https://serpapi.com

    # ── PostgreSQL (optional price history) ───────────────────────────────────
    database_url: str = ""    # e.g. postgresql://user:pass@localhost:5432/prices

    # ── App ───────────────────────────────────────────────────────────────────
    debug:     bool = False
    log_level: str  = "INFO"

    class Config:
        env_file          = ".env"
        env_file_encoding = "utf-8"
        extra             = "ignore"


settings = Settings()
