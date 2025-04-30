document.querySelector('header').innerHTML = `
  <a href="index.html" class="logo" title="Go to homepage">PW</a>
  <nav>
    <a href="index.html">Home</a>
    <a href="portfolio.html">Work</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  </nav>
`;

// Add scroll effect to header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
