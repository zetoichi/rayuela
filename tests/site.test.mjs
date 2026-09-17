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
  ]) {
    assert.match(html, pattern);
  }
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
  ]) {
    assert.match(html, new RegExp(image.replaceAll(".", "\\.")));
  }
  assert.match(
    html,
    /hostelworld\.com\/hostels\/p\/43414\/rayuela-hostel-boutique\//,
  );
  assert.match(html, /<iframe[^>]+loading="lazy"/s);
  assert.match(html, /google\.com\/maps\/search/);
});

test("local URLs are project-site safe and resolve", async () => {
  const html = await read("index.html");
  const paths = [
    ...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g),
  ].map(([, path]) => path);
  assert.ok(paths.includes("./style.css"));
  assert.doesNotMatch(html, /(?:href|src)="\/(?!\/)/);
  for (const path of paths) {
    await access(new URL(path, root));
  }
});

test("stylesheet includes responsive and accessibility safeguards", async () => {
  const css = await read("style.css");
  assert.match(css, /#efe5d7/i);
  assert.match(css, /#171411/i);
  assert.match(css, /@media[^{}]*max-width:\s*800px/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/i);
  assert.match(css, /:focus-visible/);
});
