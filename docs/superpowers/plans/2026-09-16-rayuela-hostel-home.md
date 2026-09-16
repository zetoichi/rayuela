# Rayuela Hostel Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight bilingual Rayuela Hostel Boutique homepage that publishes directly from the repository root on GitHub Pages.

**Architecture:** Use semantic HTML with complete Spanish fallback content, one stylesheet, one locale data file, and one progressive-enhancement script. Keep all asset URLs relative so the site works under a GitHub Pages project subpath. Validate the site with one zero-dependency Node smoke test.

**Tech Stack:** HTML5, CSS, browser JavaScript, Node.js built-in test runner, GitHub Pages.

---

## File Responsibilities

- `index.html`: page structure, Spanish fallback, images, map, metadata, translation hooks.
- `style.css`: Kaleo-inspired layout, responsive states, accessibility, reduced motion.
- `locales.js`: matching Spanish and English strings on `window.RAYUELA_LOCALES`.
- `script.js`: language switching, mobile menu, header state, reveal enhancement.
- `tests/site.test.mjs`: structure, locale parity, accessibility hooks, and relative-path checks.

### Task 1: Build the Static Spanish Page

**Files:**
- Modify: `index.html`
- Create: `style.css`
- Create: `tests/site.test.mjs`

- [ ] **Step 1: Write the failing static-site smoke test**

Create `tests/site.test.mjs`:

```js
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("approved sections and contact details are present", async () => {
  const html = await read("index.html");
  for (const pattern of [
    /<header[\s>]/,
    /<main[\s>]/,
    /id="inicio"/,
    /id="experiencia"/,
    /id="ubicacion"/,
    /<footer[\s>]/,
    /Una casa que vas a sentir como tuya/,
    /Av\. Belgrano 887/,
    /info@rayuelahostel\.com/,
  ]) assert.match(html, pattern);
  assert.doesNotMatch(html, /4342-5951/);
});

test("approved assets and destinations are present", async () => {
  const html = await read("index.html");
  for (const image of [
    "PX_Y1355-VSCO.jpg",
    "PX_Y1347-corregida-VSCO.jpg",
    "PX_Y1350-corregida-VSCO.jpg",
    "PX_Y1365-VSCO.jpg",
    "PX_Y1368-VSCO.jpg",
  ]) assert.match(html, new RegExp(image.replaceAll(".", "\\.")));
  assert.match(html, /hostelworld\.com\/hostels\/p\/43414\/rayuela-hostel-boutique\//);
  assert.match(html, /<iframe[^>]+loading="lazy"/s);
  assert.match(html, /google\.com\/maps\/search/);
});

test("local URLs are project-site safe and resolve", async () => {
  const html = await read("index.html");
  const paths = [...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g)].map(([, path]) => path);
  assert.ok(paths.includes("./style.css"));
  assert.doesNotMatch(html, /(?:href|src)="\/(?!\/)/);
  for (const path of paths) await access(new URL(path, root));
});

test("stylesheet includes responsive and accessibility safeguards", async () => {
  const css = await read("style.css");
  assert.match(css, /#efe5d7/i);
  assert.match(css, /#171411/i);
  assert.match(css, /@media[^{}]*max-width:\s*800px/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/i);
  assert.match(css, /:focus-visible/);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node --test tests/site.test.mjs`

Expected: FAIL because `style.css` is missing and `index.html` is empty.

- [ ] **Step 3: Build the complete Spanish fallback in `index.html`**

Use this exact section order and markup contract:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Rayuela Hostel Boutique: una casa para sentir como propia en el corazón de San Telmo, Buenos Aires.">
  <meta name="theme-color" content="#171411">
  <meta property="og:title" content="Rayuela Hostel Boutique">
  <meta property="og:description" content="Una casa que vas a sentir como tuya, en San Telmo, Buenos Aires.">
  <meta property="og:image" content="./assets/PX_Y1355-VSCO.jpg">
  <title>Rayuela Hostel Boutique | San Telmo, Buenos Aires</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav container" aria-label="Navegación principal" data-i18n-attr="aria-label:nav.label">
      <a class="brand" href="#inicio">Rayuela</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Abrir menú" data-i18n-attr="aria-label:nav.open"><span></span><span></span></button>
      <div class="nav-menu" id="nav-menu">
        <div class="nav-links">
          <a href="#inicio" data-i18n="nav.home">Inicio</a>
          <a href="#ubicacion" data-i18n="nav.location">Ubicación</a>
        </div>
        <div class="language-switcher" role="group" aria-label="Idioma / Language">
          <button type="button" data-language="es" aria-pressed="true">ES</button><span aria-hidden="true">/</span><button type="button" data-language="en" aria-pressed="false">EN</button>
        </div>
        <a class="button button-small" href="https://www.hostelworld.com/hostels/p/43414/rayuela-hostel-boutique/" target="_blank" rel="noopener noreferrer" data-i18n="nav.book">Reservar</a>
      </div>
    </nav>
  </header>
  <main>
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <img class="hero-media" src="./assets/PX_Y1355-VSCO.jpg" alt="" fetchpriority="high"><div class="hero-overlay"></div>
      <div class="hero-content container">
        <p class="eyebrow" data-i18n="hero.eyebrow">San Telmo · Buenos Aires</p>
        <h1 id="hero-title">Rayuela</h1><p class="hero-kicker">Hostel Boutique</p>
        <p class="hero-copy" data-i18n="hero.subtitle">Una casa que vas a sentir como tuya.</p>
        <div class="hero-actions">
          <a class="button" href="https://www.hostelworld.com/hostels/p/43414/rayuela-hostel-boutique/" target="_blank" rel="noopener noreferrer" data-i18n="hero.book">Reservar en Hostelworld</a>
          <a class="text-link" href="#experiencia" data-i18n="hero.discover">Descubrir Rayuela</a>
        </div>
      </div>
      <a class="scroll-cue" href="#experiencia" aria-label="Ir a Rayuela Experience" data-i18n-attr="aria-label:hero.scroll">↓</a>
    </section>
    <section class="section experience" id="experiencia" aria-labelledby="experience-title">
      <div class="container experience-grid">
        <div class="section-copy reveal">
          <p class="eyebrow" data-i18n="experience.eyebrow">Sentite como en casa</p>
          <h2 id="experience-title" data-i18n="experience.title">Rayuela Experience</h2>
          <p data-i18n="experience.body">Te damos la bienvenida a una casa que vas a sentir como tuya: un hostel atendido por sus propios dueños. Disfrutá de música, bebidas, juegos y películas en nuestros espacios comunes. La cordialidad, la seguridad, la limpieza y la diversión son nuestros valores más importantes. Vamos a estar siempre cerca para que conozcas y vivas Buenos Aires, y hagas de tu viaje una experiencia inolvidable.</p>
        </div>
        <div class="photo-collage" aria-label="Espacios comunes de Rayuela Hostel" data-i18n-attr="aria-label:experience.galleryLabel">
          <img class="photo photo-one reveal" src="./assets/PX_Y1347-corregida-VSCO.jpg" alt="Sala común de Rayuela Hostel" loading="lazy" data-i18n-attr="alt:images.lounge">
          <img class="photo photo-two reveal" src="./assets/PX_Y1350-corregida-VSCO.jpg" alt="Comedor con mural del mapa del mundo" loading="lazy" data-i18n-attr="alt:images.mapRoom">
          <img class="photo photo-three reveal" src="./assets/PX_Y1365-VSCO.jpg" alt="Viajeros compartiendo la mesa" loading="lazy" data-i18n-attr="alt:images.table">
        </div>
      </div>
    </section>
    <section class="quote-banner" aria-label="Cita de Julio Cortázar" data-i18n-attr="aria-label:quote.label">
      <img src="./assets/PX_Y1368-VSCO.jpg" alt="" loading="lazy"><div class="quote-overlay"></div>
      <blockquote class="reveal"><p data-i18n="quote.text">“La ciudad donde el amor se llama con todos los nombres…”</p><cite data-i18n="quote.credit">Julio Cortázar, Rayuela</cite></blockquote>
    </section>
    <section class="section location" id="ubicacion" aria-labelledby="location-title">
      <div class="container">
        <div class="section-heading reveal">
          <p class="eyebrow" data-i18n="location.eyebrow">En el corazón de Buenos Aires</p>
          <h2 id="location-title" data-i18n="location.title">Ubicación</h2>
          <p data-i18n="location.body">Rayuela está situada en uno de los mejores lugares de la ciudad para conocerla, vivirla y amarla. En el barrio de San Telmo, estamos a pasos de algunos de los lugares más emblemáticos de Buenos Aires.</p>
        </div>
        <div class="location-grid">
          <div class="location-card reveal">
            <p class="eyebrow" data-i18n="location.nearby">A pasos de</p>
            <ul class="landmarks">
              <li data-i18n="landmarks.mayo">Avenida de Mayo</li><li data-i18n="landmarks.obelisco">Obelisco</li><li data-i18n="landmarks.florida">Calle Florida</li><li data-i18n="landmarks.madero">Puerto Madero</li><li data-i18n="landmarks.julio">Avenida 9 de Julio</li><li data-i18n="landmarks.plaza">Plaza de Mayo</li><li data-i18n="landmarks.cabildo">Cabildo</li><li data-i18n="landmarks.catedral">Catedral Metropolitana</li>
            </ul>
            <address>Av. Belgrano 887, 1º Piso<br>San Telmo, Buenos Aires, Argentina</address>
            <a class="text-link dark" href="https://www.google.com/maps/search/?api=1&query=Av.%20Belgrano%20887%2C%20Buenos%20Aires" target="_blank" rel="noopener noreferrer" data-i18n="location.openMaps">Abrir en Google Maps</a>
          </div>
          <div class="map-card reveal"><iframe src="https://www.google.com/maps?q=Av.%20Belgrano%20887%2C%20Buenos%20Aires&output=embed" title="Mapa de Rayuela Hostel Boutique" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-i18n-attr="title:location.mapTitle"></iframe></div>
        </div>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="container footer-grid">
      <div><p class="eyebrow" data-i18n="footer.eyebrow">Tu casa en San Telmo</p><h2 data-i18n="footer.title">Buenos Aires empieza en Rayuela.</h2><a class="button" href="https://www.hostelworld.com/hostels/p/43414/rayuela-hostel-boutique/" target="_blank" rel="noopener noreferrer" data-i18n="footer.book">Reservar en Hostelworld</a></div>
      <div class="footer-contact"><p>Av. Belgrano 887, 1º Piso<br>San Telmo, Buenos Aires, Argentina</p><a href="mailto:info@rayuelahostel.com">info@rayuelahostel.com</a></div>
    </div>
    <div class="footer-wordmark" aria-hidden="true">Rayuela</div>
  </footer>
</body>
</html>
```

- [ ] **Step 4: Create `style.css`**

Implement these exact design primitives and responsive contracts; keep selectors aligned with the HTML above:

```css
:root { --ink:#171411; --cream:#efe5d7; --soft:#f7f1e8; --accent:#b4492f; --line:rgb(23 20 17 / 20%); --serif:Georgia,"Times New Roman",serif; --sans:Arial,Helvetica,sans-serif; --page:min(1180px,calc(100vw - 48px)); }
* { box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { margin:0; color:var(--ink); background:var(--cream); font:400 1rem/1.6 var(--sans); }
body.menu-open { overflow:hidden; }
img { display:block; max-width:100%; }
a { color:inherit; }
button { font:inherit; }
:focus-visible { outline:3px solid var(--accent); outline-offset:4px; }
.container { width:var(--page); margin-inline:auto; }
.section { padding:clamp(5rem,10vw,9rem) 0; }
.eyebrow { margin:0 0 1rem; font-size:.75rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; }
h1,h2,blockquote { font-family:var(--serif); font-weight:400; }
h2 { margin:0; font-size:clamp(3rem,7vw,6.5rem); line-height:.95; }
.site-header { position:fixed; z-index:20; inset:0 0 auto; color:var(--ink); background:rgb(239 229 215 / 94%); border-bottom:1px solid var(--line); transition:.3s ease; }
.js .site-header:not(.is-scrolled) { color:white; background:transparent; border-color:transparent; }
.js .site-header.menu-open { color:var(--ink); background:var(--cream); border-color:var(--line); }
.nav { min-height:76px; display:flex; align-items:center; justify-content:space-between; gap:2rem; }
.brand { font:400 1.7rem/1 var(--serif); text-decoration:none; }
.nav-menu,.nav-links,.language-switcher { display:flex; align-items:center; gap:1.5rem; }
.nav-menu { margin-left:auto; }
.nav-links a,.text-link { font-size:.9rem; font-weight:700; text-underline-offset:.35rem; }
.nav-links a { text-decoration:none; }
.language-switcher { gap:.4rem; }
.language-switcher button { padding:.2rem; color:inherit; background:none; border:0; cursor:pointer; opacity:.55; }
.language-switcher button[aria-pressed="true"] { opacity:1; text-decoration:underline; text-underline-offset:.25rem; }
.nav-toggle { display:none; width:44px; height:44px; padding:12px; color:inherit; background:none; border:0; }
.nav-toggle span { display:block; height:1px; margin:6px 0; background:currentcolor; }
.button { display:inline-flex; align-items:center; justify-content:center; min-height:52px; padding:.85rem 1.35rem; color:var(--cream); background:var(--ink); border:1px solid var(--ink); border-radius:999px; font-size:.85rem; font-weight:700; text-decoration:none; transition:.2s ease; }
.button:hover { color:var(--ink); background:var(--cream); transform:translateY(-2px); }
.button-small { min-height:42px; padding:.6rem 1rem; }
.hero { position:relative; min-height:100svh; display:grid; align-items:end; overflow:hidden; color:white; }
.hero-media,.hero-overlay { position:absolute; inset:0; width:100%; height:100%; }
.hero-media { object-fit:cover; object-position:center 48%; }
.hero-overlay { background:linear-gradient(180deg,rgb(0 0 0 / 25%),rgb(0 0 0 / 58%)); }
.hero-content { position:relative; z-index:1; padding-block:10rem 7rem; }
.hero h1 { margin:0; font-size:clamp(5rem,18vw,14rem); line-height:.72; letter-spacing:-.06em; }
.hero-kicker { margin:1.8rem 0 0; font-size:clamp(1.1rem,2vw,1.7rem); letter-spacing:.2em; text-transform:uppercase; }
.hero-copy { max-width:34rem; margin:1rem 0 0; font:400 clamp(1.3rem,2.4vw,2rem)/1.3 var(--serif); }
.hero-actions { display:flex; align-items:center; gap:1.5rem; margin-top:2.25rem; }
.hero .button { color:var(--ink); background:var(--cream); border-color:var(--cream); }
.scroll-cue { position:absolute; z-index:1; right:max(24px,calc((100vw - 1180px)/2)); bottom:2.5rem; font-size:2rem; text-decoration:none; }
.experience { background:var(--soft); }
.experience-grid { display:grid; grid-template-columns:.8fr 1.2fr; gap:clamp(3rem,8vw,8rem); align-items:center; }
.section-copy p:last-child,.section-heading>p:last-child { max-width:42rem; margin:2rem 0 0; font-size:clamp(1.05rem,1.5vw,1.3rem); }
.photo-collage { position:relative; min-height:680px; }
.photo { position:absolute; width:58%; aspect-ratio:4/3; object-fit:cover; border-radius:22px; box-shadow:0 24px 70px rgb(23 20 17 / 18%); }
.photo-one { top:0; right:0; } .photo-two { top:28%; left:0; } .photo-three { right:5%; bottom:0; }
.quote-banner { position:relative; min-height:78svh; display:grid; place-items:center; overflow:hidden; color:white; }
.quote-banner>img,.quote-overlay { position:absolute; inset:0; width:100%; height:100%; }
.quote-banner>img { object-fit:cover; } .quote-overlay { background:rgb(0 0 0 / 50%); }
.quote-banner blockquote { position:relative; z-index:1; width:min(900px,calc(100vw - 48px)); margin:0; text-align:center; }
.quote-banner blockquote p { margin:0 0 1.25rem; font-size:clamp(2.7rem,7vw,6rem); line-height:1; }
.section-heading { max-width:820px; margin:0 auto clamp(3rem,7vw,6rem); text-align:center; }
.section-heading>p:last-child { margin-inline:auto; }
.location-grid { display:grid; grid-template-columns:.75fr 1.25fr; gap:1.5rem; }
.location-card,.map-card { min-height:560px; border:1px solid var(--line); border-radius:24px; overflow:hidden; }
.location-card { display:flex; flex-direction:column; padding:clamp(2rem,4vw,3.5rem); }
.landmarks { display:grid; grid-template-columns:1fr 1fr; gap:.5rem 1.5rem; margin:1rem 0 2.5rem; padding:0; list-style:none; font:400 1.35rem/1.25 var(--serif); }
.location-card address { margin-top:auto; font-style:normal; }
.text-link.dark { margin-top:1.5rem; }
.map-card iframe { width:100%; height:100%; min-height:560px; border:0; filter:grayscale(1) contrast(.9); }
.footer { padding:clamp(5rem,10vw,9rem) 0 1rem; overflow:hidden; color:var(--cream); background:var(--ink); }
.footer-grid { display:grid; grid-template-columns:1.5fr .5fr; gap:4rem; align-items:end; }
.footer h2 { max-width:760px; margin-bottom:2rem; }
.footer .button { color:var(--ink); background:var(--cream); border-color:var(--cream); }
.footer-contact { justify-self:end; }
.footer-wordmark { margin-top:5rem; font:400 clamp(7rem,24vw,22rem)/.75 var(--serif); letter-spacing:-.07em; text-align:center; white-space:nowrap; }
.js .reveal { opacity:0; transform:translateY(28px); transition:opacity .75s ease,transform .75s ease; }
.js .reveal.is-visible { opacity:1; transform:none; }
@media (max-width:800px) {
  :root { --page:min(100% - 32px,720px); }
  .js .nav-toggle { display:block; margin-left:auto; }
  .nav-menu { flex-wrap:wrap; }
  .js .nav-menu { position:fixed; inset:76px 0 auto; display:grid; gap:1.5rem; padding:2rem 16px; color:var(--ink); background:var(--cream); border-bottom:1px solid var(--line); visibility:hidden; opacity:0; transform:translateY(-10px); transition:.2s ease; }
  .js .nav-menu.is-open { visibility:visible; opacity:1; transform:none; }
  .nav-links { align-items:flex-start; flex-direction:column; }
  .experience-grid,.location-grid,.footer-grid { grid-template-columns:1fr; }
  .photo-collage { min-height:560px; }
  .location-card,.map-card,.map-card iframe { min-height:460px; }
  .footer-contact { justify-self:start; }
}
@media (max-width:520px) {
  .hero h1 { font-size:clamp(4.6rem,27vw,7rem); }
  .hero-actions { align-items:flex-start; flex-direction:column; }
  .photo-collage { display:grid; gap:1rem; min-height:auto; }
  .photo { position:static; width:100%; }
  .photo-two { margin-left:8%; width:92%; } .photo-three { width:88%; }
  .landmarks { grid-template-columns:1fr; }
  .location-card,.map-card,.map-card iframe { min-height:400px; }
}
@media (prefers-reduced-motion:reduce) {
  html { scroll-behavior:auto; }
  *,*::before,*::after { transition-duration:.01ms!important; animation-duration:.01ms!important; animation-iteration-count:1!important; }
  .js .reveal { opacity:1; transform:none; }
}
```

- [ ] **Step 5: Run the test and commit the static page**

Run:

```bash
node --test tests/site.test.mjs
git diff --check
git add index.html style.css tests/site.test.mjs
git commit -m "feat: build Rayuela hostel landing page"
```

Expected: 4 tests pass, `git diff --check` is silent, and the commit contains the static Spanish page.

### Task 2: Add Bilingual Behavior

**Files:**
- Modify: `index.html`
- Modify: `tests/site.test.mjs`
- Create: `locales.js`
- Create: `script.js`

- [ ] **Step 1: Extend the smoke test before adding behavior**

Add this import to `tests/site.test.mjs`:

```js
import vm from "node:vm";
```

Append these tests:

```js
test("Spanish and English keys match translated markup", async () => {
  const html = await read("index.html");
  const source = await read("locales.js");
  const context = { window: {} };
  vm.runInNewContext(source, context);
  const { es, en } = context.window.RAYUELA_LOCALES;

  assert.deepEqual(Object.keys(es).sort(), Object.keys(en).sort());

  const textKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(([, key]) => key);
  const attributeKeys = [...html.matchAll(/data-i18n-attr="[^:"]+:([^"]+)"/g)].map(([, key]) => key);
  for (const key of [...textKeys, ...attributeKeys]) {
    assert.equal(typeof es[key], "string", `missing Spanish key: ${key}`);
    assert.equal(typeof en[key], "string", `missing English key: ${key}`);
  }
});

test("behavior is local, persistent, and progressively enhanced", async () => {
  const html = await read("index.html");
  const script = await read("script.js");

  assert.match(html, /src="\.\/locales\.js"/);
  assert.match(html, /src="\.\/script\.js"/);
  assert.match(script, /localStorage\.getItem/);
  assert.match(script, /document\.documentElement\.lang/);
  assert.match(script, /classList\.toggle\("js"/);
  assert.match(script, /IntersectionObserver/);
  assert.doesNotMatch(script, /from\s+["']|require\s*\(/);
});
```

- [ ] **Step 2: Add progressive-enhancement script tags**

Add these before `</body>` in `index.html`. Do not add a `js` class inline; `script.js` adds it only after locale data loads, preserving the Spanish fallback if either script fails.

```html
<script src="./locales.js"></script>
<script src="./script.js"></script>
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `node --test tests/site.test.mjs`

Expected: FAIL because `locales.js` and `script.js` do not exist.

- [ ] **Step 4: Create `locales.js`**

```js
window.RAYUELA_LOCALES = {
  es: {
    "nav.label": "Navegación principal",
    "nav.open": "Abrir menú",
    "nav.close": "Cerrar menú",
    "nav.home": "Inicio",
    "nav.location": "Ubicación",
    "nav.book": "Reservar",
    "hero.eyebrow": "San Telmo · Buenos Aires",
    "hero.subtitle": "Una casa que vas a sentir como tuya.",
    "hero.book": "Reservar en Hostelworld",
    "hero.discover": "Descubrir Rayuela",
    "hero.scroll": "Ir a Rayuela Experience",
    "experience.eyebrow": "Sentite como en casa",
    "experience.title": "Rayuela Experience",
    "experience.body": "Te damos la bienvenida a una casa que vas a sentir como tuya: un hostel atendido por sus propios dueños. Disfrutá de música, bebidas, juegos y películas en nuestros espacios comunes. La cordialidad, la seguridad, la limpieza y la diversión son nuestros valores más importantes. Vamos a estar siempre cerca para que conozcas y vivas Buenos Aires, y hagas de tu viaje una experiencia inolvidable.",
    "experience.galleryLabel": "Espacios comunes de Rayuela Hostel",
    "images.lounge": "Sala común de Rayuela Hostel",
    "images.mapRoom": "Comedor con mural del mapa del mundo",
    "images.table": "Viajeros compartiendo la mesa",
    "quote.label": "Cita de Julio Cortázar",
    "quote.text": "“La ciudad donde el amor se llama con todos los nombres…”",
    "quote.credit": "Julio Cortázar, Rayuela",
    "location.eyebrow": "En el corazón de Buenos Aires",
    "location.title": "Ubicación",
    "location.body": "Rayuela está situada en uno de los mejores lugares de la ciudad para conocerla, vivirla y amarla. En el barrio de San Telmo, estamos a pasos de algunos de los lugares más emblemáticos de Buenos Aires.",
    "location.nearby": "A pasos de",
    "location.openMaps": "Abrir en Google Maps",
    "location.mapTitle": "Mapa de Rayuela Hostel Boutique",
    "landmarks.mayo": "Avenida de Mayo",
    "landmarks.obelisco": "Obelisco",
    "landmarks.florida": "Calle Florida",
    "landmarks.madero": "Puerto Madero",
    "landmarks.julio": "Avenida 9 de Julio",
    "landmarks.plaza": "Plaza de Mayo",
    "landmarks.cabildo": "Cabildo",
    "landmarks.catedral": "Catedral Metropolitana",
    "footer.eyebrow": "Tu casa en San Telmo",
    "footer.title": "Buenos Aires empieza en Rayuela.",
    "footer.book": "Reservar en Hostelworld"
  },
  en: {
    "nav.label": "Main navigation",
    "nav.open": "Open menu",
    "nav.close": "Close menu",
    "nav.home": "Home",
    "nav.location": "Location",
    "nav.book": "Book now",
    "hero.eyebrow": "San Telmo · Buenos Aires",
    "hero.subtitle": "A house that feels like your own.",
    "hero.book": "Book on Hostelworld",
    "hero.discover": "Discover Rayuela",
    "hero.scroll": "Go to the Rayuela Experience",
    "experience.eyebrow": "Feel at home",
    "experience.title": "Rayuela Experience",
    "experience.body": "Welcome to a house that feels like your own: a hostel run by its owners. Enjoy music, drinks, games, and movies in our shared spaces. Warmth, safety, cleanliness, and fun are the values that matter most to us. We’ll be close by to help you discover and experience Buenos Aires and make your trip unforgettable.",
    "experience.galleryLabel": "Rayuela Hostel shared spaces",
    "images.lounge": "Rayuela Hostel common room",
    "images.mapRoom": "Dining room with a world map mural",
    "images.table": "Travelers sharing the table",
    "quote.label": "Quote by Julio Cortázar",
    "quote.text": "“The city where love is called by every name…”",
    "quote.credit": "Julio Cortázar, Hopscotch",
    "location.eyebrow": "In the heart of Buenos Aires",
    "location.title": "Location",
    "location.body": "Rayuela is located in one of the best parts of the city to discover, experience, and fall in love with Buenos Aires. In the San Telmo neighborhood, we are within easy reach of many of the city’s most iconic places.",
    "location.nearby": "Close to",
    "location.openMaps": "Open in Google Maps",
    "location.mapTitle": "Map of Rayuela Hostel Boutique",
    "landmarks.mayo": "Avenida de Mayo",
    "landmarks.obelisco": "The Obelisk",
    "landmarks.florida": "Florida Street",
    "landmarks.madero": "Puerto Madero",
    "landmarks.julio": "9 de Julio Avenue",
    "landmarks.plaza": "Plaza de Mayo",
    "landmarks.cabildo": "The Cabildo",
    "landmarks.catedral": "Metropolitan Cathedral",
    "footer.eyebrow": "Your home in San Telmo",
    "footer.title": "Buenos Aires starts at Rayuela.",
    "footer.book": "Book on Hostelworld"
  }
};
```

- [ ] **Step 5: Create `script.js`**

```js
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
  languageButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
  navToggle.setAttribute("aria-label", copy[navToggle.getAttribute("aria-expanded") === "true" ? "nav.close" : "nav.open"]);
  localStorage.setItem("rayuela-language", language);
}

function setMenu(open) {
  navMenu.classList.toggle("is-open", open);
  header.classList.toggle("menu-open", open);
  document.body.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", locales[document.documentElement.lang][open ? "nav.close" : "nav.open"]);
}

languageButtons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
navToggle.addEventListener("click", () => setMenu(navToggle.getAttribute("aria-expanded") !== "true"));
navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const reveals = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  reveals.forEach((element) => observer.observe(element));
}

setLanguage(localStorage.getItem("rayuela-language") || "es");
```

- [ ] **Step 6: Run the complete smoke suite and commit**

Run:

```bash
node --test tests/site.test.mjs
git diff --check
git add index.html locales.js script.js tests/site.test.mjs
git commit -m "feat: add bilingual homepage behavior"
```

Expected: 6 tests pass, `git diff --check` is silent, and the commit contains locale data, behavior, and coverage.

### Task 3: Verify GitHub Pages Readiness

**Files:**
- Verify: `index.html`
- Verify: `style.css`
- Verify: `locales.js`
- Verify: `script.js`
- Verify: `tests/site.test.mjs`

- [ ] **Step 1: Run automated verification from a clean tree**

Run:

```bash
node --test tests/site.test.mjs
git diff --check
git status --short
```

Expected: 6 tests pass, `git diff --check` is silent, and the working tree is clean.

- [ ] **Step 2: Serve the site over HTTP**

Run: `python3 -m http.server 4173`

Expected: the server reports that it is serving port 4173. Keep it running.

- [ ] **Step 3: Verify deployable files return HTTP 200**

Run in another terminal:

```bash
curl -I http://127.0.0.1:4173/
curl -I http://127.0.0.1:4173/style.css
curl -I http://127.0.0.1:4173/locales.js
curl -I http://127.0.0.1:4173/script.js
curl -I http://127.0.0.1:4173/assets/PX_Y1355-VSCO.jpg
```

Expected: every response is `200 OK`.

- [ ] **Step 4: Verify desktop presentation at approximately 1440 × 900**

Open `http://127.0.0.1:4173/` and verify the hero crop, transparent-to-cream header, layered collage, still-image quote banner, location cards, embedded map, direct Maps link, and Hostelworld buttons. Switch to EN, reload to confirm persistence, then switch back to ES.

- [ ] **Step 5: Verify mobile and accessibility behavior at approximately 390 × 844**

Verify no horizontal scroll, functional menu state and `aria-expanded`, stacked hero actions and photos, a map height of at least 400px, visible keyboard focus, reduced-motion behavior, and complete Spanish content when JavaScript is disabled.

- [ ] **Step 6: Stop the server and confirm final history**

Stop the server with `Ctrl-C`, then run:

```bash
git log --oneline -4
git status --short
```

Expected: the design, plan, static-page, and bilingual-behavior commits are present, and the tree is clean.
