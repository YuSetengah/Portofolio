'use strict';


const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX=0,mouseY=0,followerX=0,followerY=0;

if (cursor) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX+'px'; cursor.style.top = mouseY+'px';
  });
  (function animateFollower(){
    followerX += (mouseX-followerX)*0.12;
    followerY += (mouseY-followerY)*0.12;
    cursorFollower.style.left = followerX+'px';
    cursorFollower.style.top  = followerY+'px';
    requestAnimationFrame(animateFollower);
  })();
  document.addEventListener('mouseleave',()=>{ cursor.style.opacity='0'; cursorFollower.style.opacity='0'; });
  document.addEventListener('mouseenter',()=>{ cursor.style.opacity='1'; cursorFollower.style.opacity='1'; });
}


const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}


const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  let menuOpen = false;
  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = menuOpen ? 'translateY(7px) rotate(45deg)'  : '';
    spans[1].style.transform = menuOpen ? 'translateY(-0.5px) rotate(-45deg)' : '';
  }
  menuBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => { if(menuOpen) toggleMenu(); }));
  document.addEventListener('keydown', e => { if(e.key==='Escape'&&menuOpen) toggleMenu(); });
}

const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = (idx * 0.07) + 's';
  revealObs.observe(el);
});


document.querySelectorAll('.counter-num[data-target]').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.unobserve(el);
    const target = parseInt(el.dataset.target, 10);
    const start  = performance.now();
    const dur    = 1600;
    (function tick(now){
      const p = Math.min((now-start)/dur, 1);
      const e2 = 1-Math.pow(1-p,3);
      el.textContent = Math.round(e2*target);
      if(p<1) requestAnimationFrame(tick);
      else el.textContent = target;
    })(start);
  }, { threshold: 0.5 });
  obs.observe(el);
});


document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const tx = ((e.clientY-r.top)/r.height - .5) * 4;
    const ty = -((e.clientX-r.left)/r.width - .5) * 4;
    card.style.transform = `perspective(800px) rotateX(${tx}deg) rotateY(${ty}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94)';
    card.style.transform  = '';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});


document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});


const mt = document.querySelector('.marquee-track');
if(mt){
  mt.addEventListener('mouseenter',()=>mt.style.animationPlayState='paused');
  mt.addEventListener('mouseleave',()=>mt.style.animationPlayState='running');
}


const heroName = document.querySelector('.hero-name');
if(heroName){
  heroName.addEventListener('mouseenter',()=>{
    let n=0;
    const iv = setInterval(()=>{
      heroName.style.letterSpacing=(Math.random()*.1+.02)+'em';
      heroName.style.transform=`translateX(${(Math.random()-.5)*4}px)`;
      if(++n>6){ clearInterval(iv); heroName.style.letterSpacing=''; heroName.style.transform=''; }
    },55);
  });
}


window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');

 
  if (document.documentElement.classList.contains('light-mode-pre')) {
    document.body.classList.add('light-mode');
    document.documentElement.classList.remove('light-mode-pre');
  
    const icon  = document.querySelector('.theme-toggle-icon');
    const label = document.querySelector('.theme-toggle-label');
    if (icon)  icon.textContent  = '◐';
    if (label) label.textContent = 'Dark';
  }

  if (loader) {

    const minDelay = 900;
    const start = performance.now();
    const hide = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minDelay - elapsed);
      setTimeout(() => {
        loader.classList.add('hidden');
    
        document.querySelectorAll('.hero .reveal, .proj-hero .reveal').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), 100 + i * 90);
        });
      }, wait);
    };
    hide();
  } else {
   
    document.querySelectorAll('.proj-hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 90);
    });
  }
});


function initUploadSlots() {
  document.querySelectorAll('.upload-slot').forEach(slot => {
    const input = slot.querySelector('input[type="file"]');
    if (!input) return;


    slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(slot, file);
    });

    input.addEventListener('change', () => {
      if (input.files[0]) handleFile(slot, input.files[0]);
    });
  });


  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const slot = btn.closest('.upload-slot');
      const prev = slot.querySelector('.preview-img');
      if (prev) prev.remove();
      const ph   = slot.querySelector('.upload-placeholder');
      if (ph)   ph.style.display = '';
      const inp  = slot.querySelector('input[type="file"]');
      if (inp)  inp.value = '';
    });
  });
}

function handleFile(slot, file) {
  if (!file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = ev => {
    let img = slot.querySelector('.preview-img');
    if (!img) {
      img = document.createElement('img');
      img.className = 'preview-img';
      slot.querySelector('.upload-slot-inner').prepend(img);
    }
    img.src = ev.target.result;
    const ph = slot.querySelector('.upload-placeholder');
    if (ph) ph.style.display = 'none';
  };
  reader.readAsDataURL(file);
}


function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  if (!lb) return;


  if (!lb.querySelector('.lightbox-nav')) {
    lb.insertAdjacentHTML('beforeend', `
      <button class="lightbox-nav prev" id="lbPrev" aria-label="Sebelumnya">&#8592;</button>
      <button class="lightbox-nav next" id="lbNext" aria-label="Berikutnya">&#8594;</button>
      <div class="lightbox-counter" id="lbCounter"></div>
    `);
  }

  const lbPrev    = lb.querySelector('.lightbox-nav.prev');
  const lbNext    = lb.querySelector('.lightbox-nav.next');
  const lbCounter = lb.querySelector('.lightbox-counter');

  const items = Array.from(document.querySelectorAll('.gallery-item[data-src]'));
  let current = 0;

  function showAt(idx) {
    current = (idx + items.length) % items.length;
    
    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.97)';
    setTimeout(() => {
      lbImg.src = items[current].dataset.src;
      lbImg.onload = () => {
        lbImg.style.opacity = '1';
        lbImg.style.transform = 'scale(1)';
      };
    }, 150);
    if (lbCounter) lbCounter.textContent = `${current + 1} / ${items.length}`;

    const showNav = items.length > 1;
    if (lbPrev) lbPrev.style.display = showNav ? '' : 'none';
    if (lbNext) lbNext.style.display = showNav ? '' : 'none';
    if (lbCounter) lbCounter.style.display = showNav ? '' : 'none';
  }

  function openLB(idx) {
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  
    lbImg.style.transition = 'opacity .2s ease, transform .2s ease';
    showAt(idx);
  }

  function closeLB() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLB(i));
  });

  if (lbClose)  lbClose.addEventListener('click', closeLB);
  if (lbPrev)   lbPrev.addEventListener('click',  e => { e.stopPropagation(); showAt(current - 1); });
  if (lbNext)   lbNext.addEventListener('click',  e => { e.stopPropagation(); showAt(current + 1); });

  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLB();
    if (e.key === 'ArrowLeft')   showAt(current - 1);
    if (e.key === 'ArrowRight')  showAt(current + 1);
  });
}


function initGSAPAnimations() {
  
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

 
  document.querySelectorAll('.upload-zones .slot-wrapper').forEach((el, i) => {
    gsap.fromTo(el,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.08, 
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          
        }
      }
    );
  });


  document.querySelectorAll('.gallery-grid .gallery-item').forEach((el, i) => {
    gsap.fromTo(el,
      {
        opacity: 0,
        y: 50,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        delay: i * 0.06,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });


  document.querySelectorAll('.upload-section-title').forEach(el => {
    gsap.fromTo(el,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });


  document.querySelectorAll('.gallery-title').forEach(el => {
    gsap.fromTo(el,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });


  document.querySelectorAll('.proj-desc-row').forEach(el => {
    gsap.fromTo(el,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

}


document.addEventListener('DOMContentLoaded', () => {
  initUploadSlots();
  initLightbox();
  initThemeToggle();
  setTimeout(initGSAPAnimations, 200);
});


function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const icon  = btn.querySelector('.theme-toggle-icon');
  const label = btn.querySelector('.theme-toggle-label');

  // Sinkron UI tombol dengan state body saat ini
  function syncUI() {
    const isLight = document.body.classList.contains('light-mode');
    if (icon)  icon.textContent  = isLight ? '◐' : '◑';
    if (label) label.textContent = isLight ? 'Dark' : 'Light';
  }


  syncUI();

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    isLight ? applyDark() : applyLight();
  });

  function applyLight() {
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    syncUI();
  }

  function applyDark() {
    document.body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    syncUI();
  }
}