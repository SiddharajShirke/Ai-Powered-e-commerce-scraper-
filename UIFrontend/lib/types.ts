export interface RankingPreferences {
  mode: string;
  min_match_score: number;
}

export interface CompareRequest {
  query?: string;
  product_url?: string;
  mode: string;
  preferences: RankingPreferences;
  allowed_marketplaces?: string[];
}

export interface ScoreBreakdown {
  price_score: number;
  delivery_score: number;
  trust_score: number;
  final_score: number;
}

export interface NormalizedOffer {
  platform_key: string;
  platform_name: string;
  listing_url: string;
  title: string;
  image_url?: string;
  seller_name?: string;

  base_price?: number;
  discounted_price?: number;
  coupon_savings: number;
  shipping_fee: number;
  effective_price?: number;

  delivery_days_min?: number;
  delivery_days_max?: number;
  delivery_text?: string;

  seller_rating?: number;
  review_count?: number;
  return_policy_days?: number;
  return_type?: string;
  warranty_text?: string;

  match_score: number;
  score_breakdown: ScoreBreakdown;
  recommendation_note?: string;
  rank: number;
  badges: string[];

  raw_price?: string;
  composite_score: number;
  site: string;
  url: string;
  rating?: number;
  delivery?: string;
}

export interface CountsSummary {
  raw_listings: number;
  normalized_offers: number;
  matched_offers: number;
  ranked_offers: number;
}

export interface SiteStatus {
  marketplace_key: string;
  marketplace_name: string;
  status: string;
  message: string;
  listings_found: number;
  site: string;
  status_string: string;
  listing_count: number;
}

export interface CompareResponse {
  query_time_seconds: number;
  normalized_product?: any;
  selected_marketplaces: string[];
  counts: CountsSummary;
  final_offers: NormalizedOffer[];
  offers: NormalizedOffer[];
  recommendation?: NormalizedOffer;
  total_offers_found: number;
  site_statuses: SiteStatus[];
  explanation?: string;
  errors: string[];
}

export interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

export interface ShoppingResult {
  title: string;
  price?: string;
  rating?: number;
  reviews?: number;
  source?: string;
  delivery?: string;
  thumbnail?: string;
  link?: string;
}

export interface ChatRequest {
  message: string;
  chat_history: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  products: ShoppingResult[];
  source: string;
  intent: string;
}

export interface SaveItemRequest {
  user_email: string;
  product_query: string;
  product_title: string;
  site: string;
  saved_price: number;
  product_url: string;
  thumbnail_url?: string;
  mode: string;
  alert_threshold: number;
}

export interface WatchlistItemResponse {
  id: string;
  user_email: string;
  product_title: string;
  site: string;
  saved_price: number;
  current_price?: number;
  price_change_pct?: number;
  price_dropped: boolean;
  product_url: string;
  thumbnail_url?: string;
  mode: string;
  alert_threshold: number;
  saved_at: string;
  last_checked?: string;
  last_notified?: string;
  is_active: boolean;
  product_query?: string;
}
