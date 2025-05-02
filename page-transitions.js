// Simple Page Transitions with Fade Effect
document.addEventListener('DOMContentLoaded', function() {
  // Create a simple overlay for transitions
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);
  
  // Animation for page exit
  function animatePageExit() {
    return new Promise((resolve) => {
      // Prevent scrolling during transition
      document.body.style.overflow = 'hidden';
      
      // Show overlay
      overlay.classList.add('visible');
      
      // Wait for animation to complete
      setTimeout(() => {
        resolve();
      }, 500); // Match this to your CSS transition duration
    });
  }
  
  // Animation for page entry
  function animatePageEntry() {
    // Hide overlay
    overlay.classList.remove('visible');
    
    // Re-enable scrolling
    document.body.style.overflow = '';
  }
  
  // Apply entry animation when page loads
  window.addEventListener('load', function() {
    // Add initial animation class
    document.body.classList.add('content-visible');
    
    // Animate page entry
    animatePageEntry();
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
        animatePageExit().then(() => {
          // Navigate to the new page
          window.location.href = href;
        });
      }
    }
  });
});
