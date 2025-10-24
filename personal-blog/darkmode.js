// =====================================
// Dark Mode, Theme & Data Manager - OPTIMIZED
// =====================================
// IMPROVEMENTS:
// - Consolidated all intervals into single manager
// - Reduced unnecessary DOM queries with caching
// - Better error handling and fallbacks
// - Improved performance with debouncing
// - Modular architecture for better maintainability
// =====================================

(function() {
    'use strict';

    // ===== DOM CACHE (query once, reuse many times) =====
    const DOM = {
        body: document.body,
        darkModeToggle: document.getElementById('darkModeToggle'),
        nightVisionToggle: document.getElementById('nightVisionToggle'),
        videoToggle: document.getElementById('videoToggle'),
        videoContainer: document.getElementById('videoContainer'),
        retroClock: document.getElementById('retroClock'),
        retroDate: document.getElementById('retroDate'),
        onlineCount: document.getElementById('onlineCount'),
        weatherInfo: document.getElementById('weatherInfo'),
        trafficInfo: document.getElementById('trafficInfo'),
        hwy24Content: document.getElementById('hwy24Content'),
        i70Content: document.getElementById('i70Content'),
        hitCounterDisplay: document.getElementById('hitCounterDisplay')
    };

    // ===== CONFIGURATION =====
    const config = {
        coloradoCities: [
            'Denver', 'Boulder', 'Colorado Springs', 'Fort Collins',
            'Aspen', 'Vail', 'Breckenridge', 'Steamboat Springs',
            'Pueblo', 'Grand Junction', 'Durango', 'Telluride'
        ],
        skiResorts: [
            { name: 'Breckenridge', widgetId: 'breckWidget', baseDepth: 45, liftsTotal: 34 },
            { name: 'Keystone', widgetId: 'keystoneWidget', baseDepth: 38, liftsTotal: 20 },
            { name: 'Vail', widgetId: 'vailWidget', baseDepth: 50, liftsTotal: 31 },
            { name: 'Monarch Mountain', widgetId: 'monarchWidget', baseDepth: 55, liftsTotal: 5 },
            { name: 'Aspen', widgetId: 'aspenWidget', baseDepth: 48, liftsTotal: 41 },
            { name: 'Copper Mountain', widgetId: 'copperWidget', baseDepth: 42, liftsTotal: 23 },
            { name: 'Crested Butte', widgetId: 'crestedWidget', baseDepth: 52, liftsTotal: 15 },
            { name: 'Beaver Creek', widgetId: 'beaverWidget', baseDepth: 46, liftsTotal: 25 }
        ],
        intervals: {
            clock: 1000,          // 1 second
            weather: 300000,      // 5 minutes
            traffic: 180000,      // 3 minutes
            skiConditions: 900000 // 15 minutes
        }
    };

    // ===== DARK MODE TOGGLE =====
    const ThemeManager = {
        init() {
            if (!DOM.darkModeToggle || !DOM.nightVisionToggle) return;
            
            // Load saved preferences
            this.loadDarkMode();
            this.loadNightVision();
            
            // Setup event listeners
            DOM.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
            DOM.nightVisionToggle.addEventListener('click', () => this.toggleNightVision());
        },
        
        loadDarkMode() {
            const isEnabled = localStorage.getItem('darkMode') === 'enabled';
            if (isEnabled) {
                DOM.body.classList.add('dark-mode');
                DOM.darkModeToggle.textContent = '☀️';
                // IMPROVED: Set aria-pressed for accessibility
                DOM.darkModeToggle.setAttribute('aria-pressed', 'true');
            }
        },
        
        loadNightVision() {
            const isEnabled = localStorage.getItem('nightVision') === 'enabled';
            if (isEnabled) {
                DOM.body.classList.add('night-vision-mode');
                DOM.nightVisionToggle.textContent = '🟢';
                // IMPROVED: Set aria-pressed for accessibility
                DOM.nightVisionToggle.setAttribute('aria-pressed', 'true');
            }
        },
        
        toggleDarkMode() {
            const isEnabled = DOM.body.classList.toggle('dark-mode');
            DOM.darkModeToggle.textContent = isEnabled ? '☀️' : '🌙';
            // IMPROVED: Update aria-pressed state for screen readers
            DOM.darkModeToggle.setAttribute('aria-pressed', String(isEnabled));
            localStorage.setItem('darkMode', isEnabled ? 'enabled' : 'disabled');
        },
        
        toggleNightVision() {
            const isEnabled = DOM.body.classList.toggle('night-vision-mode');
            DOM.nightVisionToggle.textContent = isEnabled ? '🟢' : '🔴';
            // IMPROVED: Update aria-pressed state for screen readers
            DOM.nightVisionToggle.setAttribute('aria-pressed', String(isEnabled));
            localStorage.setItem('nightVision', isEnabled ? 'enabled' : 'disabled');
        }
    };

    // ===== VIDEO TOGGLE =====
    const VideoManager = {
        init() {
            if (!DOM.videoToggle || !DOM.videoContainer) return;
            
            DOM.videoToggle.addEventListener('click', () => this.toggle());
        },
        
        toggle() {
            const isExpanded = DOM.videoContainer.classList.toggle('show');
            DOM.videoToggle.textContent = isExpanded ? '📺 HIDE VIDEO' : '📺 CLICK TO WATCH FEATURED VIDEO';
            DOM.videoToggle.setAttribute('aria-expanded', String(isExpanded));
        }
    };

    // ===== CLOCK MANAGER =====
    const ClockManager = {
        update() {
            if (!DOM.retroClock) return;
            
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            
            // Convert to 12-hour format
            hours = hours % 12 || 12;
            const hoursStr = String(hours).padStart(2, '0');
            
            // Get date components
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                           'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const month = months[now.getMonth()];
            const day = String(now.getDate()).padStart(2, '0');
            const year = now.getFullYear();
            
            // Combined time and date in one display
            DOM.retroClock.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm} | ${month} ${day}, ${year}`;
        }
    };

    // ===== ONLINE USERS COUNTER =====
    const OnlineUsersManager = {
        nextUpdateTime: 0,
        
        update() {
            if (!DOM.onlineCount) return;
            
            const now = Date.now();
            if (now < this.nextUpdateTime) return; // Not time yet
            
            // Generate random count and schedule next update
            const randomCount = Math.floor(Math.random() * (156 - 23 + 1)) + 23;
            DOM.onlineCount.textContent = randomCount;
            
            // Schedule next update (3-8 seconds from now)
            this.nextUpdateTime = now + Math.floor(Math.random() * 5000) + 3000;
        }
    };

    // ===== HIT COUNTER MANAGER (ULTRA RETRO 90s STYLE) =====
    const HitCounterManager = {
        currentCount: 367,
        nextUpdateTime: 0,
        storageKey: 'snowbytes_hit_counter',
        
        init() {
            // Load count from localStorage (persist across sessions)
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.currentCount = parseInt(stored, 10);
            }
            this.updateDisplay();
            
            // Schedule first increment (30-90 seconds from now)
            this.nextUpdateTime = Date.now() + Math.floor(Math.random() * 60000) + 30000;
        },
        
        increment() {
            if (!DOM.hitCounterDisplay) return;
            
            const now = Date.now();
            if (now < this.nextUpdateTime) return; // Not time yet
            
            // Increment counter (1-3 visitors at a time for realism)
            this.currentCount += Math.floor(Math.random() * 3) + 1;
            
            // Save to localStorage
            localStorage.setItem(this.storageKey, this.currentCount.toString());
            
            // Update display with animation
            this.updateDisplay();
            
            // Schedule next increment (30-90 seconds from now)
            this.nextUpdateTime = now + Math.floor(Math.random() * 60000) + 30000;
        },
        
        updateDisplay() {
            if (!DOM.hitCounterDisplay) return;
            
            // Pad to 6 digits (classic 90s hit counter style)
            const countStr = this.currentCount.toString().padStart(6, '0');
            const digits = DOM.hitCounterDisplay.querySelectorAll('.counter-digit');
            
            // Update each digit with animation
            digits.forEach((digit, index) => {
                const newValue = countStr[index];
                if (digit.textContent !== newValue) {
                    // Add flash effect when digit changes
                    digit.style.animation = 'none';
                    setTimeout(() => {
                        digit.textContent = newValue;
                        digit.setAttribute('data-digit', newValue);
                        digit.style.animation = '';
                    }, 10);
                }
            });
        }
    };

    // ===== WEATHER MANAGER =====
    const WeatherManager = {
        async loadCityWeather(city) {
            try {
                const response = await fetch(`https://wttr.in/${city},Colorado?format=j1`);
                const data = await response.json();
                const current = data.current_condition[0];
                
                return {
                    city,
                    emoji: this.getWeatherEmoji(parseInt(current.weatherCode)),
                    temp: current.temp_F,
                    condition: current.weatherDesc[0].value
                };
            } catch (error) {
                console.error(`Failed to load weather for ${city}`);
                return { city, emoji: '🌤️', temp: '--', condition: 'N/A' };
            }
        },
        
        getWeatherEmoji(weatherCode) {
            if (weatherCode >= 600 && weatherCode < 700) return '❄️';
            if (weatherCode >= 500 && weatherCode < 600) return '🌧️';
            if (weatherCode === 800) return '☀️';
            if (weatherCode > 800) return '☁️';
            return '🌤️';
        },
        
        async update() {
            if (!DOM.weatherInfo) return;
            
            try {
                DOM.weatherInfo.innerHTML = '<span class="weather-loading">Loading weather for Colorado cities...</span>';
                
                // Load all cities in parallel for speed
                const weatherData = await Promise.all(
                    config.coloradoCities.map(city => this.loadCityWeather(city))
                );
                
                // Build scrolling content
                const scrollContent = weatherData.map(data => `
                    <span class="weather-city-block">
                        <span class="weather-location">${data.emoji} ${data.city}</span>
                        <span class="weather-temp">${data.temp}°F</span>
                        <span class="weather-condition-short">${data.condition}</span>
                    </span>
                `).join('<span class="weather-separator">•</span>');
                
                // Duplicate for seamless scrolling
                DOM.weatherInfo.innerHTML = scrollContent + scrollContent;
            } catch (error) {
                console.error('Weather update failed:', error);
                DOM.weatherInfo.innerHTML = '<span class="weather-loading">Weather data unavailable</span>';
            }
        }
    };

    // ===== SKI CONDITIONS MANAGER =====
    // IMPROVED: Broke down large function into smaller, testable pieces
    const SkiManager = {
        /**
         * Fetch weather data for a resort
         * @param {Object} resort - Resort configuration object
         * @returns {Promise<Object>} Weather data
         */
        async fetchResortWeather(resort) {
            const response = await fetch(`https://wttr.in/${resort.name},Colorado?format=j1`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        },

        /**
         * Calculate resort statistics with some randomization
         * @param {Object} resort - Resort configuration
         * @returns {Object} Calculated stats
         */
        calculateStats(resort) {
            return {
                snowDepth: resort.baseDepth + Math.floor(Math.random() * 15),
                liftsOpenCount: Math.max(
                    Math.floor(resort.liftsTotal * 0.85) + Math.floor(Math.random() * 3),
                    resort.liftsTotal - 2
                ),
                terrainOpen: `${Math.floor(Math.random() * 10) + 85}%`
            };
        },

        /**
         * Generate HTML for resort stats display
         * @param {Object} weatherData - Weather data from API
         * @param {Object} resort - Resort configuration
         * @returns {string} HTML string
         */
        generateStatsHTML(weatherData, resort) {
            const current = weatherData.current_condition[0];
            const tempF = current.temp_F;
            const feelsLikeF = current.FeelsLikeF;
            const condition = current.weatherDesc[0].value;
            const windMph = current.windspeedMiles;
            const weatherEmoji = WeatherManager.getWeatherEmoji(parseInt(current.weatherCode));
            const stats = this.calculateStats(resort);
            
            return `
                <div class="ski-stat">
                    <span class="ski-stat-label">${weatherEmoji} Conditions</span>
                    <span class="ski-stat-value">${condition}</span>
                </div>
                <div class="ski-stat">
                    <span class="ski-stat-label">🌡️ Temperature</span>
                    <span class="ski-stat-value highlight">${tempF}°F</span>
                </div>
                <div class="ski-stat">
                    <span class="ski-stat-label">🥶 Feels Like</span>
                    <span class="ski-stat-value">${feelsLikeF}°F</span>
                </div>
                <div class="ski-stat">
                    <span class="ski-stat-label">❄️ Snow Depth</span>
                    <span class="ski-stat-value highlight">${stats.snowDepth}"</span>
                </div>
                <div class="ski-stat">
                    <span class="ski-stat-label">🎿 Lifts Open</span>
                    <span class="ski-stat-value">${stats.liftsOpenCount}/${resort.liftsTotal}</span>
                </div>
                <div class="ski-stat">
                    <span class="ski-stat-label">⛷️ Terrain Open</span>
                    <span class="ski-stat-value">${stats.terrainOpen}</span>
                </div>
                <div class="ski-stat">
                    <span class="ski-stat-label">💨 Wind</span>
                    <span class="ski-stat-value">${windMph} mph</span>
                </div>
            `;
        },

        /**
         * Generate error display HTML
         * @returns {string} HTML string
         */
        generateErrorHTML() {
            return `
                <div class="ski-stat">
                    <span class="ski-stat-label">⚠️ Status</span>
                    <span class="ski-stat-value">Data unavailable</span>
                </div>
                <div style="text-align: center; padding: 20px; color: #666;">
                    Unable to load current conditions. Please visit the resort website for live updates.
                </div>
            `;
        },

        /**
         * Update a single resort's display
         * @param {Object} resort - Resort configuration object
         */
        async updateResort(resort) {
            const widget = document.getElementById(resort.widgetId);
            if (!widget) {
                console.warn(`Widget not found for resort: ${resort.name}`);
                return;
            }
            
            try {
                const data = await this.fetchResortWeather(resort);
                widget.innerHTML = this.generateStatsHTML(data, resort);
            } catch (error) {
                console.error(`Failed to load ski conditions for ${resort.name}:`, error);
                widget.innerHTML = this.generateErrorHTML();
            }
        },
        
        /**
         * Update all resorts in parallel
         */
        async updateAll() {
            // IMPROVED: Better error logging with Promise.allSettled
            const results = await Promise.allSettled(
                config.skiResorts.map(resort => this.updateResort(resort))
            );
            
            // Log any failures for debugging
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Resort update failed for ${config.skiResorts[index].name}:`, result.reason);
                }
            });
        }
    };

    // ===== TRAFFIC MANAGER =====
    const TrafficManager = {
        lastUpdate: Date.now(),
        
        generateTrafficAlerts() {
            // Dynamic traffic conditions that change over time
            const hour = new Date().getHours();
            const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
            const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
            
            // Base alerts with dynamic conditions
            const alerts = [
                {
                    road: 'I-70 EB',
                    location: 'Mile 259 (Georgetown)',
                    type: isRushHour ? 'Heavy Traffic' : 'Moderate Traffic',
                    severity: isRushHour ? 'high' : 'medium',
                    icon: isRushHour ? '🚗' : '🚙'
                },
                {
                    road: 'I-25 NB',
                    location: 'Downtown Denver',
                    type: isRushHour && !isWeekend ? 'Heavy Delays' : 'Light Traffic',
                    severity: isRushHour && !isWeekend ? 'high' : 'low',
                    icon: '🚙'
                },
                {
                    road: 'US-6 WB',
                    location: 'Golden',
                    type: Math.random() > 0.7 ? 'Moderate Traffic' : 'Clear',
                    severity: 'low',
                    icon: Math.random() > 0.7 ? '🚘' : '✅'
                },
                {
                    road: 'I-70 WB',
                    location: 'Eisenhower Tunnel',
                    type: isWeekend ? 'Heavy Traffic (Ski Traffic)' : 'Moderate Traffic',
                    severity: isWeekend ? 'high' : 'medium',
                    icon: isWeekend ? '⚠️' : '🚗'
                },
                {
                    road: 'C-470',
                    location: 'Morrison Rd',
                    type: 'Clear',
                    severity: 'low',
                    icon: '✅'
                },
                {
                    road: 'I-76 EB',
                    location: 'Commerce City',
                    type: Math.random() > 0.5 ? 'Light Traffic' : 'Clear',
                    severity: 'low',
                    icon: '🚘'
                }
            ];
            
            // Shuffle for variety
            return alerts.sort(() => Math.random() - 0.5);
        },
        
        async updateTicker() {
            if (!DOM.trafficInfo) return;
            
            try {
                const alerts = this.generateTrafficAlerts();
                const content = alerts.map(alert => `
                    <span class="traffic-alert traffic-severity-${alert.severity}">
                        ${alert.icon} <strong>${alert.road}</strong>: ${alert.type} @ ${alert.location}
                    </span>
                    <span class="traffic-separator">●</span>
                `).join('');
                
                // Duplicate for seamless scroll
                DOM.trafficInfo.innerHTML = content + content;
            } catch (error) {
                console.error('Traffic ticker update failed:', error);
                DOM.trafficInfo.innerHTML = '<span class="traffic-loading">Traffic data unavailable</span>';
            }
        },
        
        getTimestamp() {
            // Generate realistic recent timestamps
            const now = Date.now();
            const minutesAgo = Math.floor(Math.random() * 20) + 1; // 1-20 minutes ago
            const updateTime = new Date(now - minutesAgo * 60000);
            return `Updated ${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
        },
        
        async updateI70() {
            if (!DOM.i70Content) return;
            
            try {
                const hour = new Date().getHours();
                const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
                const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
                const isWinterSeason = true; // In a real app, check actual date
                
                const incidents = [];
                
                // Dynamic traffic conditions based on time
                if (isWeekend || isRushHour) {
                    incidents.push({
                        title: isWeekend ? 'Heavy Ski Traffic - Eisenhower Tunnel' : 'Heavy Traffic - Eisenhower Tunnel',
                        description: `${isWeekend ? 'Weekend ski traffic' : 'Eastbound traffic'} backing up from tunnel entrance. Expect ${isWeekend ? '30-45' : '15-20'} minute delays.`,
                        time: this.getTimestamp(),
                        severity: 'high'
                    });
                } else {
                    incidents.push({
                        title: 'Moderate Traffic - Eisenhower Tunnel',
                        description: 'Traffic flowing steadily through tunnel. Minor delays possible.',
                        time: this.getTimestamp(),
                        severity: 'medium'
                    });
                }
                
                // Chain law based on season/conditions
                if (isWinterSeason && Math.random() > 0.3) {
                    incidents.push({
                        title: 'Chain Law in Effect',
                        description: 'Traction/chain law now in effect from MM 205 to MM 259. All vehicles must have chains or winter tires.',
                        time: 'Active',
                        severity: 'high'
                    });
                }
                
                // Georgetown area - usually clear
                incidents.push({
                    title: Math.random() > 0.8 ? 'Moderate Traffic - Georgetown' : 'Clear Conditions - Georgetown',
                    description: Math.random() > 0.8 ? 'Some congestion through Georgetown. Allow extra time.' : 'Traffic flowing normally through Georgetown area. No delays reported.',
                    time: this.getTimestamp(),
                    severity: Math.random() > 0.8 ? 'medium' : 'low'
                });
                
                // Idaho Springs conditions
                if (isRushHour || Math.random() > 0.6) {
                    incidents.push({
                        title: isRushHour ? 'Heavy Traffic - Idaho Springs' : 'Slow Traffic - Idaho Springs',
                        description: 'Moderate congestion through Idaho Springs. Allow extra travel time.',
                        time: this.getTimestamp(),
                        severity: isRushHour ? 'high' : 'medium'
                    });
                }
                
                // Add construction or incidents occasionally
                if (Math.random() > 0.7) {
                    const constructionTypes = [
                        { title: 'Road Work - MM 240', description: 'Single lane closure for maintenance. Use caution.' },
                        { title: 'Accident Cleared - MM 245', description: 'Earlier accident has been cleared. Traffic returning to normal.' },
                        { title: 'Disabled Vehicle - MM 265', description: 'Vehicle on shoulder. Right lane may be slow.' }
                    ];
                    const construction = constructionTypes[Math.floor(Math.random() * constructionTypes.length)];
                    incidents.push({
                        ...construction,
                        time: this.getTimestamp(),
                        severity: 'medium'
                    });
                }
                
                this.lastUpdate = Date.now();
                
                DOM.i70Content.innerHTML = incidents.map(incident => `
                    <div class="traffic-item">
                        <div class="traffic-item-header">${incident.title}</div>
                        <div class="traffic-item-description">${incident.description}</div>
                        <div class="traffic-item-time">⏱️ ${incident.time}</div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('I-70 traffic update failed:', error);
                DOM.i70Content.innerHTML = '<div style="padding: 20px; text-align: center; color: #CC0000;">⚠️ Unable to load I-70 traffic data</div>';
            }
        },
        
        async updateHwy24() {
            if (!DOM.hwy24Content) return;
            
            try {
                const hour = new Date().getHours();
                const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18);
                const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
                const isWinterSeason = true;
                
                const incidents = [];
                
                // Colorado Springs conditions
                if (isRushHour && !isWeekend) {
                    incidents.push({
                        title: 'Moderate Traffic - Colorado Springs',
                        description: 'Rush hour congestion through downtown Colorado Springs. Expect minor delays.',
                        time: this.getTimestamp(),
                        severity: 'medium'
                    });
                } else {
                    incidents.push({
                        title: 'Clear Conditions - Colorado Springs',
                        description: 'Traffic flowing normally through downtown Colorado Springs. No delays reported.',
                        time: this.getTimestamp(),
                        severity: 'low'
                    });
                }
                
                // Manitou Springs area
                if (isWeekend || Math.random() > 0.6) {
                    incidents.push({
                        title: isWeekend ? 'Moderate Traffic - Manitou Springs' : 'Light Traffic - Manitou Springs',
                        description: isWeekend ? 'Tourist traffic near Manitou Springs. Allow extra time.' : 'Light congestion near Manitou Springs area. Travel times normal.',
                        time: this.getTimestamp(),
                        severity: isWeekend ? 'medium' : 'low'
                    });
                }
                
                // Construction (weekdays only)
                if (!isWeekend && hour >= 7 && hour < 17 && Math.random() > 0.4) {
                    incidents.push({
                        title: 'Construction Zone - East of Woodland Park',
                        description: 'Lane closure for road maintenance. Use caution and expect minor delays.',
                        time: `Active until ${hour < 12 ? '5:00' : '6:00'} PM`,
                        severity: 'medium'
                    });
                }
                
                // Weather advisory (winter)
                if (isWinterSeason && Math.random() > 0.5) {
                    incidents.push({
                        title: 'Weather Advisory - Mountain Section',
                        description: 'Possible icy conditions on elevated sections. Drive carefully and reduce speed.',
                        time: this.getTimestamp(),
                        severity: 'medium'
                    });
                }
                
                // Lake George area - usually clear
                incidents.push({
                    title: 'Clear - Lake George Area',
                    description: 'No incidents reported. Road conditions good.',
                    time: this.getTimestamp(),
                    severity: 'low'
                });
                
                // Random incidents occasionally
                if (Math.random() > 0.8) {
                    const randomIncidents = [
                        { title: 'Wildlife on Road - Near Divide', description: 'Deer spotted near roadway. Drive with caution through mountain section.' },
                        { title: 'Slow-Moving Vehicle - Wilkerson Pass', description: 'Oversized load moving slowly. Pass with caution when safe.' },
                        { title: 'Scenic Overlook Full - Pikes Peak', description: 'Popular viewpoint at capacity. Continue to next pullout.' }
                    ];
                    const incident = randomIncidents[Math.floor(Math.random() * randomIncidents.length)];
                    incidents.push({
                        ...incident,
                        time: this.getTimestamp(),
                        severity: 'low'
                    });
                }
                
                this.lastUpdate = Date.now();
                
                DOM.hwy24Content.innerHTML = incidents.map(incident => `
                    <div class="traffic-item">
                        <div class="traffic-item-header">${incident.title}</div>
                        <div class="traffic-item-description">${incident.description}</div>
                        <div class="traffic-item-time">⏱️ ${incident.time}</div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Hwy 24 traffic update failed:', error);
                DOM.hwy24Content.innerHTML = '<div style="padding: 20px; text-align: center; color: #0066CC;">⚠️ Unable to load Highway 24 traffic data</div>';
            }
        },
        
        async updateAll() {
            await Promise.allSettled([
                this.updateTicker(),
                this.updateI70(),
                this.updateHwy24()
            ]);
        }
    };

    // ===== COLLAPSIBLE SKI WIDGETS =====
    const CollapsibleWidgets = {
        init() {
            const skiWidgets = document.querySelectorAll('.ski-widget');
            
            // Collapse all except first 2
            skiWidgets.forEach((widget, index) => {
                if (index >= 2) {
                    widget.classList.add('collapsed');
                }
                
                // Add click handler
                widget.addEventListener('click', function(e) {
                    if (e.target.tagName === 'A' || e.target.closest('a')) {
                        return; // Don't toggle if clicking link
                    }
                    this.classList.toggle('collapsed');
                });
            });
        }
    };

    // ===== REFRESH BUTTON HANDLERS =====
    const RefreshButtonManager = {
        init() {
            const hwy24Refresh = document.getElementById('hwy24Refresh');
            const i70Refresh = document.getElementById('i70Refresh');
            
            if (hwy24Refresh) {
                hwy24Refresh.addEventListener('click', async () => {
                    this.handleRefresh(hwy24Refresh, () => TrafficManager.updateHwy24());
                });
            }
            
            if (i70Refresh) {
                i70Refresh.addEventListener('click', async () => {
                    this.handleRefresh(i70Refresh, () => TrafficManager.updateI70());
                });
            }
        },
        
        async handleRefresh(button, updateFn) {
            button.classList.add('refreshing');
            button.disabled = true;
            
            await updateFn();
            
            setTimeout(() => {
                button.classList.remove('refreshing');
                button.disabled = false;
            }, 1000);
        }
    };

    // ===== UNIFIED UPDATE MANAGER =====
    // PERFORMANCE IMPROVEMENT: Single interval instead of multiple!
    const UpdateManager = {
        lastWeather: 0,
        lastTraffic: 0,
        lastSki: 0,
        
        async tick() {
            const now = Date.now();
            
            // Always update fast items
            ClockManager.update();
            OnlineUsersManager.update();
            HitCounterManager.increment();
            
            // Update weather (5 min)
            if (now - this.lastWeather >= config.intervals.weather) {
                this.lastWeather = now;
                WeatherManager.update().catch(console.error);
            }
            
            // Update traffic (3 min)
            if (now - this.lastTraffic >= config.intervals.traffic) {
                this.lastTraffic = now;
                TrafficManager.updateAll().catch(console.error);
            }
            
            // Update ski conditions (15 min)
            if (now - this.lastSki >= config.intervals.skiConditions) {
                this.lastSki = now;
                SkiManager.updateAll().catch(console.error);
            }
        },
        
        start() {
            // Initial updates
            WeatherManager.update().catch(console.error);
            TrafficManager.updateAll().catch(console.error);
            SkiManager.updateAll().catch(console.error);
            OnlineUsersManager.update();
            HitCounterManager.init();
            ClockManager.update();
            
            // Single master interval (every second)
            setInterval(() => this.tick(), 1000);
        }
    };

    // ===== INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', () => {
        ThemeManager.init();
        VideoManager.init();
        CollapsibleWidgets.init();
        RefreshButtonManager.init();
        UpdateManager.start();
    });

})();
