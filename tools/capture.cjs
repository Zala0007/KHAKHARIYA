const {chromium}=require('@playwright/test');
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try {
  for(const width of [390,1440]) {
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   await page.goto('http://127.0.0.1:4173');
   await page.locator('main img').evaluateAll(images=>images.forEach(img=>{img.loading='eager'}));
   await page.waitForLoadState('networkidle');
   await page.locator('main img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
   await page.screenshot({path:`review/website-${width}.png`,fullPage:true});
   console.log(`Saved ${width}px review screenshot`);
   await page.close();
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
