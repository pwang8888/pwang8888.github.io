document.querySelector('footer').innerHTML = `
  <div>© ${new Date().getFullYear()} Penny Wang</div>
  <div class="social">
    <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
      <i class="fab fa-github"></i>
    </a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
      <i class="fab fa-linkedin-in"></i>
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
      <i class="fab fa-twitter"></i>
    </a>
    <a href="mailto:contact@pennywang.com" title="Email">
      <i class="far fa-envelope"></i>
    </a>
  </div>
`;
