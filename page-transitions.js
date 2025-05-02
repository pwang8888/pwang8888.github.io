// Simple Page Transitions with Fade Effect
document.addEventListener('DOMContentLoaded', () => {
  // We'll apply transitions to the main content
  const main = document.querySelector('main');

  // Make the body visible (fixes black screen issue)
  window.addEventListener('load', () => {
    document.body.classList.add('content-visible');
  });

  // Add a transition class to the main content for smooth fading
  if (main) {
    main.classList.add('transition-fade');

    // On page load, make sure content is visible
    window.addEventListener('load', () => {
      main.classList.add('visible');
    });
  }

  // Function to handle link clicks and page transitions
  function handleLinkClick(event) {
    // Only handle internal links
    const href = this.getAttribute('href');

    // Skip if it's an external link, anchor link, or other special link
    if (!href ||
        href.indexOf('#') === 0 ||
        href.indexOf('http') === 0 ||
        href.indexOf('mailto:') === 0) {
      return; // Let the browser handle these normally
    }

    // Prevent default navigation
    event.preventDefault();

    // Start fade out transition
    if (main) {
      main.classList.remove('visible');
    }

    // After the transition completes, navigate to the new page
    setTimeout(() => {
      window.location.href = href;
    }, 300); // Match this timing to your CSS transition duration
  }

  // Add click event listeners to all internal links
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', handleLinkClick);
  });
});
