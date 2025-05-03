// Page Transition Module
// Creates smooth transitions between pages

const PageTransition = (() => {
  // Settings and variables
  let settings;
  const noTransitionClass = 'no-transition';
  
  return {
    // Initialize settings
    settings() {
      return {
        // Select all internal links except those with no-transition class
        transitionLinks: document.querySelectorAll(`a[href^="/"]:not(.${noTransitionClass}), 
                                                    a[href^="./"]:not(.${noTransitionClass}), 
                                                    a[href^="../"]:not(.${noTransitionClass})`),
        body: document.body,
        window: window,
        exitDuration: 600, // Duration of exit animation in ms
        entranceDuration: 400 // Duration of entrance animation in ms
      };
    },
    
    // Initialize the page transition
    init() {
      // Only apply transitions in main window (not iframes)
      if (window === window.top) {
        settings = this.settings();
        this.bindEvents();
      } else {
        // If in iframe, just add loaded class after a delay
        setTimeout(() => {
          document.body.classList.add('js-page-loaded');
        }, 800);
      }
    },
    
    // Set up all event listeners
    bindEvents() {
      this.loadingClasses();
      this.transitionPage();
      this.handleBrowserSpecifics();
    },
    
    // Add classes for page load animation
    loadingClasses() {
      setTimeout(() => {
        settings.body.classList.add('js-page-loaded');
      }, settings.entranceDuration);
    },
    
    // Handle link clicks and transitions
    transitionPage() {
      // Loop through all transition links
      settings.transitionLinks.forEach(link => {
        link.addEventListener('click', event => {
          // Skip transition if special keys are pressed or body has no-transition class
          if (settings.body.classList.contains(noTransitionClass) || 
              event.metaKey || event.ctrlKey || event.shiftKey) {
            return;
          }
          
          // Prevent default navigation
          event.preventDefault();
          
          // Store the target URL
          const targetUrl = link.href;
          
          // Add exiting class to body for CSS animation
          settings.body.classList.add('js-page-exiting');
          
          // Navigate to the target URL after exit animation completes
          setTimeout(() => {
            window.location = targetUrl;
          }, settings.exitDuration);
        });
      });
    },
    
    // Handle browser-specific behaviors
    handleBrowserSpecifics() {
      // Firefox fix for back button
      settings.window.addEventListener('unload', function unload() {
        settings.window.removeEventListener('unload', unload);
      });
      
      // Safari fix for back button
      settings.window.addEventListener('pageshow', event => {
        if (event.persisted) {
          window.location.reload();
        }
      });
    }
  };
})();

// Initialize the page transition
document.addEventListener('DOMContentLoaded', function() {
  PageTransition.init();
});
