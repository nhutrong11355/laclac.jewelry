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
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
  });

  // --- Collection filter + Pagination ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allProductCards = Array.from(document.querySelectorAll('.product-card[data-collection]'));
  const paginationEl = document.getElementById('pagination');
  const ITEMS_PER_PAGE = 9;
  let currentFilter = 'all';
  let currentPage = 1;

  function getFilteredCards() {
    if (currentFilter === 'all') return allProductCards;
    return allProductCards.filter(card => card.getAttribute('data-collection') === currentFilter);
  }

  function renderPage() {
    const filtered = getFilteredCards();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const visible = new Set(filtered.slice(start, end));

    allProductCards.forEach(card => {
      if (visible.has(card)) {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!paginationEl) return;
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    let html = '';
    html += '<button class="page-btn page-prev' + (currentPage === 1 ? ' disabled' : '') + '" data-page="prev">&laquo;</button>';
    for (let i = 1; i <= totalPages; i++) {
      html += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    html += '<button class="page-btn page-next' + (currentPage === totalPages ? ' disabled' : '') + '" data-page="next">&raquo;</button>';
    paginationEl.innerHTML = html;

    paginationEl.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-page');
        if (page === 'prev' && currentPage > 1) currentPage--;
        else if (page === 'next' && currentPage < totalPages) currentPage++;
        else if (page !== 'prev' && page !== 'next') currentPage = parseInt(page);
        renderPage();
        const collectionsSection = document.getElementById('collections');
        if (collectionsSection) {
          const headerHeight = header ? header.offsetHeight : 0;
          const top = collectionsSection.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      currentPage = 1;
      renderPage();
    });
  });

  // Initial render
  if (allProductCards.length > 0) renderPage();

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
