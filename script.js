(function () {
    const qs = (sel, ctx = document) => ctx.querySelector(sel);
    const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  
    const header = qs('.site-header');
    if (header) {
      document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
      window.addEventListener('resize', () => {
        document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
      });
    }
  
    // IntersectionObserver for scroll reveals
    const revealEls = qsa('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            obs.unobserve(entry.target);
          }
        }
      }, { threshold: 0.15 });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('show'));
    }
  

  
    // Smooth scroll with header offset for same-page links
    qsa('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        const target = href && href.length > 1 ? qs(href) : null;
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight + 10 : 0);
          window.scrollTo({ top, behavior: 'smooth' });
          target.focus({ preventScroll: true });
        }
      });
    });
  
    // Back-to-top visibility
    const backToTop = qs('#backToTop');
    if (backToTop) {
      const toggleBackToTop = () => {
        const show = window.scrollY > 500;
        backToTop.style.opacity = show ? '1' : '0.2';
      };
      toggleBackToTop();
      window.addEventListener('scroll', toggleBackToTop, { passive: true });
    }
  
    // Initialize EmailJS (guarded — not every page loads the EmailJS script)
    // TODO: paste your EmailJS Public Key here
    if (typeof emailjs !== 'undefined') {
      emailjs.init('YOUR_PUBLIC_KEY');
    }

    // Contact form handler
    const form = qs('#contact-form');
    const toast = qs('#toast');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = qs('#name', form);
        const email = qs('#email', form);
        const phone = qs('#phone', form);
        const message = qs('#message', form);
  
        let valid = true;
        [name, email, message].forEach(f => {
          if (!f.value.trim()) {
            valid = false;
            f.setAttribute('aria-invalid', 'true');
            f.style.boxShadow = '0 0 0 4px #FF69B4';
          } else {
            f.removeAttribute('aria-invalid');
            f.style.boxShadow = '';
          }
        });
        if (!/^\S+@\S+\.\S+$/.test(email.value)) {
          valid = false;
          email.setAttribute('aria-invalid', 'true');
          email.style.boxShadow = '0 0 0 4px #FF69B4';
        }
  
        if (!valid) return;
  
        // Send email using EmailJS
        const serviceField = qs('#service', form);
        const templateParams = {
          name: name.value,
          email: email.value,
          phone: phone.value || 'Not provided',
          service: serviceField ? serviceField.value : 'Not specified',
          message: message.value,
          to_email: 'romphotoproduction@gmail.com',
        };

        // Send two emails: an auto-reply to the client, and a notification to Roman
        const EMAILJS_SERVICE_ID = 'service_dae6tt3';
        const TEMPLATE_AUTOREPLY_TO_CLIENT = 'template_mkhvlu1';
        const TEMPLATE_NOTIFY_ME = 'template_dq0co7e';

        Promise.all([
          emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_AUTOREPLY_TO_CLIENT, templateParams),
          emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_NOTIFY_ME, templateParams)
        ])
          .then(function(responses) {
            console.log('SUCCESS!', responses);
            showToast('Thanks! Your message has been sent successfully.');
            form.reset();
          }, function(error) {
            console.log('FAILED...', error);
            showToast('Sorry, there was an error sending your message. Please try again or contact me directly.');
          });
      });
    }
  
    function showToast(text) {
      if (!toast) return;
      toast.textContent = text;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2400);
    }
  

    // Hover pop effect for cards and buttons (enhanced)
    const popTargets = qsa('.comic-card, .btn, .nav-link, .messenger-btn');
    popTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.transform += ' translateY(-2px) scale(1.02)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = el.style.transform.replace(' translateY(-2px) scale(1.02)', '');
      });
    });
  })();

  // Booking Modal functionality - runs after DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('#booking-modal');
    const bookingName = document.querySelector('#booking-name');
    const bookingForm = document.querySelector('#booking-form');
    const bookBtns = document.querySelectorAll('.book-btn');
    const modalClose = document.querySelector('.modal-close');
    const modalCancel = document.querySelector('.modal-cancel');

    console.log('Modal elements found:', { modal, bookingName, bookingForm, bookBtns: bookBtns.length });

    if (modal && bookBtns.length > 0) {
      // Open modal when book button is clicked
      bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          console.log('Book button clicked!');
          e.preventDefault();
          const bookingType = btn.getAttribute('data-booking');
          console.log('Booking type:', bookingType);
          bookingName.textContent = `Booking: ${bookingType}`;
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
      });

      // Close modal functions
      const closeModal = () => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
        bookingForm.reset();
      };

      // Close modal events
      if (modalClose) modalClose.addEventListener('click', closeModal);
      if (modalCancel) modalCancel.addEventListener('click', closeModal);
      
      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // Close modal with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
          closeModal();
        }
      });

      // Handle form submission
      if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(bookingForm);
          const name = formData.get('name');
          const phone = formData.get('phone');
          const description = formData.get('description');
          const bookingType = bookingName.textContent.replace('Booking: ', '');

          // Create email content
          const subject = `Booking Request: ${bookingType}`;
          const body = `Booking Type: ${bookingType}
Name: ${name}
Phone: ${phone}
Description: ${description}`;

          // Open email client
          const mailtoLink = `mailto:romphotoproduction@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = mailtoLink;

          // Close modal
          closeModal();
        });
      }
    }

    const albumConfig = {
      'la-street-vibes': {
        title: 'LA Street Vibes',
        folder: 'albums/la-street-vibes',
        count: 8,
        description: 'Graffiti, rappers, old cars and neon-lit downtown energy.'
      },
      'beach-adventures': {
        title: 'Beach Adventures',
        folder: 'albums/beach-adventures',
        count: 8,
        description: 'Sunset boardwalks, palms, waves and coastal portraits.'
      },
      'hollywood-glam': {
        title: 'Hollywood Glam',
        folder: 'albums/hollywood-glam',
        count: 8,
        description: 'Red carpets, neon signs and classic Hollywood moments.'
      },
      'video-clips': {
        title: 'Video Clips',
        folder: 'albums/video-clips',
        count: 8,
        description: 'Motion shoot stills, set life and cinematic production shots.'
      }
    };

    const albumModal = document.querySelector('#album-modal');
    const albumGallery = document.querySelector('.album-modal-gallery');
    const albumTitle = document.querySelector('#album-modal-title');
    const albumDesc = document.querySelector('.album-modal-description');
    const albumClose = albumModal ? albumModal.querySelector('.modal-close') : null;
    const albumButtons = document.querySelectorAll('.album-open-btn');

    const openAlbumModal = (albumKey) => {
      if (!albumModal || !albumGallery || !albumTitle || !albumDesc) return;
      const album = albumConfig[albumKey];
      if (!album) return;

      albumTitle.textContent = album.title;
      albumDesc.textContent = album.description;
      albumGallery.innerHTML = '';

      const fallback = document.createElement('div');
      fallback.className = 'album-modal-empty';
      fallback.textContent = `Upload images to '${album.folder}' named 1.jpg, 2.jpg, etc. to preview them here.`;
      albumGallery.appendChild(fallback);

      const updateFallback = () => {
        const hasImages = albumGallery.querySelectorAll('img').length > 0;
        fallback.style.display = hasImages ? 'none' : 'block';
      };

      for (let i = 1; i <= album.count; i += 1) {
        const img = document.createElement('img');
        img.src = `${album.folder}/${i}.jpg`;
        img.alt = `${album.title} photo ${i}`;
        img.loading = 'lazy';
        img.addEventListener('load', updateFallback);
        img.addEventListener('error', () => {
          img.remove();
          updateFallback();
        });
        albumGallery.appendChild(img);
      }

      albumModal.classList.add('show');
      albumModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeAlbumModal = () => {
      if (!albumModal) return;
      albumModal.classList.remove('show');
      albumModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (albumGallery) albumGallery.innerHTML = '';
    };

    albumButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const albumKey = btn.dataset.album;
        openAlbumModal(albumKey);
      });
    });

    if (albumClose) {
      albumClose.addEventListener('click', closeAlbumModal);
    }

    if (albumModal) {
      albumModal.addEventListener('click', (event) => {
        if (event.target === albumModal) closeAlbumModal();
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && albumModal.classList.contains('show')) {
          closeAlbumModal();
        }
      });
    }
  });

  // Billboard — click-to-play YouTube embed facade
  document.addEventListener('DOMContentLoaded', function() {
    const frame = document.querySelector('#billboard-video');
    if (!frame) return;
    const playBtn = frame.querySelector('.billboard-play');
    const videoId = frame.getAttribute('data-youtube-id');
    if (!playBtn || !videoId) return;

    playBtn.addEventListener('click', function() {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = 'Intro Reel';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'billboard-iframe';
      frame.innerHTML = '';
      frame.appendChild(iframe);
    });
  });

  // Lightbox — fullscreen photo viewer for series-grid images
  // Each .series-grid is its own gallery — prev/next never cross into another series.
  document.addEventListener('DOMContentLoaded', function() {
    const galleries = Array.from(document.querySelectorAll('.series-grid')).map(
      grid => Array.from(grid.querySelectorAll('.work-item img'))
    ).filter(imgs => imgs.length > 0);

    if (galleries.length === 0) return;

    let galleryImgs = [];
    let currentIndex = 0;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#10094;</button>
      <img class="lightbox-img" src="" alt="" />
      <button class="lightbox-nav lightbox-next" aria-label="Next">&#10095;</button>
      <span class="lightbox-counter"></span>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbCounter = lightbox.querySelector('.lightbox-counter');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');

    function showImage(index) {
      currentIndex = (index + galleryImgs.length) % galleryImgs.length;
      const img = galleryImgs[currentIndex];
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lbCounter.textContent = `${currentIndex + 1} / ${galleryImgs.length}`;
    }

    function openLightbox(imgsForThisGallery, index) {
      galleryImgs = imgsForThisGallery;
      showImage(index);
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    }

    galleries.forEach(imgsInGallery => {
      imgsInGallery.forEach((img, i) => {
        img.addEventListener('click', () => openLightbox(imgsInGallery, i));
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => showImage(currentIndex - 1));
    lbNext.addEventListener('click', () => showImage(currentIndex + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('show')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  });

  document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
});