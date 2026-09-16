# Rayuela Hostel Homepage Design

## Goal

Replace the old Rayuela Hostel website with a lightweight bilingual single-page site inspired by the supplied Kaleo Webflow template. The first release includes only the homepage experience and the Ubicación section, both reached through scrolling navigation.

The site must publish directly from the repository root with GitHub Pages. It uses plain HTML, CSS, and JavaScript with no build step, framework, package manager, or runtime dependency.

## Audience and Primary Action

The page serves Spanish- and English-speaking travelers evaluating Rayuela Hostel Boutique in Buenos Aires. Its primary action is booking through the supplied Hostelworld listing:

`https://www.hostelworld.com/hostels/p/43414/rayuela-hostel-boutique/`

## Page Structure

1. **Navigation**
   - Text brand: Rayuela.
   - Scroll links: Inicio/Home and Ubicación/Location.
   - ES/EN language control.
   - Reservar/Book now button linking to Hostelworld.
   - Transparent over the hero, then readable against the page background.

2. **Hero**
   - Full viewport background using `assets/PX_Y1355-VSCO.jpg`.
   - Brand: Rayuela Hostel Boutique.
   - Spanish subtitle: “Una casa que vas a sentir como tuya.”
   - English subtitle: “A house that feels like your own.”
   - Hostelworld booking button and a scroll cue.

3. **Rayuela Experience**
   - Lightly polished version of the original welcome copy.
   - Editorial layered-photo treatment inspired by Kaleo.
   - Images:
     - `assets/PX_Y1347-corregida-VSCO.jpg`
     - `assets/PX_Y1350-corregida-VSCO.jpg`
     - `assets/PX_Y1365-VSCO.jpg`

4. **Literary Image Banner**
   - Full-width still image using `assets/PX_Y1368-VSCO.jpg`, replacing the template's video treatment.
   - A short excerpt from the existing Cortázar quotation: “La ciudad donde el amor se llama con todos los nombres…”
   - English version: “The city where love is called by every name…”
   - Attribution to Julio Cortázar, *Rayuela*.

5. **Ubicación**
   - Lightly polished original San Telmo copy.
   - Nearby landmarks: Avenida de Mayo, Obelisco, calle Florida, Puerto Madero, Avenida 9 de Julio, Plaza de Mayo, Cabildo, and Catedral Metropolitana.
   - Responsive Google Maps embed centered on `Av. Belgrano 887, Buenos Aires`.
   - Visible address and direct “Abrir en Google Maps/Open in Google Maps” fallback link.

6. **Footer**
   - `Av. Belgrano 887, 1º Piso, San Telmo, Buenos Aires, Argentina`.
   - `info@rayuelahostel.com`.
   - Hostelworld booking button.
   - No phone number.

## Approved Copy

### Spanish Experience Copy

Te damos la bienvenida a una casa que vas a sentir como tuya: un hostel atendido por sus propios dueños. Disfrutá de música, bebidas, juegos y películas en nuestros espacios comunes. La cordialidad, la seguridad, la limpieza y la diversión son nuestros valores más importantes. Vamos a estar siempre cerca para que conozcas y vivas Buenos Aires, y hagas de tu viaje una experiencia inolvidable.

### English Experience Copy

Welcome to a house that feels like your own: a hostel run by its owners. Enjoy music, drinks, games, and movies in our shared spaces. Warmth, safety, cleanliness, and fun are the values that matter most to us. We’ll be close by to help you discover and experience Buenos Aires and make your trip unforgettable.

### Spanish Location Copy

Rayuela está situada en uno de los mejores lugares de la ciudad para conocerla, vivirla y amarla. En el barrio de San Telmo, estamos a pasos de algunos de los lugares más emblemáticos de Buenos Aires.

### English Location Copy

Rayuela is located in one of the best parts of the city to discover, experience, and fall in love with Buenos Aires. In the San Telmo neighborhood, we are within easy reach of many of the city’s most iconic places.

## Visual Direction

- Retain Kaleo's warm cream `#efe5d7` and near-black `#171411` palette.
- Use an elegant system serif for display typography and a system sans-serif for body copy; do not download web fonts.
- Preserve the reference template's oversized headings, generous spacing, rounded image edges, restrained overlays, and editorial photo composition.
- Keep motion subtle: native CSS transitions plus `IntersectionObserver` for simple reveals.
- Do not include Webflow runtime code, jQuery, GSAP, ScrollTrigger, SplitText, or video.
- On mobile, collapse the navigation, stack all content vertically, simplify photo layering, and give the map a practical touch-friendly height.

## File Structure

- `index.html`: semantic structure, Spanish fallback copy, metadata, and links.
- `style.css`: all responsive layout, visual styling, focus states, and reduced-motion behavior.
- `locales.js`: centralized ES and EN copy objects.
- `script.js`: language switching, saved language preference, compact mobile navigation, and reveal behavior.
- `assets/`: existing images, referenced through relative paths.

No additional assets, dependencies, generated bundles, or GitHub Actions workflows are required.

## Localization Behavior

- Spanish is the default document language.
- `locales.js` contains every translatable string under matching ES and EN keys.
- The language control updates visible copy and the document `lang` attribute.
- The selected language is stored in `localStorage` and restored on the next visit.
- If JavaScript fails or is disabled, the complete Spanish version remains visible and usable.

## Interaction and Data Flow

- Navigation uses normal fragment links to `#inicio` and `#ubicacion`.
- Smooth scrolling is CSS-based and disabled when the visitor requests reduced motion.
- The language button selects a locale object, replaces elements marked with translation keys, and persists the selected locale.
- Reveal animations are progressive enhancement: content remains available without JavaScript.
- Hostelworld opens in a new tab with `rel="noopener noreferrer"`.
- The Google Maps iframe loads lazily and includes an accessible title. A normal Maps link remains available if embedding fails.

## Accessibility and Resilience

- Use semantic `header`, `nav`, `main`, `section`, and `footer` landmarks.
- Maintain one logical heading hierarchy and descriptive image alternative text.
- Provide visible keyboard focus states and accessible names for icon-only controls.
- Meet readable color contrast and avoid placing essential copy over visually busy areas without an overlay.
- Respect `prefers-reduced-motion` and keep all content readable when animation is disabled.
- Keep Spanish HTML fallback content so locale-script failure does not empty the page.

## GitHub Pages Publishing

- Publish from the `main` branch and repository root.
- Use only relative local paths such as `./style.css` and `./assets/PX_Y1355-VSCO.jpg`, so the site also works from a project subpath.
- Do not assume a custom domain or root-relative `/assets` URL.
- GitHub Pages can publish these static files directly; no build workflow is needed.

## Verification

- Serve locally with a basic static server rather than opening the file through `file://`.
- Verify desktop and narrow mobile layouts.
- Verify ES/EN switching, persistence, and the Spanish no-JavaScript fallback.
- Verify keyboard navigation, focus visibility, reduced-motion behavior, and map title.
- Verify every image and stylesheet uses a relative path.
- Verify the Hostelworld, Google Maps, and email links.
- Verify the page when served from a nested path matching a GitHub Pages project site.

## Excluded from This Release

- Separate pages.
- Services, room details, photo gallery, rates, reservation form, blog, and contact form.
- CMS or editable admin interface.
- Analytics, cookie banners, custom fonts, video, and advanced scroll choreography.
- Webflow export code or third-party JavaScript dependencies.
