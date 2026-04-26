# Advanced Search Loader Feature

## Overview

The DealMind search loader provides real-time visual feedback to users while fetching product data from multiple marketplaces. It displays:

1. **Timer** - Seconds elapsed since search started
2. **Progress Circle** - Visual progress indicator (0-100%)
3. **Live Marketplace Status** - Which websites are being fetched from
4. **Progress Bar** - Horizontal progress indicator with gradient
5. **Status Indicators** - Per-marketplace status (pending, loading, complete)

## Components

### 1. SearchLoader (Full-Screen Loader)

**File:** `components/search-loader.tsx`

Used as the Suspense fallback on the search results page. Shows a full-screen loading experience with:

- Large circular progress indicator with countdown timer
- All 8 marketplace sources with individual status indicators
- Progress bar showing completion percentage
- Real-time message showing which marketplace is currently being fetched
- Animated loading dots at the bottom

**Marketplace Sources:**
- Amazon India (amazon.in)
- Flipkart (flipkart.com)
- Meesho (meesho.com)
- Vijay Sales (vijaysales.com)
- Croma (croma.com)
- eBay India (ebay.in)
- JioMart (jiomart.com)
- Big Basket (bigbasket.com)

**Integration:**
```typescript
// In app/search/page.tsx
<Suspense fallback={<SearchLoader />}>
  <SearchContent />
</Suspense>
```

### 2. SearchProgressBar (Floating Widget)

**File:** `components/search-progress-bar.tsx`

A compact floating loader that appears in the bottom-left corner, useful for:

- Long-running searches where users might scroll
- Mobile experiences where full-screen loaders might be intrusive
- Showing search progress without blocking content

**Features:**
- Fixed position (bottom-left on desktop, full width on mobile)
- Auto-hides when complete
- Compact 4-source display
- Timer showing elapsed seconds
- Progress bar with gradient fill

## How It Works

### Search Flow

1. User enters a search query and clicks "Search/Compare"
2. Router navigates to `/search?q=...`
3. SearchContent is lazy-loaded with Suspense
4. During load, SearchLoader displays with:
   - **Initial state:** All sources pending, 0 seconds
   - **During fetch:** Sources randomly transition from pending → loading → complete
   - **Completed:** All sources show green checkmark

### Simulated Fetch Timeline

Each marketplace "fetch" takes approximately:
- **800ms** - Interval between starting each fetch
- **500ms** - Each fetch loading duration
- **Total time:** ~5-6 seconds for all 8 sources

In a real implementation, these would be actual API calls instead of simulated delays.

## Styling Details

### Color Scheme
- **Pending sources:** Light gray background (#F1E9E9)
- **Loading sources:** Light pink background (#E491C9 with 10% opacity)
- **Complete sources:** Light purple background (#982598 with 5% opacity)

### Animations
- **Spinner:** Globe icon rotates with 1.5s duration
- **Progress circle:** Smooth stroke animation
- **Checkmark fade-in:** 300-500ms transitions
- **Pulsing indicator:** 1s animation loop

## Real-World Integration

To use with real API calls, modify the `useEffect` in `search-loader.tsx`:

```typescript
// Replace simulated fetch with real API
const fetchFromMarketplace = async (source: FetchSource) => {
  try {
    const response = await fetch(`/api/search?marketplace=${source.name}&q=${query}`)
    const data = await response.json()
    // Update UI with data
  } catch (error) {
    console.error(`Failed to fetch from ${source.name}`)
  }
}
```

## Performance Notes

- **Timer updates:** Every 1 second (efficient)
- **Source fetches:** Staggered to avoid simultaneous API calls
- **UI updates:** Minimal re-renders using React state management
- **Auto-hide:** SearchProgressBar automatically hides when complete

## Customization

### Adding More Marketplaces

Edit `MARKETPLACE_SOURCES` array in `search-loader.tsx`:

```typescript
const MARKETPLACE_SOURCES: FetchSource[] = [
  { name: "Your Marketplace", url: "example.com", status: "pending" },
  // ... more sources
]
```

### Adjusting Timings

In the `useEffect` with `fetchInterval`:
- Change `800` (interval) to adjust fetch start timing
- Change `500` (setTimeout) to adjust individual fetch duration

### Changing Colors

Update the Tailwind classes in status indicators:
- `border-purple` → Different border color
- `bg-purple/5` → Different background
- `text-pink` → Different spinner color

## Browser Compatibility

- Modern browsers with ES6+ support
- CSS animations and transitions (all modern browsers)
- SVG circle stroke animation (all modern browsers)
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)
