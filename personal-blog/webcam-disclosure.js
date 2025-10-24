// =====================================
// Webcam Progressive Disclosure Handler
// =====================================
// IMPROVEMENTS:
// - Extracted from inline script for better maintainability
// - Follows separation of concerns principle
// - Added JSDoc documentation
// - Improved error handling
// - Made code more modular and reusable
// =====================================

(function() {
    'use strict';

    /**
     * Configuration for progressive disclosure stages
     */
    const STAGES = {
        STAGE_2: {
            className: 'webcam-stage-2',
            buttonId: 'viewMoreStage1',
            labelText: 'webcam stage 2 content'
        },
        STAGE_3: {
            className: 'webcam-stage-3',
            buttonId: 'viewMoreStage2',
            labelText: 'webcam stage 3 content'
        }
    };

    /**
     * Reveals a stage of webcam links and hides the button
     * @param {string} stageClassName - CSS class of elements to reveal
     * @param {string} buttonId - ID of button to hide
     * @param {HTMLButtonElement} button - The button that was clicked
     */
    function revealStage(stageClassName, buttonId, button) {
        // Show all elements for this stage
        const stageElements = document.querySelectorAll(`.${stageClassName}`);
        if (!stageElements.length) {
            console.warn(`No elements found with class: ${stageClassName}`);
            return;
        }

        stageElements.forEach(el => el.classList.remove('webcam-hidden'));
        
        // Hide the button container
        const buttonContainer = document.getElementById(buttonId);
        if (buttonContainer) {
            buttonContainer.classList.add('webcam-hidden');
        }
        
        // Update ARIA state
        button.setAttribute('aria-expanded', 'true');
        
        // Smooth scroll to newly revealed content with slight delay
        setTimeout(() => {
            const firstElement = stageElements[0];
            if (firstElement) {
                firstElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    }

    /**
     * Initialize progressive disclosure for webcam links
     */
    function initWebcamDisclosure() {
        // Stage 1 -> Stage 2 button
        const viewMoreStage1Btn = document.querySelector('#viewMoreStage1 .webcam-view-more-btn');
        if (viewMoreStage1Btn) {
            viewMoreStage1Btn.addEventListener('click', function() {
                revealStage(
                    STAGES.STAGE_2.className,
                    STAGES.STAGE_2.buttonId,
                    this
                );
            });
        } else {
            console.warn('Stage 1 view more button not found');
        }
        
        // Stage 2 -> Stage 3 button
        const viewMoreStage2Btn = document.querySelector('#viewMoreStage2 .webcam-view-more-btn');
        if (viewMoreStage2Btn) {
            viewMoreStage2Btn.addEventListener('click', function() {
                revealStage(
                    STAGES.STAGE_3.className,
                    STAGES.STAGE_3.buttonId,
                    this
                );
            });
        } else {
            console.warn('Stage 2 view more button not found');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWebcamDisclosure);
    } else {
        // DOM already loaded
        initWebcamDisclosure();
    }

    // IMPROVED: Expose API for external control if needed
    window.webcamDisclosure = {
        revealStage,
        revealAll() {
            // Utility function to reveal all stages at once
            Object.values(STAGES).forEach(stage => {
                const elements = document.querySelectorAll(`.${stage.className}`);
                elements.forEach(el => el.classList.remove('webcam-hidden'));
                const buttonContainer = document.getElementById(stage.buttonId);
                if (buttonContainer) {
                    buttonContainer.classList.add('webcam-hidden');
                }
            });
        }
    };

})();

