document.addEventListener("DOMContentLoaded", () => {
  // Fade in effect on load
  document.body.classList.add("content-visible");

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      document.body.classList.remove("js-page-exiting");
      document.body.classList.add("content-visible");
    }
  });

  // Find internal links
  const links = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = link.getAttribute("href");

      // Trigger fade-out
      document.body.classList.add("js-page-exiting");

      // Delay redirect
      setTimeout(() => {
        window.location.href = href;
      }, 500); // Match CSS duration
    });
  });
});
