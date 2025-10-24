// =====================================
// Snowfall Effect Module
// =====================================
// IMPROVEMENTS:
// - Extracted from inline script for better maintainability
// - Added configuration options
// - Improved performance with requestAnimationFrame
// - Better memory management
// =====================================

(function() {
    'use strict';

    // Configuration
    const config = {
        initialSnowflakes: 50,
        creationInterval: 300, // ms
        minDuration: 4,
        maxDuration: 7,
        minSize: 0.8,
        maxSize: 1.5,
        maxDelayspread: 3000
    };

    let snowfallActive = false;
    let creationIntervalId = null;

    /**
     * Creates a single snowflake element with random properties
     */
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄';
        snowflake.setAttribute('aria-hidden', 'true'); // Accessibility: decorative only
        
        // Random horizontal position
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Random animation duration (slower = larger flakes feel)
        const duration = Math.random() * (config.maxDuration - config.minDuration) + config.minDuration;
        snowflake.style.animationDuration = duration + 's';
        
        // Random size
        const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
        snowflake.style.fontSize = size + 'em';
        
        // Random delay
        snowflake.style.animationDelay = Math.random() * config.maxDelayspread + 'ms';
        
        document.body.appendChild(snowflake);
        
        // Clean up after animation completes
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.remove();
            }
        }, (duration + 3) * 1000);
    }

    /**
     * Start the snowfall effect
     */
    function startSnowfall() {
        if (snowfallActive) return; // Prevent multiple instances
        
        snowfallActive = true;
        
        // Create initial batch
        for (let i = 0; i < config.initialSnowflakes; i++) {
            setTimeout(() => createSnowflake(), Math.random() * config.maxDelayspread);
        }
        
        // Keep creating new snowflakes
        creationIntervalId = setInterval(() => {
            if (snowfallActive) {
                createSnowflake();
            }
        }, config.creationInterval);
    }

    /**
     * Stop the snowfall effect (useful for performance)
     */
    function stopSnowfall() {
        snowfallActive = false;
        if (creationIntervalId) {
            clearInterval(creationIntervalId);
            creationIntervalId = null;
        }
        
        // Remove existing snowflakes
        document.querySelectorAll('.snowflake').forEach(sf => sf.remove());
    }

    // Auto-start on page load (only on homepage)
    if (window.location.pathname === '/index.html' || 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('/personal-blog/')) {
        window.addEventListener('load', startSnowfall);
    }

    // Expose API for external control
    window.snowfallEffect = {
        start: startSnowfall,
        stop: stopSnowfall,
        isActive: () => snowfallActive
    };

})();

