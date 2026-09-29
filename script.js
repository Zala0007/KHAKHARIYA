(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  menu.hidden = false;
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
  });
  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  document.querySelector('#year').textContent = new Date().getFullYear();

  const dialog = document.querySelector('#viewer');
  const photo = document.querySelector('#viewer-image');
  const imageWrap = document.querySelector('.viewer-image-wrap');
  const thumbnails = document.querySelector('#viewer-thumbnails');
  const zoom = document.querySelector('#zoom-toggle');
  let activeProduct = 0;
  let activePhoto = 0;
  let trigger;
  let touchStart;
  const resetZoom = () => {
    imageWrap.classList.remove('zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'View texture +';
    imageWrap.scrollTo(0, 0);
  };
  function showPhoto(index) {
    const product = PRODUCTS[activeProduct];
    activePhoto = (index + product.photos.length) % product.photos.length;
    const selected = product.photos[activePhoto];
    resetZoom();
    photo.width = selected.width;
    photo.height = selected.height;
    photo.src = selected.image;
    photo.alt = `${product.name} ${product.form.toLowerCase()} — ${selected.label.toLowerCase()}`;
    document.querySelector('#photo-label').textContent = selected.label;
    document.querySelector('#photo-position').textContent = `${activePhoto + 1} / ${product.photos.length} photographs`;
    thumbnails.querySelectorAll('button').forEach((button,i) => button.setAttribute('aria-current', String(i === activePhoto)));
  }
  function showProduct(index, initialPhoto = 0) {
    activeProduct = (index + PRODUCTS.length) % PRODUCTS.length;
    const product = PRODUCTS[activeProduct];
    document.querySelector('#viewer-code').textContent = product.code;
    document.querySelector('#viewer-name').textContent = product.name;
    document.querySelector('#viewer-form').textContent = product.form;
    document.querySelector('#viewer-description').textContent = product.description;
    document.querySelector('#viewer-position').textContent = `${String(activeProduct + 1).padStart(2,'0')} / ${PRODUCTS.length}`;
    const fragment = document.createDocumentFragment();
    product.photos.forEach((entry,i) => {
      const button = document.createElement('button');
      button.className = 'viewer-thumb';
      button.dataset.view = i;
      button.setAttribute('aria-label', `${entry.label}, photograph ${i+1}`);
      const image = document.createElement('img');
      image.src = entry.thumbnail;
      image.alt = '';
      image.width = entry.width;
      image.height = entry.height;
      button.append(image);
      fragment.append(button);
    });
    thumbnails.replaceChildren(fragment);
    showPhoto(initialPhoto);
  }
  document.querySelector('.product-grid').addEventListener('click', event => {
    const link = event.target.closest('a[data-view]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    trigger = link;
    const productElement = link.closest('.product');
    showProduct(PRODUCTS.findIndex(product => product.id === productElement.dataset.id), Number(link.dataset.view));
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
  document.querySelector('#viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    resetZoom();
    trigger?.focus({ preventScroll: true });
  });
  document.querySelector('#previous').addEventListener('click', () => showProduct(activeProduct - 1));
  document.querySelector('#next').addEventListener('click', () => showProduct(activeProduct + 1));
  document.querySelector('#photo-previous').addEventListener('click', () => showPhoto(activePhoto - 1));
  document.querySelector('#photo-next').addEventListener('click', () => showPhoto(activePhoto + 1));
  thumbnails.addEventListener('click', event => { const button = event.target.closest('button[data-view]'); if(button)showPhoto(Number(button.dataset.view)); });
  dialog.addEventListener('keydown', event => {
    if(event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button, a[href]')].filter(element => !element.hidden && element.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length-1];
      if(event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if(!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if(event.key === 'ArrowLeft') { event.preventDefault(); event.shiftKey ? showProduct(activeProduct - 1) : showPhoto(activePhoto - 1); }
    if(event.key === 'ArrowRight') { event.preventDefault(); event.shiftKey ? showProduct(activeProduct + 1) : showPhoto(activePhoto + 1); }
  });
  dialog.addEventListener('click', event => {
    if(event.target !== dialog)return;
    const rect = dialog.getBoundingClientRect();
    if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)dialog.close();
  });
  zoom.addEventListener('click', () => {
    const enabled = imageWrap.classList.toggle('zoomed');
    zoom.setAttribute('aria-pressed', String(enabled));
    zoom.textContent = enabled ? 'Fit photograph −' : 'View texture +';
  });
  imageWrap.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 && !imageWrap.classList.contains('zoomed') ? {x:event.touches[0].clientX,y:event.touches[0].clientY} : null;
  }, {passive:true});
  imageWrap.addEventListener('touchend', event => {
    if(!touchStart || imageWrap.classList.contains('zoomed'))return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if(Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)*1.5)showPhoto(activePhoto + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, {passive:true});
  imageWrap.addEventListener('touchcancel', () => { touchStart = null; }, {passive:true});
})();
