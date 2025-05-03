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
        exitDuration: 600,
        entranceDuration: 400
      };
    },

    // Initialize the page transition
    init() {
      if (window === window.top) {
        settings = this.settings();
        this.bindEvents();
      } else {
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
        settings.body.classList.add('content-visible'); // <- Add this line to fix black screen
      }, settings.entranceDuration);
    },

    // Handle link clicks and transitions
    transitionPage() {
      settings.transitionLinks.forEach(link => {
        link.addEventListener('click', event => {
          if (settings.body.classList.contains(noTransitionClass) || 
              event.metaKey || event.ctrlKey || event.shiftKey) {
            return;
          }

          event.preventDefault();
          const targetUrl = link.href;
          settings.body.classList.add('js-page-exiting');
          setTimeout(() => {
            window.location = targetUrl;
          }, settings.exitDuration);
        });
      });
    },

    // Handle browser-specific behaviors
    handleBrowserSpecifics() {
      settings.window.addEventListener('unload', function unload() {
        settings.window.removeEventListener('unload', unload);
      });

      settings.window.addEventListener('pageshow', event => {
        if (event.persisted) {
          window.location.reload();
        }
      });
    }
  };
})();

// Initialize page transition and fix black screen
document.addEventListener('DOMContentLoaded', function() {
  PageTransition.init();
  document.body.classList.add('content-visible'); // <- Add this in case setTimeout fails
});
