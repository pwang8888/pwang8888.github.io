// Function to create and insert the header
function createHeader() {
  const header = document.createElement('header');
  
  // Check if we're on the index page
  const isIndexPage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname.endsWith('/') || 
                      window.location.pathname === '';
  
  header.innerHTML = `
    <div class="header-container">
      <div class="logo">
        Penny<span class="accent-dot">.</span>
      </div>
      <nav>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="portfolio.html">Portfolio</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
    </div>
  `;
  
  // Insert the header at the beginning of the body
  document.body.insertBefore(header, document.body.firstChild);
}

// Function to create and insert the footer
function createFooter() {
  const footer = document.createElement('footer');
  
  footer.innerHTML = `
    <div class="copyright">
      © Penny Wang. Coded with 💚 in 2025.
    </div>
  `;
  
  // Append the footer to the body
  document.body.appendChild(footer);
}

// Function to update active navigation links
function updateActiveNavLink() {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Find all nav links
  const navLinks = document.querySelectorAll('nav a');
  
  // Loop through links and add active class to current page
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('active');
    }
  });
}

// Function to handle header scroll effects
function handleHeaderScroll() {
  const header = document.querySelector('header');
  
  // Add scroll event listener
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      // Scrolled down - compact header
      header.classList.add('header-scrolled');
    } else {
      // At top - normal header
      header.classList.remove('header-scrolled');
    }
  });
}

// Initialize header and footer when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  createHeader();
  createFooter();
  
  // Update active nav links after header is created
  updateActiveNavLink();
  
  // Initialize header scroll effects
  handleHeaderScroll();
});
