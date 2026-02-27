import { useState, useRef, useEffect, useCallback } from 'react'

const API_BASE = '' // Proxied via vite.config.js

/* ── SVG Icons ──────────────────────────────────────────────────── */

const BotIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
)

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
)

const StarIcon = ({ filled }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const ExternalLinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
)

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
)

const MinimizeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
)

const ShoppingBagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
)

const TruckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>
)

const StoreIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
    </svg>
)

/* ── Rating Stars ──────────────────────────────────────────────── */

function RatingStars({ rating }) {
    if (rating == null) return null
    const full = Math.floor(rating)
    const hasHalf = rating - full >= 0.3
    return (
        <span className="cb2-stars">
            {[...Array(5)].map((_, i) => (
                <span key={i} className={i < full ? 'cb2-stars__filled' : (i === full && hasHalf) ? 'cb2-stars__half' : 'cb2-stars__empty'}>
                    <StarIcon filled={i < full || (i === full && hasHalf)} />
                </span>
            ))}
            <span className="cb2-stars__num">{rating.toFixed(1)}</span>
        </span>
    )
}

/* ── Product Card — structured layout ──────────────────────────── */

function ProductCard({ product, index }) {
    return (
        <div className="cb2-product" style={{ animationDelay: `${index * 0.06}s` }}>
            {/* Thumbnail */}
            <div className="cb2-product__visual">
                {product.thumbnail ? (
                    <img className="cb2-product__img" src={product.thumbnail} alt={product.title} loading="lazy" />
                ) : (
                    <div className="cb2-product__img-placeholder"><ShoppingBagIcon /></div>
                )}
                {index < 3 && (
                    <span className={`cb2-product__rank cb2-product__rank--${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}`}>
                        #{index + 1}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="cb2-product__body">
                <h4 className="cb2-product__title">{product.title}</h4>

                <div className="cb2-product__details">
                    {product.price && <div className="cb2-product__price">{product.price}</div>}

                    {product.rating != null && (
                        <div className="cb2-product__rating-row">
                            <RatingStars rating={product.rating} />
                            {product.reviews != null && (
                                <span className="cb2-product__reviews">({product.reviews.toLocaleString('en-IN')})</span>
                            )}
                        </div>
                    )}

                    <div className="cb2-product__meta-row">
                        {product.source && (
                            <span className="cb2-product__source"><StoreIcon /> {product.source}</span>
                        )}
                        {product.delivery && (
                            <span className="cb2-product__delivery"><TruckIcon /> {product.delivery}</span>
                        )}
                    </div>
                </div>

                {product.link ? (
                    <a href={product.link} target="_blank" rel="noopener noreferrer" className="cb2-product__cta">
                        View Deal <ExternalLinkIcon />
                    </a>
                ) : (
                    <span className="cb2-product__cta cb2-product__cta--disabled">Not available online</span>
                )}
            </div>
        </div>
    )
}

/* ── Typing indicator ──────────────────────────────────────────── */

function TypingIndicator() {
    return (
        <div className="cb2-typing">
            <div className="cb2-typing__dot" />
            <div className="cb2-typing__dot" />
            <div className="cb2-typing__dot" />
        </div>
    )
}

/* ── Quick Suggestions ─────────────────────────────────────────── */

const QUICK_SUGGESTIONS = [
    'Best phone under ₹20,000',
    'Samsung Galaxy S24 price',
    'iPhone 15 vs Samsung S24',
    'Best laptop for students',
]

/* ── Main ChatbotAssistant Component ───────────────────────────── */

export default function ChatbotAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm your AI shopping assistant. Ask me about any product — I'll fetch live prices and deals from stores across India.",
            products: [],
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 150)
    }, [isOpen])

    const sendMessage = useCallback(async (text) => {
        const trimmed = (text || inputValue).trim()
        if (!trimmed || isLoading) return

        setError(null)
        const userMsg = { role: 'user', content: trimmed, products: [] }
        setMessages((prev) => [...prev, userMsg])
        setInputValue('')
        setIsLoading(true)

        try {
            const allMessages = [...messages, userMsg]
            const chatHistory = allMessages.slice(-6).map((m) => ({
                role: m.role,
                content: m.content,
            }))

            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, chat_history: chatHistory }),
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.detail || `Server error: ${response.status}`)
            }

            const data = await response.json()

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.message || "Sorry, I couldn't generate a response.",
                    products: data.products || [],
                    intent: data.intent || 'general',
                },
            ])
        } catch (err) {
            setError(err.message || 'Connection failed')
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.', products: [] },
            ])
        } finally {
            setIsLoading(false)
        }
    }, [inputValue, isLoading, messages])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    }

    const handleSuggestion = (text) => {
        setInputValue(text)
        sendMessage(text)
    }

    const showSuggestions = messages.length <= 1 && !isLoading

    return (
        <>
            {/* ── FAB ── */}
            {!isOpen && (
                <button className="cb2-fab" onClick={() => setIsOpen(true)} title="Shopping Assistant">
                    <BotIcon />
                    <span className="cb2-fab__pulse" />
                    <span className="cb2-fab__label">Ask AI</span>
                </button>
            )}

            {/* ── Chat Window ── */}
            {isOpen && (
                <div className="cb2-window">
                    {/* Header */}
                    <div className="cb2-header">
                        <div className="cb2-header__left">
                            <div className="cb2-header__avatar"><BotIcon /></div>
                            <div>
                                <div className="cb2-header__title">Shopping Assistant</div>
                                <div className="cb2-header__status">
                                    <span className="cb2-header__dot" /> Online — Google Shopping + AI
                                </div>
                            </div>
                        </div>
                        <div className="cb2-header__actions">
                            <button className="cb2-header__btn" onClick={() => setIsOpen(false)} title="Minimize">
                                <MinimizeIcon />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="cb2-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`cb2-msg cb2-msg--${msg.role}`}>
                                {msg.role === 'assistant' && (
                                    <div className="cb2-msg__avatar"><BotIcon /></div>
                                )}
                                <div className="cb2-msg__content">
                                    <div className={`cb2-msg__bubble cb2-msg__bubble--${msg.role}`}>
                                        {msg.content}
                                    </div>

                                    {msg.role === 'assistant' && msg.products?.length > 0 && (
                                        <div className="cb2-products">
                                            <div className="cb2-products__header">
                                                <ShoppingBagIcon />
                                                <span>{msg.products.length} products found</span>
                                            </div>
                                            <div className="cb2-products__grid">
                                                {msg.products.map((product, j) => (
                                                    <ProductCard key={j} product={product} index={j} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="cb2-msg cb2-msg--assistant">
                                <div className="cb2-msg__avatar"><BotIcon /></div>
                                <div className="cb2-msg__content">
                                    <div className="cb2-msg__bubble cb2-msg__bubble--assistant">
                                        <TypingIndicator />
                                        <span className="cb2-typing__text">Searching deals...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showSuggestions && (
                            <div className="cb2-suggestions">
                                <div className="cb2-suggestions__label">Try asking:</div>
                                <div className="cb2-suggestions__list">
                                    {QUICK_SUGGESTIONS.map((s, i) => (
                                        <button key={i} className="cb2-suggestions__chip" onClick={() => handleSuggestion(s)}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {error && (
                        <div className="cb2-error">
                            <span>⚠️ {error}</span>
                            <button onClick={() => setError(null)} className="cb2-error__close"><CloseIcon /></button>
                        </div>
                    )}

                    {/* Input */}
                    <div className="cb2-input-bar">
                        <input
                            ref={inputRef}
                            className="cb2-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search any product or ask a question..."
                            disabled={isLoading}
                            maxLength={500}
                        />
                        <button
                            className="cb2-send"
                            onClick={() => sendMessage()}
                            disabled={isLoading || !inputValue.trim()}
                            title="Send"
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
