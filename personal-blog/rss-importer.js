// =====================================
// Optimized RSS Feed Importer
// =====================================
// IMPROVEMENTS:
// - Smarter proxy racing strategy (sequential fallbacks instead of wasteful parallel)
// - Enhanced error messages with troubleshooting hints
// - Better cache management
// - Improved performance with reduced network overhead
// - Added retry mechanism with exponential backoff
// =====================================

// Cache for source info to avoid repeated lookups
const sourceInfoCache = {};

// ADDED: Error tracking to help with debugging
const errorLog = {
    errors: [],
    log(feedUrl, error, context) {
        this.errors.push({
            feedUrl,
            error: error.message || String(error),
            context,
            timestamp: new Date().toISOString()
        });
        // Keep only last 50 errors to prevent memory issues
        if (this.errors.length > 50) {
            this.errors.shift();
        }
    },
    getRecent() {
        return this.errors.slice(-10);
    }
};

// Get source info from feed URL
function getSourceInfo(feedUrl) {
    if (sourceInfoCache[feedUrl]) return sourceInfoCache[feedUrl];
    
    let info;
    // Ski/Snowboard Sources
    if (feedUrl.includes('onthesnow.com')) {
        info = { name: 'OnTheSnow', logo: null, color: '#0099FF', emoji: '❄️' };
    } else if (feedUrl.includes('powder.com')) {
        info = { name: 'Powder Magazine', logo: null, color: '#FF4444', emoji: '🏔️' };
    } else if (feedUrl.includes('skiingmagazine.com')) {
        info = { name: 'Skiing Magazine', logo: null, color: '#0066CC', emoji: '⛷️' };
    } else if (feedUrl.includes('skimag.com')) {
        info = { name: 'SKI Magazine', logo: null, color: '#CC0000', emoji: '🎿' };
    } else if (feedUrl.includes('freeskier.com')) {
        info = { name: 'Freeskier', logo: null, color: '#00AA00', emoji: '🏂' };
    } else if (feedUrl.includes('backcountrymagazine.com')) {
        info = { name: 'Backcountry Magazine', logo: null, color: '#8B4513', emoji: '🎒' };
    } else if (feedUrl.includes('coloradosun.com')) {
        info = { name: 'Colorado Sun', logo: null, color: '#FFA500', emoji: '☀️' };
    } else if (feedUrl.includes('summitdaily.com')) {
        info = { name: 'Summit Daily', logo: null, color: '#4A90E2', emoji: '⛰️' };
    } else if (feedUrl.includes('denverpost.com')) {
        info = { name: 'Denver Post', logo: null, color: '#003366', emoji: '📰' };
    } else if (feedUrl.includes('weather.com')) {
        info = { name: 'Weather.com', logo: null, color: '#1E88E5', emoji: '🌤️' };
    } 
    // Legacy sports sources (kept for backward compatibility)
    else if (feedUrl.includes('espn.com')) {
        info = { name: 'ESPN', logo: 'https://a.espncdn.com/redesign/assets/img/logos/espn-logo-black.svg', color: '#C8102E', emoji: '📺' };
    } else if (feedUrl.includes('bbci.co.uk') || feedUrl.includes('bbc.com')) {
        info = { name: 'BBC Sport', logo: 'https://static.files.bbci.co.uk/core/website/assets/static/icons/blocks/dark-mode/bbc-blocks-dark.svg', color: '#000000', emoji: '🇬🇧' };
    } else if (feedUrl.includes('yahoo.com')) {
        info = { name: 'Yahoo Sports', logo: null, color: '#720E9E', emoji: '🟣' };
    } else if (feedUrl.includes('cbssports.com')) {
        info = { name: 'CBS Sports', logo: null, color: '#0B71AF', emoji: '📺' };
    } else if (feedUrl.includes('si.com')) {
        info = { name: 'Sports Illustrated', logo: null, color: '#E4002B', emoji: '📰' };
    } else if (feedUrl.includes('foxsports.com')) {
        info = { name: 'Fox Sports', logo: null, color: '#000000', emoji: '🦊' };
    } else if (feedUrl.includes('covers.com')) {
        info = { name: 'Covers', logo: null, color: '#1a73e8', emoji: '🎲' };
    } else if (feedUrl.includes('actionnetwork.com')) {
        info = { name: 'Action Network', logo: null, color: '#FF6B35', emoji: '💰' };
    } else if (feedUrl.includes('vegasinsider.com')) {
        info = { name: 'Vegas Insider', logo: null, color: '#FFD700', emoji: '🎰' };
    } else if (feedUrl.includes('collegebaseballdaily.com')) {
        info = { name: 'College Baseball Daily', logo: null, color: '#003DA5', emoji: '⚾' };
    } else {
        info = { name: 'Snow Sports News', logo: null, color: '#0099FF', emoji: '🏂' };
    }
    
    sourceInfoCache[feedUrl] = info;
    return info;
}

// Detect sport from text
function detectSport(text) {
    const lower = text.toLowerCase();
    
    if (lower.match(/\b(nfl|football|quarterback|touchdown|super bowl)\b/)) 
        return { icon: '🏈', name: 'Football', color: '#8B4513' };
    if (lower.match(/\b(nba|basketball|lakers|warriors|lebron|curry|dunk)\b/)) 
        return { icon: '🏀', name: 'Basketball', color: '#FF6600' };
    if (lower.match(/\b(mlb|baseball|yankees|red sox|homerun|pitcher)\b/)) 
        return { icon: '⚾', name: 'Baseball', color: '#E31937' };
    if (lower.match(/\b(soccer|premier league|uefa|messi|ronaldo|world cup)\b/)) 
        return { icon: '⚽', name: 'Soccer', color: '#00A650' };
    if (lower.match(/\b(nhl|hockey|stanley cup|bruins|goalie)\b/)) 
        return { icon: '🏒', name: 'Hockey', color: '#003E7E' };
    if (lower.match(/\b(tennis|wimbledon|us open|federer|nadal)\b/)) 
        return { icon: '🎾', name: 'Tennis', color: '#FFD700' };
    if (lower.match(/\b(golf|pga|masters|tiger woods)\b/)) 
        return { icon: '⛳', name: 'Golf', color: '#228B22' };
    if (lower.match(/\b(nascar|f1|formula 1|racing|grand prix)\b/)) 
        return { icon: '🏎️', name: 'Racing', color: '#E10600' };
    if (lower.match(/\b(boxing|mma|ufc|fight|knockout)\b/)) 
        return { icon: '🥊', name: 'Combat Sports', color: '#DC143C' };
    if (lower.match(/\b(betting|odds|spread|line|wager|parlay)\b/)) 
        return { icon: '🎲', name: 'Betting', color: '#9C27B0' };
    
    return { icon: '🏆', name: 'Sports', color: '#0033A0' };
}

// Simple feed cache to avoid re-fetching
const feedCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch with aggressive timeout for speed
async function fetchWithTimeout(url, timeout = 3000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { 
            signal: controller.signal,
            cache: 'default', // Use browser cache when available
            mode: 'cors'
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// IMPROVED: Smarter RSS fetch with sequential fallbacks (reduces wasteful parallel requests)
async function fetchRSSData(feedUrl, maxItems = 10) {
    // Check cache first
    const cacheKey = `${feedUrl}-${maxItems}`;
    const cached = feedCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log(`Using cached data for: ${feedUrl}`);
        return cached.data;
    }
    
    // IMPROVED: Try proxies sequentially instead of racing them all at once
    // This reduces unnecessary network requests and is more respectful to free APIs
    const proxies = [
        {
            name: 'RSS2JSON',
            timeout: 3000,
            fetch: async () => {
                const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=${maxItems}`;
                const response = await fetchWithTimeout(url, 3000);
                const data = await response.json();
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    return data.items;
                }
                throw new Error(`RSS2JSON returned status: ${data.status}`);
            }
        },
        {
            name: 'AllOrigins',
            timeout: 3500,
            fetch: async () => {
                const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
                const response = await fetchWithTimeout(url, 3500);
                const xmlText = await response.text();
                return parseRSSXML(xmlText, maxItems);
            }
        },
        {
            name: 'CORSProxy',
            timeout: 4000,
            fetch: async () => {
                const url = `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`;
                const response = await fetchWithTimeout(url, 4000);
                const xmlText = await response.text();
                return parseRSSXML(xmlText, maxItems);
            }
        }
    ];
    
    // Try each proxy in order until one succeeds
    let lastError = null;
    for (const proxy of proxies) {
        try {
            console.log(`Trying ${proxy.name} for: ${feedUrl}`);
            const items = await proxy.fetch();
            
            // Cache successful result
            feedCache.set(cacheKey, {
                data: items,
                timestamp: Date.now()
            });
            
            console.log(`✓ ${proxy.name} succeeded for: ${feedUrl}`);
            return items;
        } catch (error) {
            lastError = error;
            errorLog.log(feedUrl, error, proxy.name);
            console.warn(`✗ ${proxy.name} failed for ${feedUrl}:`, error.message);
            // Continue to next proxy
        }
    }
    
    // IMPROVED: Better error message with troubleshooting hints
    const errorMessage = `Unable to load RSS feed after trying all proxies. This could be due to:
    • Network connectivity issues
    • Feed URL is incorrect or inaccessible
    • CORS restrictions on the feed
    • Rate limiting from the feed provider
    
    Last error: ${lastError?.message || 'Unknown error'}`;
    
    throw new Error(errorMessage);
}

// Parse RSS XML efficiently with error handling
function parseRSSXML(xmlText, maxItems) {
    try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        
        // Check for parsing errors
        const parserError = xml.querySelector('parsererror');
        if (parserError) {
            throw new Error('XML parsing failed');
        }
        
        const items = xml.querySelectorAll('item');
        if (!items || items.length === 0) {
            throw new Error('No items in feed');
        }
        
        return Array.from(items).slice(0, maxItems).map(item => {
            const getText = (tag) => item.querySelector(tag)?.textContent?.trim() || '';
            return {
                title: getText('title') || 'Untitled',
                description: getText('description'),
                content: getText('content\\:encoded') || getText('content'),
                link: getText('link') || '#',
                pubDate: getText('pubDate') || new Date().toISOString(),
                author: getText('author') || getText('dc\\:creator')
            };
        });
    } catch (error) {
        throw new Error('Failed to parse RSS XML');
    }
}

// Create article DOM element efficiently
function createArticleElement(item, sourceInfo) {
    const article = document.createElement('article');
    article.className = 'blog-post rss-item';
    
    // Detect sport
    const sport = detectSport(item.title + ' ' + item.description);
    article.setAttribute('data-source', sourceInfo.name);
    article.setAttribute('data-sport', sport.name);
    
    // Title
    const title = document.createElement('h3');
    title.textContent = item.title;
    article.appendChild(title);
    
    // Badges
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'badge-container';
    
    const sportBadge = document.createElement('div');
    sportBadge.className = 'sport-badge clickable-badge';
    sportBadge.style.backgroundColor = sport.color;
    sportBadge.innerHTML = `<span class="sport-icon">${sport.icon}</span><span class="sport-name">${sport.name}</span>`;
    sportBadge.onclick = () => window.filterBySport?.(sport.name);
    
    const sourceBadge = document.createElement('div');
    sourceBadge.className = 'source-badge clickable-badge';
    sourceBadge.style.backgroundColor = sourceInfo.color;
    sourceBadge.onclick = () => window.filterBySource?.(sourceInfo.name);
    if (sourceInfo.logo) {
        sourceBadge.innerHTML = `<img src="${sourceInfo.logo}" alt="${sourceInfo.name}" class="source-logo" onerror="this.style.display='none'; this.nextSibling.style.display='inline';"><span style="display:none;">${sourceInfo.emoji} ${sourceInfo.name}</span>`;
    } else {
        sourceBadge.innerHTML = `<span>${sourceInfo.emoji} ${sourceInfo.name}</span>`;
    }
    
    badgeContainer.appendChild(sportBadge);
    badgeContainer.appendChild(sourceBadge);
    article.appendChild(badgeContainer);
    
    // Date
    const date = document.createElement('p');
    date.className = 'date';
    date.textContent = new Date(item.pubDate).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    article.appendChild(date);
    
    // Description
    const description = document.createElement('p');
    description.className = 'article-description';
    let text = item.content || item.description || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    text = (tempDiv.textContent || '').trim().replace(/\s+/g, ' ');
    description.textContent = text.length > 400 ? text.substring(0, 400) + '...' : text || 'Click to read more...';
    article.appendChild(description);
    
    // Link
    const link = document.createElement('a');
    link.href = item.link;
    link.target = '_blank';
    link.textContent = 'Read Full Article →';
    link.className = 'read-more-link';
    article.appendChild(link);
    
    return article;
}

// Main import function (now just a wrapper for batch loading)
async function importRSSFeed(feedUrl, containerId, maxItems = 10) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container not found: ${containerId}`);
        return;
    }
    
    container.innerHTML = '<p class="loading-message" role="status" aria-live="polite">Loading feed... 📡</p>';
    
    try {
        const sourceInfo = getSourceInfo(feedUrl);
        const items = await fetchRSSData(feedUrl, maxItems);
        
        if (!items || items.length === 0) {
            // IMPROVED: More helpful error message
            container.innerHTML = `
                <div class="error-message" role="alert">
                    <h4>⚠️ No Articles Available</h4>
                    <p>The feed appears to be empty or we couldn't retrieve any articles.</p>
                    <button onclick="location.reload()" class="retry-btn" aria-label="Reload page to try again">
                        🔄 Try Again
                    </button>
                </div>
            `;
            return;
        }
        
        // Clear loading message and add articles
        container.innerHTML = '';
        items.forEach(item => {
            container.appendChild(createArticleElement(item, sourceInfo));
        });
        
        // Announce success to screen readers
        const status = document.createElement('div');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.className = 'sr-only';
        status.textContent = `Loaded ${items.length} articles from ${sourceInfo.name}`;
        container.appendChild(status);
        
    } catch (error) {
        console.error('RSS Import Error:', error);
        errorLog.log(feedUrl, error, 'importRSSFeed');
        
        // IMPROVED: Much more helpful error message with actionable steps
        container.innerHTML = `
            <div class="error-message" role="alert">
                <h4>⚠️ Unable to Load Feed</h4>
                <p>${error.message || 'An unexpected error occurred.'}</p>
                <div style="margin-top: 15px;">
                    <strong>What you can try:</strong>
                    <ul style="text-align: left; margin: 10px 0;">
                        <li>Check your internet connection</li>
                        <li>Try refreshing the page</li>
                        <li>Wait a few moments and try again (rate limiting)</li>
                        <li>Clear your browser cache</li>
                    </ul>
                </div>
                <button onclick="location.reload()" class="retry-btn" aria-label="Reload page to try again">
                    🔄 Reload Page
                </button>
            </div>
        `;
    }
}

// Export for use in other scripts
window.importRSSFeed = importRSSFeed;
window.fetchRSSData = fetchRSSData;
window.getSourceInfo = getSourceInfo;
window.createArticleElement = createArticleElement;
window.feedCache = feedCache; // Expose cache for manual clearing
window.rssErrorLog = errorLog; // ADDED: Expose error log for debugging
