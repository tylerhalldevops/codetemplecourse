# 🏔️ Ski Resort 7-Day Forecast Widget

A compact, rotating widget that displays 7-day weather forecasts for major Colorado ski resorts.

## ✨ Features

- **9 Major Colorado Resorts:** Breckenridge, Vail, Keystone, Aspen, Copper Mountain, Winter Park, Steamboat, Telluride, Crested Butte
- **Auto-Rotating:** Cycles through resorts every 8 seconds
- **Compact Design:** Perfect for header placement (380px wide)
- **Key Information Only:** Temperature highs/lows, predicted snowfall
- **Real-Time Data:** Fetches from wttr.in weather API
- **Dark Mode Support:** Automatically adapts to your theme
- **Mobile Responsive:** Adjusts layout for smaller screens

## 🎯 What It Displays

For each day of the 7-day forecast:
- **Day of Week** (Mon, Tue, Wed, etc.)
- **Temperature Range** (High°/Low° in Fahrenheit)
- **Predicted Snowfall** (in inches, with ❄️ emoji)

## 📦 Installation

### Already Installed on SnowBytes!

The widget is already added to your homepage. It appears in the top-right corner of the header.

### To Add to Other Pages:

1. **Add HTML element** to your header:
```html
<div id="skiResortForecast"></div>
```

2. **Include the JavaScript** (already in your files):
```html
<script src="ski-forecast-widget.js" defer></script>
```

3. **CSS is included** in your main `styles.css`

## ⚙️ Configuration

Edit `ski-forecast-widget.js` to customize:

```javascript
const config = {
    resorts: [
        { name: 'Breckenridge', location: 'Breckenridge,Colorado', emoji: '🏔️' },
        // Add or remove resorts here
    ],
    rotationInterval: 8000,     // Time per resort (ms)
    updateInterval: 1800000     // Data refresh interval (30 min)
};
```

## 🎮 Manual Controls

Use JavaScript console commands:

```javascript
// Rotate to next resort immediately
window.skiResortForecast.rotate();

// Refresh all forecast data
window.skiResortForecast.refresh();

// Jump to specific resort (0-8)
window.skiResortForecast.goToResort(0); // Breckenridge
window.skiResortForecast.goToResort(1); // Vail
```

## 🎨 Styling

The widget uses your existing retro 90s aesthetic:
- **Blue glow** in light mode
- **Green glow** in dark mode
- **Courier New** monospace font
- **Grid layout** for 7-day display
- **Minimal padding** for compact size

### Custom Styling

Target these CSS classes:
- `#skiResortForecast` - Main container
- `.ski-forecast-header` - Header with resort name
- `.resort-name` - Resort name text
- `.forecast-label` - "7-DAY" label
- `.forecast-grid` - Grid container
- `.forecast-day` - Individual day column
- `.forecast-day-name` - Day abbreviation
- `.forecast-temps` - Temperature range
- `.forecast-snow` - Snowfall prediction

## 📊 Data Source

- **API:** [wttr.in](https://wttr.in) - Free weather API
- **Format:** JSON weather data
- **Update Frequency:** Every 30 minutes
- **Fallback:** Simulated data if API fails

## 🔧 Troubleshooting

### Widget not appearing?
- Check that `<div id="skiResortForecast"></div>` exists in HTML
- Verify `ski-forecast-widget.js` is loaded
- Open browser console for error messages

### Data not loading?
- Check internet connection
- Verify wttr.in API is accessible
- Widget will use simulated data if API fails

### Rotation not working?
- JavaScript should auto-initialize
- Check browser console for errors
- Manually call `window.skiResortForecast.rotate()` to test

## 📱 Mobile Behavior

On screens < 768px:
- Widget becomes full-width
- Moves below header (position: static)
- Slightly smaller text
- Maintains 7-column grid layout

## ⚡ Performance

- **Initial Load:** ~1-2 seconds (fetches all 9 resorts in parallel)
- **Memory:** Minimal (caches forecast data)
- **CPU:** Low (simple DOM updates every 8 seconds)
- **Network:** 9 API calls on load, then every 30 minutes

## 🎯 Perfect For

- Ski resort websites
- Snow sports blogs
- Colorado tourism sites
- Weather dashboard headers
- Winter sports apps

## 📝 License

Part of the SnowBytes project. Use and modify as needed!

## 🏂 Enjoy!

Now you can track powder conditions across all major Colorado resorts at a glance! 🎿❄️

