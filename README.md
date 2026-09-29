# Khakhariya Tiles

A static, mobile-first catalogue of **16 designs and all 60 supplied photographs**. Native HTML, CSS and JavaScript; no runtime dependencies, external fonts, backend or API.

## Preview and deploy

Open `index.html` directly, or run `npm run preview` and visit http://127.0.0.1:4173. The preview serves `dist/`.

Upload `khakhariya-tiles.zip` or the contents of `dist/` to Cloudflare Pages using Direct Upload. For Git integration, use build command `npm ci && npm run build` and output directory `dist`. Already-processed images are included; image processing is not needed during deployment. Do not deploy `Product/`, review files, development tools or node_modules.

## Products, names and photographs

Edit `PRODUCTS` in `data.js`, then run `npm run build`.

- `name`: the display colour name, such as Rosé or Burnt Amber.
- `form`: the descriptive format, such as Classic Brick, Oval Relief or Linear.
- `id`: the original numbered product folder; catalogue references use `KT 01` through `KT 16`.
- `description`: the short surface description in the viewer.
- `photos`: attached automatically from generated `photos.js` using the product ID.

Names and KT codes are presentation labels, not manufacturer specifications. Malachite, Ivory and other names describe appearance and do not claim a raw material composition.

Every product has its primary tile cutout and thumbnails for **every source photograph**. Each thumbnail opens its own photo; without JavaScript it links directly to the optimized photograph. The viewer supports:

- Thumbnail selection and previous/next photograph buttons.
- Swipe and Left/Right Arrow to change photographs.
- Previous/next tile buttons, or Shift + Left/Right Arrow to change products.
- Texture zoom and Escape to close.
- Keyboard focus containment and return to the originating link.

## Contact details

`CONTACT` in `data.js` holds all three named contacts, the address, and the supplied Google Maps link. Phone links use Indian international dialling format. Update names, displayed numbers and `dial` together, then rebuild. The enquiry section and viewer are both generated from this configuration.

WhatsApp and email are removed from the interface and application code. Enquiries use tap-to-call links:

- K D Zala — 99790 72446
- Bhaveshbhai Kunpara — 98257 45257
- Rameshbhai Vinjavadiya — 98792 70530

Address: Ariton Ceramic, Near Amprapar Primary -3 School, Thangadh - 363530.

Set `SITE.url` to the final public HTTPS origin and rebuild to add canonical metadata, absolute social preview URLs, and sitemap.xml. No invented domain is included.

## Source photographs and crops

All **60 source photographs** in `Product/1` through `Product/16` are represented. Originals remain untouched.

The photography was reviewed individually. `tools/primary-outlines.cjs` contains the primary tile outlines; `tools/additional-outlines.cjs` contains separately traced outlines for the other 44 shots. Coordinates reference each unrotated original scaled to 800px wide. Multiple polygons remove paper and table background between separate tiles while retaining arrangements, natural perspective, texture, reflections and colour variation. Primary portrait tiles are rotated 90 degrees; secondary views preserve the photographed orientation.

Some source close-ups already cut off tile edges. Those images retain the photographed detail; no missing edges are generated or stretched. The first image in each product focuses on one complete tile; secondary images include arrangements and details. The cropped close-up of product 01 focuses on the foreground tile.

Run `npm run images` to regenerate every image and `photos.js`, then `npm run build`. For a targeted update, run `node tools/process-images.cjs 1 2` with the product folder numbers to regenerate. Changing a photograph requires inspecting it and updating its polygons; never reuse unrelated coordinates blindly.

Output is transparent WebP at maximum widths of 320, 640 and 1280px. Small originals are never upscaled. Responsive gallery images, lazy thumbnail loading and on-demand viewer images prevent loading all full-size photographs upfront. A source-to-output audit and three visual contact sheets are saved in `review/`.

## Checks

Run `npm run preview` in one terminal and `npm test` in another. Tests use installed Google Chrome via Playwright. They check 320, 360, 375, 390, 412, 430, 768, 1024, 1280 and 1440px; all products and all 60 image views; browser errors; overflow; menu; keyboard and swipe navigation; focus; zoom; product/photo wraparound; phone numbers; map URL; and the no-JavaScript gallery and contacts.

`node tools/capture.cjs` saves mobile and desktop screenshots to `review/`. Lighthouse scores have not been asserted.

## File guide

- `data.js`: product names, descriptions, contacts and public URL.
- `photos.js`: generated photo dimensions and responsive paths.
- `template.html`: source markup; `index.html`: generated static page.
- `styles.css`, `script.js`: layout and progressive enhancements.
- `assets/products/`: 180 optimized files from all 60 photos.
- `_headers`: Cloudflare security and caching rules.
- `dist/`: deployable files only.

Edit template.html instead of generated index.html. After changes, run `npm run build` and refresh the upload ZIP with `Compress-Archive -Path dist\* -DestinationPath khakhariya-tiles.zip -Force` in PowerShell.

## Runiga typography

Headings, product names, the brand wordmark, and the introductory statement use locally hosted Runiga (34.7 KB). Orange Avenue is used for body copy, navigation, buttons, captions, phone numbers, and other supporting text. Small text sizes are adjusted for readability. The font is preloaded with font-display: swap, and no external font request is needed.

The bundled public font is marked personal-use only. Obtain the appropriate commercial webfont licence from https://brandsemut.com/product/runiga/ before publishing this business website, and replace assets/fonts/runiga.woff with the licensed file. This revision is a local typography preview until that is arranged. Font provenance is recorded in assets/fonts/README.txt.

## Orange Avenue typography

Orange Avenue Regular (42.2 KB) is locally hosted at assets/fonts/orange-avenue.otf and preloaded. Together with Runiga, these are the two active site typefaces; system fonts serve only as loading or missing-glyph fallbacks. Both fonts are verified at all ten target screen widths.

The supplied Orange Avenue demo is marked for personal use only. Obtain the appropriate commercial webfont licence before public business use: https://www.myfonts.com/collections/orange-avenue-font-krismagraph . Replace the demo with the licensed file.
