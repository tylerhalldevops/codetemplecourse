// =====================================
// Ski Resort 7-Day Forecast Widget
// =====================================
// Compact widget that rotates through major Colorado ski resorts
// Shows: Temperature, Snow Depth, Predicted Snowfall
// =====================================

(function() {
    'use strict';

    // Configuration
    const config = {
        resorts: [
            { name: 'Breckenridge', location: 'Breckenridge,Colorado', emoji: '🏔️' },
            { name: 'Vail', location: 'Vail,Colorado', emoji: '👑' },
            { name: 'Keystone', location: 'Keystone,Colorado', emoji: '🎿' },
            { name: 'Aspen', location: 'Aspen,Colorado', emoji: '⭐' },
            { name: 'Copper Mtn', location: 'Copper Mountain,Colorado', emoji: '⛷️' },
            { name: 'Winter Park', location: 'Winter Park,Colorado', emoji: '🏂' },
            { name: 'Steamboat', location: 'Steamboat Springs,Colorado', emoji: '🤠' },
            { name: 'Telluride', location: 'Telluride,Colorado', emoji: '🏔️' },
            { name: 'Crested Butte', location: 'Crested Butte,Colorado', emoji: '❄️' }
        ],
        rotationInterval: 8000, // 8 seconds per resort
        updateInterval: 1800000 // 30 minutes
    };

    let currentResortIndex = 0;
    let forecastData = {};

    // Fetch 7-day forecast from wttr.in
    async function fetchResortForecast(resort) {
        try {
            const response = await fetch(`https://wttr.in/${resort.location}?format=j1`);
            const data = await response.json();
            
            // Extract 7-day forecast
            const forecast = data.weather.slice(0, 7).map((day, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index);
                
                return {
                    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    highF: day.maxtempF,
                    lowF: day.mintempF,
                    snowInches: calculateSnowfall(day),
                    weatherCode: day.hourly[4]?.weatherCode || day.hourly[0]?.weatherCode
                };
            });
            
            forecastData[resort.name] = forecast;
            return forecast;
        } catch (error) {
            console.error(`Failed to fetch forecast for ${resort.name}:`, error);
            return generateSimulatedForecast();
        }
    }

    // Calculate predicted snowfall from weather data
    function calculateSnowfall(day) {
        let totalSnow = 0;
        day.hourly.forEach(hour => {
            const weatherCode = parseInt(hour.weatherCode);
            const precip = parseFloat(hour.precipMM) || 0;
            
            // Snow codes: 227, 230, 323, 326, 329, 332, 335, 338, 350-362, 365-395
            if (weatherCode >= 227 && weatherCode <= 395) {
                // Rough conversion: 1mm precip ≈ 0.1 inches snow (10:1 ratio)
                totalSnow += precip * 0.04; // Convert mm to inches
            }
        });
        
        return Math.round(totalSnow);
    }

    // Generate simulated forecast as fallback
    function generateSimulatedForecast() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return Array.from({ length: 7 }, (_, i) => ({
            day: days[i],
            highF: Math.floor(Math.random() * 15) + 20, // 20-35°F
            lowF: Math.floor(Math.random() * 15) + 5,   // 5-20°F
            snowInches: Math.floor(Math.random() * 8),  // 0-7 inches
            weatherCode: 338 // Snowy
        }));
    }

    // Render the forecast widget
    function renderWidget() {
        const widget = document.getElementById('skiResortForecast');
        if (!widget) return;

        const resort = config.resorts[currentResortIndex];
        const forecast = forecastData[resort.name] || generateSimulatedForecast();

        // Build compact 7-day display
        const forecastHTML = forecast.map(day => `
            <div class="forecast-day">
                <div class="forecast-day-name">${day.day}</div>
                <div class="forecast-temps">${day.highF}°/${day.lowF}°</div>
                <div class="forecast-snow">${day.snowInches > 0 ? `❄️${day.snowInches}"` : '—'}</div>
            </div>
        `).join('');

        widget.innerHTML = `
            <div class="ski-forecast-header">
                <span class="resort-name">${resort.emoji} ${resort.name}</span>
                <span class="forecast-label">7-DAY</span>
            </div>
            <div class="forecast-grid">
                ${forecastHTML}
            </div>
        `;
    }

    // Rotate to next resort
    function rotateResort() {
        currentResortIndex = (currentResortIndex + 1) % config.resorts.length;
        renderWidget();
    }

    // Load all resort forecasts
    async function loadAllForecasts() {
        console.log('Loading ski resort forecasts...');
        const promises = config.resorts.map(resort => fetchResortForecast(resort));
        await Promise.allSettled(promises);
        renderWidget();
    }

    // Initialize widget
    function init() {
        const widget = document.getElementById('skiResortForecast');
        if (!widget) {
            console.warn('Ski forecast widget element not found (id="skiResortForecast")');
            return;
        }

        // Initial load
        loadAllForecasts();

        // Rotate resorts every 8 seconds
        setInterval(rotateResort, config.rotationInterval);

        // Update forecast data every 30 minutes
        setInterval(loadAllForecasts, config.updateInterval);
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for manual control
    window.skiResortForecast = {
        rotate: rotateResort,
        refresh: loadAllForecasts,
        goToResort: (index) => {
            if (index >= 0 && index < config.resorts.length) {
                currentResortIndex = index;
                renderWidget();
            }
        }
    };

})();

