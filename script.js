// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---------- Mobile nav toggle ----------
const toggle = $(".navToggle");
const links = $("[data-nav-links]"); // your nav has: data-nav-links

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Footer year ----------
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ---------- Active nav link on scroll (matches your .nav-links) ----------
const sections = ["projects", "experience", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActive() {
  const y = window.scrollY + 140;
  let current = null;

  for (const s of sections) {
    if (s.offsetTop <= y) current = s;
  }

  $$(".nav-links a").forEach((a) => a.classList.remove("active"));
  if (current) {
    const a = $(`.nav-links a[href="#${current.id}"]`);
    if (a) a.classList.add("active");
  }
}
window.addEventListener("scroll", setActive, { passive: true });
setActive();

// ---------- Theme toggle (uses your existing #themeBtn) ----------
(function initTheme() {
  const key = "portfolio-theme";
  const saved = localStorage.getItem(key);
  const prefersLight =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  const theme = saved || (prefersLight ? "light" : "dark");
  if (theme === "light") document.documentElement.setAttribute("data-theme", "light");

  const themeBtn = $("#themeBtn");
  if (!themeBtn) return;

  function syncIcon() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    themeBtn.textContent = isLight ? "☀️" : "🌙";
  }
  syncIcon();

  themeBtn.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(key, "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem(key, "light");
    }
    syncIcon();
  });
})();

// ---------- Scroll reveal ----------
const revealEls = $$("section, .card, footer").map((el) => {
  el.classList.add("reveal");
  return el;
});

const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.12 }
);

revealEls.forEach((el) => io.observe(el));

// ---------- Back to top button ----------
(function backToTop() {
  // If you already have one in HTML, reuse it.
  let a = $(".backTop");
  if (!a) {
    a = document.createElement("a");
    a.href = "#top";
    a.className = "btn backTop";
    a.textContent = "↑";
    a.setAttribute("aria-label", "Back to top");
    document.body.appendChild(a);
  }

  function onScroll() {
    a.classList.toggle("show", window.scrollY > 600);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Smooth scroll (more reliable than anchor jump sometimes)
  a.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  });
})();
