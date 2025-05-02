// Page transition animations
document.addEventListener('DOMContentLoaded', function() {
  // Create transition overlay
  function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    
    // Add logo to transition
    const logo = document.createElement('div');
    logo.className = 'transition-logo';
    logo.innerHTML = 'Penny<span class="accent-dot">.</span>';
    overlay.appendChild(logo);
    
    document.body.appendChild(overlay);
    return overlay;
  }
  
  // Animation for page exit
  function animatePageExit() {
    return new Promise((resolve) => {
      const overlay = createTransitionOverlay();
      
      // Animate the overlay to cover the screen
      setTimeout(() => {
        overlay.classList.add('active');
        
        // Wait for animation to complete
        setTimeout(() => {
          resolve(overlay);
        }, 500); // Should match CSS transition duration
      }, 10);
    });
  }
  
  // Animation for page entry
  function animatePageEntry(overlay) {
    // Add content-visible class to show the page content
    document.body.classList.add('content-visible');
    
    // Animate the overlay away
    setTimeout(() => {
      overlay.classList.remove('active');
      
      // Remove the overlay after transition
      setTimeout(() => {
        overlay.remove();
      }, 500); // Should match CSS transition duration
    }, 100);
  }
  
  // Apply entry animation when page loads
  const initialOverlay = createTransitionOverlay();
  initialOverlay.classList.add('active');
  
  // Wait for page to fully load before revealing content
  window.addEventListener('load', function() {
    setTimeout(() => {
      document.body.classList.add('content-visible');
      initialOverlay.classList.remove('active');
      
      setTimeout(() => {
        initialOverlay.remove();
      }, 500);
    }, 100);
  });
  
  // Intercept all navigation links
  document.addEventListener('click', function(e) {
    // Check if clicked element is an internal link
    let target = e.target;
    
    // If the clicked element is not an anchor, check if it's inside an anchor
    while (target && target !== document && target.tagName !== 'A') {
      target = target.parentNode;
    }
    
    // If we found an anchor and it's an internal link
    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href');
      
      // Make sure it's an internal link and not an anchor link
      if (href && href.indexOf('#') !== 0 && href.indexOf('http') !== 0 && href.indexOf('mailto:') !== 0) {
        // Prevent default navigation
        e.preventDefault();
        
        // Animate page exit
        animatePageExit().then((overlay) => {
          // Navigate to the new page
          window.location.href = href;
        });
      }
    }
  });
});
