/* ══════════════════════════════════════════════════════
   ШКУРЧЕНКО ДМИТРИЙ — ФОТОГРАФ
   JavaScript — Absolute Core System
══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── CURTAIN INTRO ──────────────────────────────── */
  (function curtainIntro() {
    const el = document.getElementById('curtain-intro');
    if (!el) return;

    const LOGO_APPEAR = 150;   /* лого появляется через, мс */
    const CURTAIN_OPEN = 1100;  /* шторки начинают открываться через, мс (лого видно ~950мс) */
    const TRAN_DURATION = 1400;  /* длительность раскрытия шторок, мс */

    /* Перебиваем CSS-transition динамически */
    el.querySelectorAll('.curtain').forEach(c => {
      c.style.transition = `transform ${TRAN_DURATION}ms cubic-bezier(0.77, 0, 0.18, 1)`;
    });

    setTimeout(() => el.classList.add('logo-visible'), LOGO_APPEAR);
    setTimeout(() => el.classList.add('is-open'), CURTAIN_OPEN);

    const textAt = CURTAIN_OPEN + TRAN_DURATION + 80;
    setTimeout(() => {
      document.querySelectorAll('.hero-clip-line').forEach(line => line.classList.add('is-revealed'));
    }, textAt);

    setTimeout(() => {
      el.style.transition = 'opacity 0.3s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 320);
    }, textAt + 160);
  })();








  const galleries = {
    portraits: ['img/IMG-1.1.jpg', 'img/IMG-1.2.jpg', 'img/IMG-1.3.jpg'],
    subject: ['img/IMG-2.1.jpg', 'img/IMG-2.2.jpg', 'img/IMG-2.3.jpg', 'img/IMG-2.4.jpg'],
    studio: ['img/IMG-3.1.jpg', 'img/IMG-3.2.jpg', 'img/IMG-3.3.jpg', 'img/IMG-3.4.jpg', 'img/IMG-3.5.jpg', 'img/IMG-3.6.jpg'],
    creative: ['img/IMG-4.1.jpg', 'img/IMG-4.2.jpg', 'img/IMG-4.3.jpg', 'img/IMG-4.4.jpg', 'img/IMG-4.5.jpg', 'img/IMG-4.6.jpg']
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

  if (scrollBtn) {
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
  }, {
    threshold: 0.18,
    /* Отрицательный rootMargin снизу: элемент должен оказаться
       на 15% вверх от нижнего края экрана, чтобы анимация виделась */
    rootMargin: '0px 0px -15% 0px',
  });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ─── ПЛАВНЫЙ СКРОЛЛ (АБСОЛЮТНАЯ ТОЧНОСТЬ) ───────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      closeSidebar();

      // Ждем 300мс, пока сайдбар закроется, чтобы не перегружать мобильный рендер
      setTimeout(() => {
        // Динамический отступ под высоту фиксированного хедера (64px мобайл, 80px десктоп)
        const headerOffset = window.innerWidth <= 768 ? 64 : 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 300);
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
    if (!btn) return;
    btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); action(); });
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); action(); }, { passive: false });
  };

  bindModalButton(modalCloseBtn, closeGalleryModal);
  bindModalButton(modalNextBtn, nextImage);
  bindModalButton(modalPrevBtn, prevImage);

  /* Убрали закрытие модалки при клике вне фото */

  let touchStartX = 0, currentX = 0, isDragging = false;
  if (galleryModal) {
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
    if (e) e.preventDefault();
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

  /* ─── SMART CONTACT INPUT (МАСКА + ВАЛИДАЦИЯ) ─────── */
  const smartContactInput = document.getElementById('smart-contact');
  const contactError = document.getElementById('contact-error');

  function showError(msg) {
    if (contactError) { contactError.textContent = msg; contactError.classList.add('visible'); }
    if (smartContactInput) smartContactInput.classList.add('contact-input--error');
  }

  function clearError() {
    if (contactError) { contactError.textContent = ''; contactError.classList.remove('visible'); }
    if (smartContactInput) smartContactInput.classList.remove('contact-input--error');
  }

  /* ТЕЛЕФОН: начинается с +, 7, 8, 9 */
  function isPhoneMode(val) {
    return /^[+789]/.test(val);
  }

  /* Применяем маску +7 (XXX) XXX-XX-XX */
  function applyPhoneMask(raw) {
    /* Оставляем только цифры, максимум 11 */
    let digits = raw.replace(/\D/g, '');

    /* 8 → 7 в начале */
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    /* Принудительно начинаем с 7 */
    if (!digits.startsWith('7')) digits = '7' + digits;

    digits = digits.slice(0, 11);

    const d = digits.split('');
    let mask = '+7';
    if (d.length > 1) mask += ' (' + d.slice(1, 4).join('');
    if (d.length > 3) mask += ')';
    if (d.length > 4) mask += ' ' + d.slice(4, 7).join('');
    if (d.length > 6) mask += '-' + d.slice(7, 9).join('');
    if (d.length > 8) mask += '-' + d.slice(9, 11).join('');

    return mask;
  }

  if (smartContactInput) {
    smartContactInput.addEventListener('keydown', (e) => {
      /* При Backspace в телефонном режиме — стираем цифру, а не разделитель */
      if (e.key !== 'Backspace') return;
      const val = smartContactInput.value;
      if (!isPhoneMode(val)) return;

      e.preventDefault();
      const digits = val.replace(/\D/g, '');
      const trimmed = digits.slice(0, -1);
      smartContactInput.value = trimmed.length > 1
        ? applyPhoneMask(trimmed)
        : (trimmed === '7' ? '' : trimmed);
      clearError();
    });

    smartContactInput.addEventListener('input', () => {
      const val = smartContactInput.value;

      if (isPhoneMode(val)) {
        /* Телефонный режим — маска */
        smartContactInput.maxLength = 18; /* +7 (XXX) XXX-XX-XX = 18 символов */
        const masked = applyPhoneMask(val);
        if (val !== masked) {
          smartContactInput.value = masked;
          /* Ставим курсор в конец */
          smartContactInput.selectionStart = smartContactInput.selectionEnd = masked.length;
        }
      } else {
        /* Текстовый режим (@ / ник / ссылка) */
        smartContactInput.maxLength = 50;
        /* Убираем кириллицу, пробелы и мусор. Оставляем только латиницу, цифры и ссылки. */
        const cleaned = val.replace(/[^a-zA-Z0-9@_.\/\-:]/g, '');
        if (val !== cleaned) smartContactInput.value = cleaned;
      }

      clearError();
    });
  }

  function validateContact(val) {
    if (!val) return 'Укажите контакт для связи';

    if (isPhoneMode(val)) {
      const digits = val.replace(/\D/g, '');
      if (digits.length < 11) return 'Введите корректный номер (минимум 11 цифр)';
    } else {
      // 1. Проверка на кириллицу (контрольный выстрел)
      if (/[а-яё]/i.test(val)) return 'Кириллица запрещена форматом Telegram/VK';

      // 2. Проверка на пробелы
      if (/\s/.test(val)) return 'Ссылки и теги не должны содержать пробелов';

      // 3. Идентификация паттерна
      const isTag = val.startsWith('@');
      const isLink = /t\.me\/|vk\.com\//i.test(val);

      if (!isTag && !isLink) {
        return 'Формат неверный. Укажите номер, @никнейм или ссылку';
      }

      // 4. Очистка от мусора для проверки самого никнейма
      const clean = val.replace(/^[@\/]|https?:\/\/|t\.me\/|vk\.com\//gi, '');

      // 5. Проверка длины (отсекает огрызки типа @a)
      if (clean.length < 3) return 'Слишком короткий никнейм';

      // 6. Защита от странных спецсимволов
      if (/[^a-zA-Z0-9_.\-]/.test(clean)) return 'В никнейме есть недопустимые символы';
    }
    return null;
  }


  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(contactForm);
      const contact = data.get('contact')?.trim() || '';
      const type = data.get('type') || '—';
      const message = data.get('message')?.trim() || 'не указаны';

      /* Валидация контакта */
      const validationError = validateContact(contact);
      if (validationError) { showError(validationError); smartContactInput?.focus(); return; }
      clearError();

      const submitBtn = contactForm.querySelector('.contact-submit');
      const origText = submitBtn.textContent;
      submitBtn.disabled = true;
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
        clearError();
        setTimeout(() => {
          closeContactModal();
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
          }, 400);
        }, 1500);

      } catch (err) {
        console.error('[form send error]', err);
        submitBtn.textContent = 'ОШИБКА!';
        setTimeout(() => {
          submitBtn.disabled = false;
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
    if (btn && answer) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

})();
