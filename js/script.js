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

  // Generic tab switcher: used by Hobbies (data-hobby) and Tech Arsenal (data-tab)
  const wireTabs = (btnAttr, panelAttr) => {
    const buttons = document.querySelectorAll(`[${btnAttr}]`);
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute(btnAttr);
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(`[${panelAttr}]`).forEach((panel) => {
          panel.style.display = panel.getAttribute(panelAttr) === key ? "" : "none";
        });
      });
    });
  };

  wireTabs("data-hobby", "data-hobby-panel");
  wireTabs("data-tab", "data-tab-panel");

  // Skills page: click a tech tag to reveal a detail card
  const tagButtons = document.querySelectorAll(".tag[data-skill]");
  const skillDetail = document.querySelector(".skill-detail");
  const skillBack = document.querySelector(".skill-back");
  const tagCloud = document.querySelector(".tag-cloud");

  if (tagButtons.length && skillDetail) {
    tagButtons.forEach((tag) => {
      tag.addEventListener("click", () => {
        skillDetail.querySelector(".skill-detail-title").textContent = tag.getAttribute("data-skill");
        skillDetail.querySelector(".skill-detail-desc").textContent = tag.getAttribute("data-desc");
        tagCloud.style.display = "none";
        skillDetail.style.display = "flex";
      });
    });
  }

  if (skillBack) {
    skillBack.addEventListener("click", () => {
      skillDetail.style.display = "none";
      tagCloud.style.display = "";
    });
  }
});
