/* ══════════════════════════════════════════════════════
   ШКУРЧЕНКО ДМИТРИЙ — ФОТОГРАФ
   JavaScript — Absolute Core System
══════════════════════════════════════════════════════ */

(function () {
  'use strict';


  const galleries = {
    portraits: ['img/IMG-1.1.jpg', 'img/IMG-1.2.jpg', 'img/IMG-1.3.jpg'],
    subject:   ['img/IMG-2.1.jpg', 'img/IMG-2.2.jpg', 'img/IMG-2.3.jpg'],
    studio:    ['img/IMG-3.1.jpg', 'img/IMG-3.2.jpg', 'img/IMG-3.3.jpg', 'img/IMG-3.4.jpg', 'img/IMG-3.5.jpg'],
    creative:  ['img/IMG-4.1.jpg', 'img/IMG-4.2.jpg', 'img/IMG-4.3.jpg', 'img/IMG-4.4.jpg']
  };

  /* ─── ЗАЩИТА ОТ КОНТЕКСТНОГО МЕНЮ ────────────────── */
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.section-gallery') || e.target.closest('.drawer-photo-inner')) {
      e.preventDefault();
      return false;
    }
  }, false);

  /* ─── PAGE TRANSITION ────────────────────────────── */
  const transitionEl = document.createElement('div');
  transitionEl.className = 'page-transition';
  document.body.appendChild(transitionEl);
  setTimeout(() => transitionEl.remove(), 1300);

  /* ─── HEADER SCROLL LOGIC ────────────────────────── */
  const header = document.getElementById('site-header');
  const infoSection = document.getElementById('info');
  let lastScrollHeader = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    let forceShow = false;
    if (infoSection) {
      const rect = infoSection.getBoundingClientRect();
      if (rect.top + rect.height / 2 < window.innerHeight / 2) {
        forceShow = true;
      }
    }

    if (forceShow) {
      header.classList.remove('hidden');
    } else {
      if (currentScroll > lastScrollHeader && currentScroll > 150) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    }
    lastScrollHeader = currentScroll;
  }, { passive: true });

  /* ─── ЛОГИКА БОКОВОГО МЕНЮ И ОВЕРЛЕЯ ─────────────── */
  const menuBtn = document.getElementById('menu-toggle');
  const sideNav = document.getElementById('side-nav');
  const navOverlay = document.getElementById('nav-overlay');

  function closeSidebar() {
    if (sideNav) sideNav.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (menuBtn) {
      const spans = menuBtn.querySelectorAll('span');
      if (spans.length === 3) {
        spans[0].style.transform = 'none'; 
        spans[1].style.opacity = '1'; 
        spans[2].style.transform = 'none';
      }
    }
  }

  function openSidebar() {
    if (sideNav) sideNav.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    if (menuBtn) {
      const spans = menuBtn.querySelectorAll('span');
      if (spans.length === 3) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      }
    }
  }

  function toggleSidebar() {
    if (sideNav && sideNav.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  let hideSidebarTimeout;

  const isTouch = window.matchMedia('(hover: none)').matches;

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleSidebar);
    if (!isTouch) {
      menuBtn.addEventListener('mouseenter', () => {
        clearTimeout(hideSidebarTimeout);
        openSidebar();
      });
      menuBtn.addEventListener('mouseleave', () => {
        hideSidebarTimeout = setTimeout(closeSidebar, 300);
      });
    }
  }

  if (sideNav && !isTouch) {
    sideNav.addEventListener('mouseenter', () => {
      clearTimeout(hideSidebarTimeout);
    });
    sideNav.addEventListener('mouseleave', () => {
      hideSidebarTimeout = setTimeout(closeSidebar, 300);
    });
  }
  
  if (navOverlay) {
    const handleOverlayClose = (e) => {
      e.preventDefault();
      closeSidebar();
    };
    navOverlay.addEventListener('click', handleOverlayClose);
    navOverlay.addEventListener('touchstart', handleOverlayClose, { passive: false });
  }

  /* ─── SCROLL-TOP BUTTON ──────────────────────────── */
  const scrollBtn = document.getElementById('scrollTopBtn');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateScrollBtn() {
    const currentY = window.scrollY;
    const scrollingUp = currentY < lastScrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const isAtBottom = (currentY + winHeight) >= (docHeight - 60);
    
    if (scrollingUp && currentY >= 200 && !isAtBottom) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScrollBtn); ticking = true; }
  }, { passive: true });

  if(scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── HERO REVEALS ──────────────────────────────── */
  const poem = document.querySelector('.hero-poem');
  if (poem) setTimeout(() => poem.classList.add('is-visible'), 1200);
  const coords = document.querySelector('.hero-coords');
  if (coords) setTimeout(() => coords.classList.add('is-visible'), 1400);

  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ─── ПЛАВНЫЙ СКРОЛЛ (ОПТИМИЗИРОВАННЫЙ) ───────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      
      e.preventDefault();
      closeSidebar();

      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50); 
    });
  });

  /* ─── MOBILE AUTHOR REVEAL ───────────────────────── */
  const authorRevealBtn = document.getElementById('author-reveal-btn');
  const authorRevealPhoto = document.getElementById('author-reveal-photo');
  const authorRevealTrack = authorRevealBtn
    ? authorRevealBtn.closest('.author-reveal-mobile').querySelector('.author-reveal-track')
    : null;

  if (authorRevealBtn && authorRevealPhoto && authorRevealTrack) {
    authorRevealBtn.addEventListener('click', () => {
      const isOpen = authorRevealPhoto.classList.contains('is-open');
      if (isOpen) {
        authorRevealPhoto.classList.remove('is-open');
        authorRevealTrack.classList.remove('is-open');
        authorRevealBtn.classList.remove('is-open');
        authorRevealBtn.firstChild.textContent = 'Я тут! ';
      } else {
        authorRevealTrack.classList.add('is-open');
        authorRevealPhoto.classList.add('is-open');
        authorRevealBtn.classList.add('is-open');
        authorRevealBtn.firstChild.textContent = 'Свернуть ';
      }
    });
    /* Текст кнопки в отдельный текстовый узел, чтобы ::after не затирался */
    authorRevealBtn.innerHTML = '<span>Я тут! </span>';
  }

  /* ─── ИНТЕРАКТИВНАЯ ФОТОГРАФИЯ (ШТОРКА) ──────────── */
  const philosophyDrawer = document.getElementById('philosophy-drawer');
  if (philosophyDrawer) {
    philosophyDrawer.addEventListener('click', (e) => {
      e.stopPropagation();
      philosophyDrawer.classList.toggle('is-open');
    });
    
    document.addEventListener('click', (e) => {
      if (!philosophyDrawer.contains(e.target) && philosophyDrawer.classList.contains('is-open')) {
        philosophyDrawer.classList.remove('is-open');
      }
    });
  }

  /* ─── MODAL GALLERY С КИНЕТИЧЕСКИМ СВАЙПОМ ───────── */
  const galleryModal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCounter = document.getElementById('modal-counter');
  let currentGallery = [];
  let currentIndex = 0;

  function openGalleryModal(category) {
    currentGallery = galleries[category];
    if (!currentGallery) return;
    currentIndex = 0;
    updateModalImage(0);
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
  }

  function closeGalleryModal() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = ''; 
  }

  function updateModalImage(direction = 0) {
    modalImg.style.transition = 'none';
    modalImg.style.opacity = '0';
    if (direction === 1) modalImg.style.transform = 'translateX(100px)';
    else if (direction === -1) modalImg.style.transform = 'translateX(-100px)';
    
    modalImg.src = currentGallery[currentIndex];
    modalCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

    modalImg.onload = () => {
      requestAnimationFrame(() => {
        modalImg.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
        modalImg.style.transform = 'translateX(0)';
        modalImg.style.opacity = '1';
      });
    };
  }

  function nextImage() { currentIndex = (currentIndex + 1) % currentGallery.length; updateModalImage(1); }
  function prevImage() { currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateModalImage(-1); }

  document.querySelectorAll('.gallery-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = btn.dataset.category || btn.id.replace('btn-', '');
      if (galleries[category]) { e.preventDefault(); openGalleryModal(category); }
    });
  });

  const modalCloseBtn = document.getElementById('modal-close');
  const modalNextBtn = document.getElementById('modal-next');
  const modalPrevBtn = document.getElementById('modal-prev');

  const bindModalButton = (btn, action) => {
    if(!btn) return;
    btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); action(); });
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); action(); }, { passive: false });
  };

  bindModalButton(modalCloseBtn, closeGalleryModal);
  bindModalButton(modalNextBtn, nextImage);
  bindModalButton(modalPrevBtn, prevImage);

  /* Убрали закрытие модалки при клике вне фото */

  let touchStartX = 0, currentX = 0, isDragging = false;
  if(galleryModal) {
    galleryModal.addEventListener('touchstart', (e) => {
      if (e.target.closest('.modal-nav') || e.target.closest('.modal-close')) return;
      touchStartX = e.touches[0].clientX; isDragging = true;
      modalImg.style.transition = 'none'; 
    }, { passive: true });

    galleryModal.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX - touchStartX;
      modalImg.style.transform = `translateX(${currentX}px)`;
      modalImg.style.opacity = 1 - (Math.abs(currentX) / window.innerWidth);
    }, { passive: true });

    galleryModal.addEventListener('touchend', () => {
      if (!isDragging) return; isDragging = false;
      if (currentX < -50) { modalImg.style.transform = 'translateX(-100vw)'; setTimeout(nextImage, 300); }
      else if (currentX > 50) { modalImg.style.transform = 'translateX(100vw)'; setTimeout(prevImage, 300); }
      else { modalImg.style.transform = 'translateX(0)'; modalImg.style.opacity = '1'; }
      currentX = 0;
    }, { passive: true });
  }

  /* ─── CONTACT FORM MODAL ─────────────────────────── */
  const contactModal = document.getElementById('contact-modal');
  const btnContact = document.getElementById('btn-contact');
  const contactClose = document.getElementById('contact-close');
  const contactForm = document.getElementById('contact-form');

  function openContactModal(e) {
    if(e) e.preventDefault();
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeContactModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnContact) btnContact.addEventListener('click', openContactModal);
  if (contactClose) contactClose.addEventListener('click', closeContactModal);

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeContactModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (galleryModal && galleryModal.classList.contains('active')) closeGalleryModal();
      if (contactModal && contactModal.classList.contains('active')) closeContactModal();
    }
    if (galleryModal && galleryModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data    = new FormData(contactForm);
      const contact = data.get('contact')?.trim() || '—';
      const type    = data.get('type')  || '—';
      const message = data.get('message')?.trim() || 'не указаны';

      const submitBtn = contactForm.querySelector('.contact-submit');
      const origText  = submitBtn.textContent;
      submitBtn.disabled    = true;
      submitBtn.textContent = 'ОТПРАВКА...';

      try {
        const res = await fetch('/.netlify/functions/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact, type, message }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        submitBtn.textContent = 'ОТПРАВЛЕНО!';
        contactForm.reset();
        setTimeout(() => {
          closeContactModal();
          setTimeout(() => {
            submitBtn.disabled    = false;
            submitBtn.textContent = origText;
          }, 400);
        }, 1500);

      } catch (err) {
        console.error('[form send error]', err);
        submitBtn.textContent = 'ОШИБКА!';
        setTimeout(() => {
          submitBtn.disabled    = false;
          submitBtn.textContent = origText;
        }, 2000);
      }
    });
  }

  /* ─── SCROLL INDICATOR FADE ───────────────────────── */
  const scrollIndicator = document.getElementById('scrollIndicator');
  window.addEventListener('scroll', () => {
    if (scrollIndicator) {
      if (window.scrollY > 50) {
        scrollIndicator.classList.add('hidden');
      } else {
        scrollIndicator.classList.remove('hidden');
      }
    }
  }, { passive: true });

  /* ─── HERO PARALLAX (PC ONLY) ─────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  const isParallaxAllowed = !isTouch && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (heroBg && isParallaxAllowed) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      /* Игнорируем синтетические mousemove от touch-событий */
      if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const updateParallax = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      const heroInner = document.querySelector('.hero-inner');
      if (heroInner) {
        heroInner.style.transform = `translate(${currentX * -15}px, ${currentY * -15}px)`;
      }

      requestAnimationFrame(updateParallax);
    };
    updateParallax();
  }

  /* ─── FAQ ACCORDION ───────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    if(btn && answer) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if(otherAnswer) otherAnswer.style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

})();
