const sharp=require('sharp');
(async()=>{
 const tiles=await Promise.all(['03','10','01','07'].map(async(id)=>sharp(`assets/products/tile-${id}-640.webp`).resize({width:230}).toBuffer()));
 const type=Buffer.from('<svg width="1200" height="630"><text x="60" y="86" font-family="Arial" font-size="20" letter-spacing="4" fill="#26372d">KHAKHARIYA TILES</text><text x="54" y="235" font-family="Arial" font-size="78" fill="#26372d">Colour.</text><text x="54" y="328" font-family="Arial" font-size="78" fill="#26372d">Texture.</text><text x="54" y="421" font-family="Arial" font-size="78" fill="#8a6847">Possibility.</text><text x="60" y="535" font-family="Arial" font-size="19" fill="#697067">16 designs. Every detail.</text></svg>');
 const layers=tiles.map((input,i)=>({input,left:640+i%2*260,top:185+Math.floor(i/2)*155}));layers.push({input:type,left:0,top:0});
 await sharp({create:{width:1200,height:630,channels:3,background:'#f4f1eb'}}).composite(layers).jpeg({quality:88}).toFile('assets/social-preview.jpg');
})();
