/* =====================================================================
   US ❤️ — ANNIVERSARY SITE SCRIPT
   Vanilla JS only. Organized into small, commented modules:
   1. Config        4. Scroll reveal / nav      7. Reasons carousel
   2. Loading screen 5. Joke flip cards          8. Live counter
   3. Particles/hearts 6. Soundtrack player
===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1. CONFIG — edit these to personalize the site
  =================================================================== */

  // 🗓️ Set this to the exact date & time you started dating.
  // Format: new Date('YYYY-MM-DDTHH:MM:SS')
  const START_DATE = new Date('2024-11-27T00:00:00');

  // 💬 Episode 7 — add as many reasons as you like, the carousel loops.
  const REASONS = [
    "Your smile.",
    "Your laugh.",
    "The way you care.",
    "The way you make ordinary days special.",
    "How you remember the tiny things I forget about myself.",
    "Your smelly potty (sometimes)",
    "The way you pronounce your mother tongue",
    "How you can change my mood in a few minutes",
    "How patient you are with everyone",
    "The way you get excited about things you love.",
    "How you say you wanna hit me when you miss me",
    "When you say tell the pilot drive safe",
    "When you try to put a restriction on my samosas, thats not happening.",
    "How you make a house feel like home, even over a phone call.",
    "The way you believe in me more than I do sometimes.",
    "The way you do my dance",
    "How you never let me feel alone in anything.",
    "The way you say ALOT ALOT ALOT ALOT ALOT ALOT ALOT",
    "Every single inside joke we've built together.",
    "The way you comfort me whenever i lose a match or i don't play good",
    "How you always brimg me meatballs (even tho they are not sufficient for me",
    "The look you give me when i ragebait you",
    "The way you say 'Kya hai"",
    "How you are so thoughtful in eveyrthing you do" 
     
  ];

  /* ===================================================================
     2. LOADING SCREEN
     Locks scroll briefly, plays the bar/logo animation, then reveals
     the page. Adjust the timeout to taste.
  =================================================================== */
  const body = document.body;
  const loadingScreen = document.getElementById('loading-screen');
  body.classList.add('is-loading');

  window.setTimeout(() => {
    loadingScreen.classList.add('hidden');
    body.classList.remove('is-loading');
  }, 2600);


  /* ===================================================================
     3. AMBIENT PARTICLES + FLOATING HEARTS
  =================================================================== */

  // --- 3a. Drifting background particles (lightweight canvas) ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      speedY: Math.random() * 0.15 + 0.03,
      speedX: (Math.random() - 0.5) * 0.08,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? '255,255,255' : '229,9,20',
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  // --- 3b. Floating hearts, spawned at a gentle interval forever ---
  const heartsContainer = document.getElementById('floating-hearts');
  const HEART_GLYPHS = ['❤️', '💕', '💗', '💛'];

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)];

    const startX = Math.random() * 100; // vw
    const size = Math.random() * 14 + 14; // px
    const duration = Math.random() * 6 + 8; // seconds
    const drift = (Math.random() - 0.5) * 120; // px horizontal drift

    heart.style.left = `${startX}vw`;
    heart.style.setProperty('--size', `${size}px`);
    heart.style.setProperty('--duration', `${duration}s`);
    heart.style.setProperty('--drift', `${drift}px`);

    heartsContainer.appendChild(heart);
    window.setTimeout(() => heart.remove(), duration * 1000 + 200);
  }

  window.setInterval(spawnHeart, 1100);
  // a few right away so the page doesn't feel empty on load
  for (let i = 0; i < 4; i++) window.setTimeout(spawnHeart, i * 300);


  /* ===================================================================
     4. SCROLL REVEAL + STICKY NAV
  =================================================================== */

  // Fade-in-on-scroll for every element flagged with .fade-in
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach((el) => revealObserver.observe(el));

  // Trigger each episode thumbnail's progress bar once it scrolls into view
  const thumbObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.episode-thumb').forEach((el) => thumbObserver.observe(el));

  // Nav bar gains a glass background once the user scrolls past the hero
  const topNav = document.getElementById('top-nav');
  window.addEventListener('scroll', () => {
    topNav.classList.toggle('scrolled', window.scrollY > 80);
  });

  // "Continue Watching" smooth-scrolls to the first episode
  document.getElementById('continue-watching').addEventListener('click', () => {
    document.getElementById('ep1').scrollIntoView({ behavior: 'smooth' });
  });


  /* ===================================================================
     5. EPISODE 5 — INSIDE JOKE FLIP CARDS
     Works on both hover (desktop, via CSS) and tap (mobile, via JS).
  =================================================================== */
  document.querySelectorAll('.joke-card').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });


  /* ===================================================================
     6. EPISODE 6 — SOUNDTRACK PLAYER
     Plays/pauses the real <audio> element if a src has been set.
     If no src is provided yet, it gracefully simulates playback so the
     equalizer animation still works as a preview.
  =================================================================== */
  const songCards = document.querySelectorAll('.song-card');

  songCards.forEach((card) => {
    const playBtn = card.querySelector('.play-btn');
    const audio = card.querySelector('audio');
    let simulateTimer = null;

    function stopCard() {
      card.classList.remove('playing');
      playBtn.textContent = '▶';
      audio.pause();
      window.clearTimeout(simulateTimer);
    }

    playBtn.addEventListener('click', () => {
      const isPlaying = card.classList.contains('playing');

      // Pause every other song first (only one track plays at a time)
      songCards.forEach((other) => {
        if (other !== card) {
          other.classList.remove('playing');
          other.querySelector('.play-btn').textContent = '▶';
          other.querySelector('audio').pause();
        }
      });

      if (isPlaying) {
        stopCard();
        return;
      }

      card.classList.add('playing');
      playBtn.textContent = '❚❚';

      if (audio.getAttribute('src')) {
        audio.play().catch(() => { /* autoplay restrictions, ignore */ });
        audio.onended = stopCard;
      } else {
        // No real audio file yet — just preview the equalizer animation
        simulateTimer = window.setTimeout(stopCard, 8000);
      }
    });
  });


  /* ===================================================================
     7. EPISODE 7 — "100 REASONS" INTERACTIVE CAROUSEL
  =================================================================== */
  const reasonCard = document.getElementById('reason-card');
  const reasonText = document.getElementById('reason-text');
  const reasonIndexEl = document.getElementById('reason-index');
  const reasonTotalEl = document.getElementById('reason-total');
  const nextReasonBtn = document.getElementById('next-reason');

  let reasonIndex = 0;
  reasonTotalEl.textContent = REASONS.length;

  function showReason(index) {
    reasonCard.classList.add('swap-out');
    window.setTimeout(() => {
      reasonText.textContent = REASONS[index];
      reasonIndexEl.textContent = index + 1;
      reasonCard.classList.remove('swap-out');
      reasonCard.classList.add('swap-in');
      window.setTimeout(() => reasonCard.classList.remove('swap-in'), 420);
    }, 260);
  }

  nextReasonBtn.addEventListener('click', () => {
    reasonIndex = (reasonIndex + 1) % REASONS.length;
    showReason(reasonIndex);
  });


  /* ===================================================================
     8. LIVE "TIME TOGETHER" COUNTER
  =================================================================== */
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function pad(num) { return String(num).padStart(2, '0'); }

  function updateCounter() {
    const now = new Date();
    let diff = Math.max(0, now - START_DATE); // milliseconds since START_DATE

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(4, '0');
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCounter();
  window.setInterval(updateCounter, 1000);

});
