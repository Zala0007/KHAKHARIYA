const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {PRODUCTS,CONTACT}=require('../data.js');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  for(const width of [320,360,375,390,412,430,768,1024,1280,1440]){
   await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173');
   assert.equal(await page.locator('.product').count(),16);
   assert.equal(await page.locator('.product-views a').count(),60);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page overflow at ${width}`);
   await page.locator('.product-card').first().click();assert.ok(await page.locator('#viewer').evaluate(d=>d.open));
   await page.keyboard.press('ArrowRight');assert.match(await page.locator('#photo-position').textContent(),/^2 \/ 3/);
   await page.keyboard.press('ArrowLeft');assert.match(await page.locator('#photo-position').textContent(),/^1 \/ 3/);
   await page.keyboard.press('Shift+ArrowRight');assert.equal(await page.locator('#viewer-name').textContent(),'Indigo');
   await page.keyboard.press('Escape');assert.ok(await page.locator('.product-card').first().evaluate(e=>e===document.activeElement));
   if(width===390||width===1440){
    for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());}
    await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0);document.activeElement.blur()});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await page.screenshot({path:`review/website-${width}.png`,fullPage:true});
   }
  }
  await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173');
  await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  await page.locator('#navigation a[href="#collection"]').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  for(let index=0;index<PRODUCTS.length;index++){
   const product=PRODUCTS[index];await page.locator('.product-card').nth(index).click();
   assert.equal(await page.locator('#viewer-name').textContent(),product.name);
   assert.equal(await page.locator('.viewer-thumb').count(),product.photos.length);
   for(let j=0;j<product.photos.length;j++){
    await page.locator('.viewer-thumb').nth(j).click();await page.locator('#viewer-image').evaluate(e=>e.decode());
    assert.ok((await page.locator('#viewer-image').getAttribute('src')).endsWith(product.photos[j].image));
    assert.equal(await page.locator('.viewer-thumb[aria-current="true"]').count(),1);
   }
   await page.locator('#viewer-close').click();
  }
  await page.locator('.product-card').first().click();
  await page.keyboard.press('Shift+Tab');assert.ok(await page.evaluate(()=>document.querySelector('#viewer').contains(document.activeElement)));
  await page.locator('#previous').click();assert.equal(await page.locator('#viewer-code').textContent(),'KT 16');
  await page.locator('#next').click();await page.locator('#photo-previous').click();assert.match(await page.locator('#photo-position').textContent(),/^3 \/ 3/);
  await page.locator('#photo-next').click();await page.locator('#zoom-toggle').click();assert.equal(await page.locator('#zoom-toggle').getAttribute('aria-pressed'),'true');await page.locator('#zoom-toggle').click();
  await page.locator('.viewer-image-wrap').evaluate(el=>{el.dispatchEvent(new TouchEvent('touchstart',{touches:[new Touch({identifier:1,target:el,clientX:300,clientY:200})]}));el.dispatchEvent(new TouchEvent('touchend',{changedTouches:[new Touch({identifier:1,target:el,clientX:100,clientY:205})]}))});
  assert.match(await page.locator('#photo-position').textContent(),/^2 \/ 3/);
  await page.screenshot({path:'review/viewer-mobile.png',fullPage:true});
  await page.locator('#viewer-close').click();
  await page.setViewportSize({width:844,height:390});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(const person of CONTACT.people){assert.equal(await page.locator(`#contact a[href="tel:${person.dial}"]`).count(),1);assert.equal(await page.locator(`#viewer a[href="tel:${person.dial}"]`).count(),1);}
  assert.equal(await page.locator('.map-link').getAttribute('href'),CONTACT.mapUrl);
  assert.equal(await page.locator('a[href*="wa.me"],a[href^="mailto:"]').count(),0);
  assert.ok((await page.locator('#contact').textContent()).includes(CONTACT.address));
  const fallback=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await fallback.goto('http://127.0.0.1:4173');
  assert.equal(await fallback.locator('.product-views a').count(),60);assert.equal(await fallback.locator('#contact a[href^="tel:"]').count(),3);
  await fallback.locator('.product-views a').nth(1).click();assert.ok(fallback.url().endsWith('tile-01-view-02-1280.webp'));
  assert.deepEqual(errors,[]);
  const manifest=JSON.parse(fs.readFileSync('review/crop-manifest.json','utf8'));
  assert.equal(manifest.length,60);assert.equal(new Set(manifest.map(p=>p.source)).size,60);
  const result={status:'passed',products:16,photographs:60,widths:[320,360,375,390,412,430,768,1024,1280,1440],contacts:CONTACT.people.map(p=>p.name),consoleErrors:errors,checks:['every source represented once','every viewer photograph decoded','no horizontal overflow','menu','photo navigation','product navigation','keyboard','focus return and containment','wraparound','zoom','swipe','phone links','map URL','no email or WhatsApp','no-JavaScript gallery and contacts']};
  fs.writeFileSync('review/test-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
