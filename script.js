(() => {
  'use strict';

  /* ==========================================================================
     CANVAS & IMAGE SEQUENCE SCROLL ENGINE
     ========================================================================== */
  const TOTAL_FRAMES = 240;
  const canvas = document.getElementById('animationCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const loaderOverlay = document.getElementById('loaderOverlay');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderProgressBar = document.getElementById('loaderProgressBar');
  const scrollCue = document.getElementById('scrollCue');

  // Preloaded frame storage
  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let isReady = false;

  // Frame resolution & smoothing variables
  let currentFrameIndex = -1;
  let targetProgress = 0;
  let currentProgress = 0;
  let lastTime = performance.now();
  const DAMPING_SPEED = 12; // Exponential smoothing rate for buttery inertia

  function getFrameSrc(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `ezgif-frame-${frameNum}.jpg`;
  }

  // Responsive High-DPI canvas sizing
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (currentFrameIndex >= 0) {
      const img = getLoadedFrame(currentFrameIndex);
      if (img) renderFrame(img);
    }
  }

  // Frame rendering with adaptive orientation framing
  function renderFrame(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Ocean deep navy base
    ctx.fillStyle = '#041c30';
    ctx.fillRect(0, 0, cw, ch);

    const canvasAspect = cw / ch;
    let scale;
    if (canvasAspect < 1.1) {
      // Mobile portrait: contain ensures full turtle swimming path is visible
      scale = Math.min(cw / iw, ch / ih);
    } else {
      // Landscape screens: full-bleed cover framing
      scale = Math.max(cw / iw, ch / ih);
    }

    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // Outward nearest frame fallback (eliminates flickering)
  function getLoadedFrame(index) {
    if (images[index] && images[index].complete && images[index].naturalWidth > 0) {
      return images[index];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = index - offset;
      if (prev >= 0 && images[prev] && images[prev].complete && images[prev].naturalWidth > 0) {
        return images[prev];
      }
      const next = index + offset;
      if (next < TOTAL_FRAMES && images[next] && images[next].complete && images[next].naturalWidth > 0) {
        return images[next];
      }
    }
    return null;
  }

  // Cross-browser scroll tracking
  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function getMaxScroll() {
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    return Math.max(docHeight - window.innerHeight, 1);
  }

  function updateScrollProgress() {
    const scrollTop = getScrollTop();
    const maxScroll = getMaxScroll();
    targetProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

    if (scrollTop > 40) {
      scrollCue.classList.add('hidden');
    } else {
      scrollCue.classList.remove('hidden');
    }
  }

  // Render loop with exponential smoothing
  function animationLoop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    const factor = 1 - Math.exp(-DAMPING_SPEED * dt);
    const delta = targetProgress - currentProgress;

    if (Math.abs(delta) > 0.0001) {
      currentProgress += delta * factor;
    } else {
      currentProgress = targetProgress;
    }

    const nextIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
    );

    if (nextIndex !== currentFrameIndex) {
      currentFrameIndex = nextIndex;
      const img = getLoadedFrame(currentFrameIndex);
      if (img) renderFrame(img);
    }

    requestAnimationFrame(animationLoop);
  }

  // Preloading all 240 frames with off-thread decoding
  function onAllLoaded() {
    if (isReady) return;
    isReady = true;
    loaderOverlay.classList.add('fade-out');
  }

  function startPreloading() {
    resizeCanvas();

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);

      img.onload = () => {
        loadedCount++;

        // Decompress off-thread for stutter-free drawing
        if ('decode' in img) {
          img.decode().catch(() => {}).then(() => {
            if (i === currentFrameIndex) renderFrame(img);
          });
        }

        // Paint frame 0 immediately
        if (i === 0 && currentFrameIndex <= 0) {
          currentFrameIndex = 0;
          renderFrame(img);
        } else if (i === currentFrameIndex) {
          renderFrame(img);
        }

        const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        loaderPercent.textContent = `${percent}%`;
        loaderProgressBar.style.width = `${percent}%`;

        if (loadedCount >= 24 && !isReady) {
          setTimeout(onAllLoaded, 200);
        }
        if (loadedCount >= TOTAL_FRAMES) {
          onAllLoaded();
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= TOTAL_FRAMES) onAllLoaded();
      };

      images[i] = img;
    }

    setTimeout(onAllLoaded, 1500);
  }

  /* ==========================================================================
     REUSABLE CountUpNumber COMPONENT (Phase 9 Master Prompt)
     ========================================================================== */
  function initCountUpNumbers() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const countElements = document.querySelectorAll('.count-up-number');

    if (prefersReducedMotion) {
      countElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        el.textContent = target.toLocaleString();
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const duration = 2000; // 2,000ms animation
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.round(target * easeOut);

          el.textContent = currentVal.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(updateCount);
        obs.unobserve(el); // Animate once per mount
      });
    }, { threshold: 0.25 });

    countElements.forEach(el => observer.observe(el));
  }

  /* ==========================================================================
     MODAL CONTROLS
     ========================================================================== */
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close modal with ESC key or backdrop click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        modal.classList.remove('open');
      });
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* ==========================================================================
     MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mobileDrawer.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     CONTACT FORM WITH FORMSPREE & GMAIL INTEGRATION (Phase 13 Master Prompt)
     Recipient: dinhtanhoang2309@gmail.com
     ========================================================================== */
  const contactForm = document.getElementById('thalavinaContactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const successMsg = document.getElementById('formSuccessMsg');
  const errorMsg = document.getElementById('formErrorMsg');

  // Configurable Formspree Endpoint (Setup documented in README.md)
  // Formspree default form ID placeholder: 'mkgonvze' (can be replaced with user's verified form ID)
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/dinhtanhoang2309';

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous alerts
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';

      // Validation
      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const inquiryInput = document.getElementById('contactInquiry');
      const messageInput = document.getElementById('contactMessage');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        document.getElementById('nameError').textContent = 'Please enter your name.';
        isValid = false;
      } else {
        document.getElementById('nameError').textContent = '';
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        document.getElementById('emailError').textContent = 'Please provide a valid email address.';
        isValid = false;
      } else {
        document.getElementById('emailError').textContent = '';
      }

      // Validate Inquiry Type
      if (!inquiryInput.value) {
        document.getElementById('inquiryError').textContent = 'Please select an inquiry category.';
        isValid = false;
      } else {
        document.getElementById('inquiryError').textContent = '';
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        document.getElementById('messageError').textContent = 'Please write a message.';
        isValid = false;
      } else {
        document.getElementById('messageError').textContent = '';
      }

      if (!isValid) return;

      // Submit State
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      formData.append('_subject', `Thalavina Project Inquiry: ${inquiryInput.value} from ${nameInput.value}`);

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          successMsg.style.display = 'block';
          contactForm.reset();
        } else {
          // If Formspree endpoint is not yet connected by user, show clear helpful guidance
          errorMsg.innerHTML = `Form submission endpoint is in setup mode. Please send your inquiry directly to our coordination inbox at <a href="mailto:dinhtanhoang2309@gmail.com" style="color:#38bdf8;text-decoration:underline;">dinhtanhoang2309@gmail.com</a>.`;
          errorMsg.style.display = 'block';
        }
      } catch (err) {
        errorMsg.innerHTML = `Network issue connecting to form endpoint. You can email us directly at <a href="mailto:dinhtanhoang2309@gmail.com" style="color:#38bdf8;text-decoration:underline;">dinhtanhoang2309@gmail.com</a>.`;
        errorMsg.style.display = 'block';
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
  }

  /* ==========================================================================
     INITIALIZATION & EVENT LISTENERS
     ========================================================================== */
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  resizeCanvas();
  updateScrollProgress();
  currentProgress = targetProgress;

  startPreloading();
  initCountUpNumbers();
  requestAnimationFrame(animationLoop);
})();
