const fs = require('node:fs');
const sharp = require('sharp');
const primary = require('./primary-outlines.cjs');
const additional = require('./additional-outlines.cjs');
async function processPhoto(source, outlines, base, rotate) {
  const metadata = await sharp(source).metadata();
  const scale = metadata.width / 800;
  const polygons = outlines.map(outline => outline.map(([x,y]) => [Math.min(metadata.width-1,Math.round(x*scale)),Math.min(metadata.height-1,Math.round(y*scale))]));
  const points = polygons.flat();
  const left = Math.min(...points.map(p=>p[0]));
  const top = Math.min(...points.map(p=>p[1]));
  const width = Math.max(...points.map(p=>p[0])) - left + 1;
  const height = Math.max(...points.map(p=>p[1])) - top + 1;
  const shapes = polygons.map(points=>`<polygon points="${points.map(([x,y])=>`${x-left},${y-top}`).join(' ')}" fill="white"/>`).join('');
  const mask = Buffer.from(`<svg width="${width}" height="${height}">${shapes}</svg>`);
  const cutout = await sharp(source).extract({left,top,width,height}).ensureAlpha().composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
  const upright = await sharp(cutout).rotate(rotate && height > width*1.4 ? 90 : 0).png().toBuffer();
  const info = await sharp(upright).metadata();
  const sizes = [];
  for (const size of [320,640,1280]) {
    const filename = `${base}-${size}.webp`;
    const result = await sharp(upright).resize({width:size,withoutEnlargement:true}).webp({quality:size===1280?88:80,alphaQuality:100}).toFile(filename);
    sizes.push({src:filename,width:result.width});
  }
  return {image:sizes[2].src,thumbnail:sizes[0].src,width:info.width,height:info.height,srcset:sizes.filter((size,i)=>sizes.findIndex(other=>other.width===size.width)===i).map(size=>`${size.src} ${size.width}w`).join(', ')};
}
(async () => {
  fs.mkdirSync('assets/products',{recursive:true});
  fs.mkdirSync('review',{recursive:true});
  const photos = {};
  const audit = [];
  const only = process.argv.slice(2).map(number => String(Number(number)).padStart(2,'0'));
  const existing = fs.existsSync('photos.js') ? require('../photos.js') : null;
  for(let number=1;number<=16;number++) {
    const id = String(number).padStart(2,'0');
    const sources = fs.readdirSync(`Product/${number}`).filter(name=>/\.jpe?g$/i.test(name)).sort();
    const definitions = [{label:'Individual tile',polygons:[primary[number-1]]},...additional[id]];
    if(sources.length!==definitions.length) throw new Error(`Missing photo outline for product ${id}`);
    photos[id] = [];
    for(let i=0;i<sources.length;i++) {
      const source = `Product/${number}/${sources[i]}`;
      const definition = definitions[i];
      const base = `assets/products/tile-${id}${i===0?'':`-view-${String(i+1).padStart(2,'0')}`}`;
      const image = only.length && !only.includes(id) && existing ? existing[id][i] : await processPhoto(source,definition.polygons,base,i===0);
      photos[id].push({...image,label:definition.label});
      audit.push({id,view:i+1,source,label:definition.label,polygons:definition.polygons});
    }
    console.log(`Product ${id}: ${sources.length} photographs processed`);
  }
  fs.writeFileSync('photos.js',`// Generated from all source photographs. Run npm run images to update.\nconst PHOTO_DATA = ${JSON.stringify(photos,null,2)};\nif (typeof module !== 'undefined') module.exports = PHOTO_DATA;\n`);
  fs.writeFileSync('review/crop-manifest.json',JSON.stringify(audit,null,2));
  for(let batch=0;batch<3;batch++) {
    const group = audit.slice(batch*20,(batch+1)*20);
    const parts=[];
    for(let i=0;i<group.length;i++) {
      const entry=group[i];
      const image=photos[entry.id][entry.view-1];
      const buffer=await sharp(image.image).resize({width:330,height:200,fit:'inside'}).toBuffer();
      const metadata=await sharp(buffer).metadata();
      parts.push({input:buffer,left:i%4*380+Math.round((380-metadata.width)/2),top:Math.floor(i/4)*250+35});
      parts.push({input:Buffer.from(`<svg width="380" height="30"><text x="15" y="23" font-family="Arial" font-size="17">${entry.id}.${entry.view} / ${entry.label}</text></svg>`),left:i%4*380,top:Math.floor(i/4)*250});
    }
    await sharp({create:{width:1520,height:1250,channels:3,background:'#edeae4'}}).composite(parts).jpeg({quality:90}).toFile(`review/final-crops-${batch+1}.jpg`);
  }
  console.log(`All ${audit.length} source photographs processed. Originals unchanged.`);
})().catch(error=>{console.error(error);process.exit(1)});
