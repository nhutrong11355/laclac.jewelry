/* ============================================
   LacLac Jewelry — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Header scroll effect ---
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });

  // --- Back to top button ---
  const backToTopBtn = document.getElementById('backToTop');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Add click animation to button
      backToTopBtn.classList.add('clicked');
      setTimeout(() => {
        backToTopBtn.classList.remove('clicked');
      }, 600);
      
      // Smooth scroll animation using requestAnimationFrame
      const startPosition = window.scrollY;
      const duration = 1000; // 1 second
      const startTime = performance.now();
      
      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
      
      function scrollAnimation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition * (1 - easeProgress));
        
        if (progress < 1) {
          requestAnimationFrame(scrollAnimation);
        }
      }
      
      requestAnimationFrame(scrollAnimation);
    });
  }

  // --- Mobile menu toggle ---
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    // Close menu on link click
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });
  }

  // --- Scroll animations (lightweight AOS alternative) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        // Don't unobserve to allow re-animation on scroll back (optional)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
  });

  // --- Collection filter + Load More ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allProductCards = Array.from(document.querySelectorAll('.product-card[data-collection]'));
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const ITEMS_PER_BATCH = 6;
  const INITIAL_ITEMS = 9;
  let currentFilter = 'all';
  let visibleCount = INITIAL_ITEMS;

  function getFilteredCards() {
    if (currentFilter === 'all') return allProductCards;
    return allProductCards.filter(card => card.getAttribute('data-collection') === currentFilter);
  }

  function renderProducts() {
    const filtered = getFilteredCards();
    const toShow = filtered.slice(0, visibleCount);
    const visible = new Set(toShow);

    allProductCards.forEach(card => {
      if (visible.has(card)) {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });

    if (loadMoreBtn) {
      loadMoreBtn.style.display = visibleCount < filtered.length ? '' : 'none';
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += ITEMS_PER_BATCH;
      renderProducts();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      visibleCount = INITIAL_ITEMS;
      renderProducts();
    });
  });

  // Initial render
  if (allProductCards.length > 0) renderProducts();

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Active menu item on scroll (for hash sections) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  function updateActiveMenu() {
    let current = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href.includes('#' + current) || 
          (current === '' && href === '/') ||
          (window.location.pathname !== '/' && href === window.location.pathname)) {
        link.classList.add('active');
      }
    });
  }
  
  // Update on scroll (debounced)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveMenu, 100);
  });
  
  // Initial update
  updateActiveMenu();

  // --- Product thumbnail click (product page) ---
  const thumbs = document.querySelectorAll('.product-thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
});

// Global function for gallery category cards to filter collections
function filterCollection(collection) {
  setTimeout(() => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card[data-collection]');
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-filter') === collection) {
        btn.classList.add('active');
      }
    });
    productCards.forEach(card => {
      if (card.getAttribute('data-collection') === collection) {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }, 500);
}

