const locales = window.RAYUELA_LOCALES;
document.documentElement.classList.toggle("js", Boolean(locales));
if (!locales) throw new Error("Rayuela locale data failed to load");

const languageButtons = document.querySelectorAll("[data-language]");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const header = document.querySelector(".site-header");

function setLanguage(requested) {
  const language = locales[requested] ? requested : "es";
  const copy = locales[language];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = copy[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const [attribute, key] = element.dataset.i18nAttr.split(":");
    element.setAttribute(attribute, copy[key]);
  });

  document.documentElement.lang = language;
  languageButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language),
    );
  });
  navToggle.setAttribute(
    "aria-label",
    copy[
      navToggle.getAttribute("aria-expanded") === "true"
        ? "nav.close"
        : "nav.open"
    ],
  );
  localStorage.setItem("rayuela-language", language);
}

function setMenu(open) {
  navMenu.classList.toggle("is-open", open);
  header.classList.toggle("menu-open", open);
  document.body.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute(
    "aria-label",
    locales[document.documentElement.lang][open ? "nav.close" : "nav.open"],
  );
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});
navToggle.addEventListener("click", () => {
  setMenu(navToggle.getAttribute("aria-expanded") !== "true");
});
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const reveals = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
if (reducedMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  reveals.forEach((element) => observer.observe(element));
}

setLanguage(localStorage.getItem("rayuela-language") || "es");
