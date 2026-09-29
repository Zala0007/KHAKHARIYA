const fs = require('node:fs');
const { PRODUCTS, CONTACT, SITE } = require('../data.js');
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const phoneLink = person => `tel:${person.dial.replace(/[^+\d]/g,'')}`;
const cards = PRODUCTS.map(product => {
  const photo = product.photos[0];
  const views = product.photos.map((photo,index)=>`<a href="${escape(photo.image)}" data-view="${index}" aria-label="View ${escape(product.name)} ${escape(product.form)}, ${escape(photo.label)}, photograph ${index+1} of ${product.photos.length}"><img src="${escape(photo.thumbnail)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${escape(photo.label)}"></a>`).join('');
  return `<article class="product" data-id="${escape(product.id)}"><a class="product-card" data-view="0" href="${escape(photo.image)}" aria-label="Explore ${escape(product.name)} ${escape(product.form)}, ${escape(product.code)}"><div class="product-photo"><span class="product-ref">${escape(product.code)}</span><img src="${escape(photo.thumbnail)}" srcset="${escape(photo.srcset)}" sizes="(max-width:350px) 85vw, (max-width:700px) 90vw, (max-width:1100px) 28vw, 21vw" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${escape(product.alt)}"><span class="expand" aria-hidden="true">↗</span></div><div class="product-info"><h3>${escape(product.name)}</h3><span class="photo-count">${product.photos.length} views</span></div><p class="product-subtitle">${escape(product.form)}</p></a><div class="product-views" aria-label="All photographs of ${escape(product.name)} ${escape(product.form)}">${views}</div></article>`;
});
const people = CONTACT.people.map(person=>`<a class="person" href="${phoneLink(person)}" aria-label="Call ${escape(person.name)} on ${escape(person.phone)}"><span class="person-name">${escape(person.name)}</span><span class="person-number">${escape(person.phone)}</span><span class="person-arrow" aria-hidden="true">↗</span></a>`).join('');
const contacts = `<div class="contact-layout"><div class="contact-people">${people}</div><div class="visit"><p class="eyebrow">FIND US IN THANGADH</p><address>${escape(CONTACT.address)}</address><a class="text-link map-link" href="${escape(CONTACT.mapUrl)}" target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a></div></div>`;
const viewerContacts = CONTACT.people.map(person=>`<a class="viewer-person" href="${phoneLink(person)}" aria-label="Call ${escape(person.name)} on ${escape(person.phone)}"><span>${escape(person.name)}</span><span>${escape(person.phone)} ↗</span></a>`).join('');
let html = fs.readFileSync('template.html','utf8').replace('<!-- PRODUCT_GALLERY -->',cards.join('\n')).replace('<!-- CONTACT_METHODS -->',contacts).replace('<!-- VIEWER_CONTACTS -->',viewerContacts);
let metadata = '';
if(SITE.url) {
  const url = new URL(SITE.url).origin + '/';
  metadata = `<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(url)}assets/social-preview.jpg"><meta name="twitter:image" content="${escape(url)}assets/social-preview.jpg">`;
  fs.writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(url)}</loc></url></urlset>`);
  fs.writeFileSync('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${url}sitemap.xml\n`);
} else fs.writeFileSync('robots.txt','User-agent: *\nAllow: /\n');
html = html.replace(/^[ \t]*<!-- SITE_METADATA -->/m,metadata);
fs.writeFileSync('index.html',html);
fs.mkdirSync('dist',{recursive:true});
for(const name of ['index.html','styles.css','script.js','data.js','photos.js','robots.txt','_headers']) fs.copyFileSync(name,`dist/${name}`);
fs.cpSync('assets','dist/assets',{recursive:true});
if(SITE.url) fs.copyFileSync('sitemap.xml','dist/sitemap.xml');
else if(fs.existsSync('dist/sitemap.xml'))fs.unlinkSync('dist/sitemap.xml');
console.log(`Built ${PRODUCTS.length} designs with ${PRODUCTS.reduce((n,p)=>n+p.photos.length,0)} photographs and ${CONTACT.people.length} named phone contacts.`);
