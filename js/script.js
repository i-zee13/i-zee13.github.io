document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle (persisted)
  const themeToggle = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  const applyTheme = (theme) => {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "☽" : "☀";
      themeToggle.setAttribute("title", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    }
  };
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }

  // Copy-to-clipboard for prompt cards
  document.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-prompt") || "";
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1500);
      });
    });
  });

  // Prompts: search + category filter
  const searchInput = document.querySelector(".search-input");
  const categoryFilter = document.querySelector(".category-filter");
  const promptCards = document.querySelectorAll(".prompt-card");

  const filterPrompts = () => {
    const query = (searchInput?.value || "").toLowerCase();
    const category = categoryFilter?.value || "All";
    promptCards.forEach((card) => {
      const article = card.closest("article");
      const cardCategory = card.getAttribute("data-category");
      const haystack = card.textContent.toLowerCase();
      const matchesCategory = category === "All" || category === cardCategory;
      const matchesQuery = !query || haystack.includes(query);
      article.style.display = matchesCategory && matchesQuery ? "" : "none";
    });
  };

  if (searchInput) searchInput.addEventListener("input", filterPrompts);
  if (categoryFilter) categoryFilter.addEventListener("change", filterPrompts);
});
