// Edit these display names and contact details, then run npm run build.
// Names describe the photographed colour and form; they are catalogue labels.
const PRODUCT_PHOTOS = typeof module !== 'undefined' ? require('./photos.js') : PHOTO_DATA;
const PRODUCTS = [
  { id: '01', name: 'Rosé', form: 'Classic Brick', description: 'A softly varied rose glaze with a luminous surface and gently defined edges.' },
  { id: '02', name: 'Indigo', form: 'Square', description: 'Rich indigo blue, clouded with lighter tones and a distinctive speckled surface.' },
  { id: '03', name: 'Juniper', form: 'Oval Relief', description: 'Muted woodland green with an elongated oval relief and deeper colour around the edges.' },
  { id: '04', name: 'Golden Ochre', form: 'Linear', description: 'A slender golden-ochre surface with delicate crackle detail and a softly shaded border.' },
  { id: '05', name: 'Forest', form: 'Linear', description: 'Deep forest green in a slim format, with a fine network of visible surface detail.' },
  { id: '06', name: 'Sage', form: 'Classic Brick', description: 'Quiet sage-green tones with fine crackle detail and subtle variation from tile to tile.' },
  { id: '07', name: 'Ivory', form: 'Oval Relief', description: 'A warm ivory surface with an oval relief and an expressive, softly raised texture.' },
  { id: '08', name: 'Golden Ochre', form: 'Classic Brick', description: 'Warm ochre with a softly mottled centre, fine crackle detail and darker edges.' },
  { id: '09', name: 'Umber', form: 'Classic Brick', description: 'Earthy brown tones with an understated surface and natural-looking tonal variation.' },
  { id: '10', name: 'Burnt Amber', form: 'Classic Brick', description: 'Glowing amber and deep brown tones, with a fine crackle pattern and richly shaded edges.' },
  { id: '11', name: 'Malachite', form: 'Classic Brick', description: 'Deep green with dark speckling, intricate surface lines and a reflective finish.' },
  { id: '12', name: 'Blush', form: 'Classic Brick', description: 'A muted blush-pink surface with a soft, finely textured appearance.' },
  { id: '13', name: 'Ivory', form: 'Textured Brick', description: 'A light ivory tone with an intricate raised texture that brings depth to the surface.' },
  { id: '14', name: 'Burnt Amber', form: 'Oval Relief', description: 'Rich amber framed by dark edges, shaped around a distinctive elongated oval relief.' },
  { id: '15', name: 'Malachite', form: 'Oval Relief', description: 'Deep green and blue-green tones with speckled detail and an elongated oval relief.' },
  { id: '16', name: 'Golden Ochre', form: 'Oval Relief', description: 'Warm golden ochre with a softly outlined oval relief and fine surface variation.' },
].map(product => ({
  ...product,
  code: `KT ${product.id}`,
  photos: PRODUCT_PHOTOS[product.id],
  image: PRODUCT_PHOTOS[product.id][0].image,
  thumbnail: PRODUCT_PHOTOS[product.id][0].thumbnail,
  objectPosition: '50% 50%',
  alt: `${product.name} ${product.form.toLowerCase()} tile, showing its photographed colour, texture and shape`,
}));

const CONTACT = {
  people: [
    { name: 'K D Zala', phone: '99790 72446', dial: '+919979072446' },
    { name: 'Bhaveshbhai Kunpara', phone: '98257 45257', dial: '+919825745257' },
    { name: 'Rameshbhai Vinjavadiya', phone: '98792 70530', dial: '+919879270530' },
  ],
  address: 'Ariton Ceramic, Near Amprapar Primary -3 School, Thangadh - 363530',
  mapUrl: 'https://maps.app.goo.gl/ZKfuEKhSB17fwVdv5?g_st=ac',
};
// Set to the final public https:// domain to generate a canonical URL and sitemap.
const SITE = { url: '' };
if (typeof module !== 'undefined') module.exports = { PRODUCTS, CONTACT, SITE };
