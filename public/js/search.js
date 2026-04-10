/* ============================================
   LacLac Jewelry — Search Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Check if Bootstrap is loaded
  if (typeof bootstrap === 'undefined') {
    console.warn('Bootstrap not loaded');
    return;
  }

  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchResults = document.getElementById('searchResults');
  const searchModalElement = document.getElementById('searchModal');

  if (!searchInput || !searchResults || !searchModalElement) {
    console.warn('Search elements not found');
    return;
  }

  // Initialize Bootstrap modal instance
  const searchModal = new bootstrap.Modal(searchModalElement);

  // Handle modal shown event
  searchModalElement.addEventListener('shown.bs.modal', function() {
    // Focus input when modal opens
    setTimeout(() => {
      searchInput.focus();
    }, 100);
    
    // Initialize Fuse.js
    initializeFuse();
  });

  // Handle modal hidden event
  searchModalElement.addEventListener('hidden.bs.modal', function() {
    // Clear search when closing
    searchInput.value = '';
    searchClearBtn.classList.remove('show');
    renderSuggestions();
  });

  // Optimize scroll performance
  let scrollTimeout;
  function handleSearchScroll() {
    searchResults.classList.add('scrolling');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      searchResults.classList.remove('scrolling');
    }, 150);
  }

  // Add passive scroll listener
  searchResults.addEventListener('scroll', handleSearchScroll, { passive: true });

  // Initialize Fuse.js search engines
  let productFuse = null;
  let gemstoneFuse = null;

  function initializeFuse() {
    if (productFuse && gemstoneFuse) return;

    const products = window.LACLAC_PRODUCTS || [];
    const gemstones = window.LACLAC_GEMSTONES || [];

    // Fuse.js options for Vietnamese text
    const fuseOptions = {
      includeScore: true,
      threshold: 0.4, // 0 = perfect match, 1 = match anything
      distance: 100,
      minMatchCharLength: 2,
      keys: [
        { name: 'name', weight: 2 },
        { name: 'collection', weight: 1.5 },
        { name: 'material', weight: 1 },
        { name: 'stone', weight: 1 },
        { name: 'description', weight: 0.5 }
      ]
    };

    const gemstoneOptions = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      keys: [
        { name: 'name', weight: 2 },
        { name: 'tagline', weight: 1.5 },
        { name: 'description', weight: 0.5 }
      ]
    };

    // Initialize Fuse instances
    if (typeof Fuse !== 'undefined') {
      productFuse = new Fuse(products, fuseOptions);
      gemstoneFuse = new Fuse(gemstones, gemstoneOptions);
    }
  }

  // Clear search input
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    searchClearBtn.classList.remove('show');
    renderSuggestions();
  });

  // Show/hide clear button (optimized with RAF)
  let clearBtnRafId;
  searchInput.addEventListener('input', (e) => {
    const hasValue = e.target.value.length > 0;
    
    if (clearBtnRafId) cancelAnimationFrame(clearBtnRafId);
    clearBtnRafId = requestAnimationFrame(() => {
      if (hasValue) {
        searchClearBtn.classList.add('show');
      } else {
        searchClearBtn.classList.remove('show');
      }
    });
  }, { passive: true });

  // Render default suggestions
  function renderSuggestions() {
    searchResults.innerHTML = `
      <div class="search-suggestions">
        <div class="search-suggestions-title">Gợi ý tìm kiếm</div>
        <div class="d-flex flex-wrap gap-2">
          <a href="/#collections" class="search-suggestion-item">Nhẫn kim cương</a>
          <a href="/#collections" class="search-suggestion-item">Dây chuyền moissanite</a>
          <a href="/#collections" class="search-suggestion-item">Bông tai vàng</a>
          <a href="/gemstones" class="search-suggestion-item">Vòng tay tennis</a>
          <a href="/gemstones" class="search-suggestion-item">Kim cương nhân tạo</a>
          <a href="/#collections" class="search-suggestion-item">Bạc S925</a>
        </div>
      </div>
    `;
  }

  // Helper function to render no results
  function renderNoResults(message) {
    searchResults.innerHTML = `
      <div class="search-no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <h3>Không tìm thấy kết quả</h3>
        <p>${message || 'Thử tìm kiếm với từ khóa khác hoặc <a href="/#collections" style="color: var(--gold); text-decoration: underline;">xem toàn bộ bộ sưu tập</a>'}</p>
      </div>
    `;
  }

  // Helper function to render search results
  function renderResults(results) {
    const resultsHTML = `
      <div class="search-suggestions-title mb-3">Tìm thấy ${results.length} kết quả${results.length > 0 && results[0].score ? ' (sắp xếp theo độ liên quan)' : ''}</div>
      <div class="row g-3 g-lg-4">
        ${results.map((item, index) => `
          <div class="col-6 col-md-4 col-lg-3" style="animation: fadeInUp 0.4s ease ${index * 0.05}s both;">
            <a href="${item.url}" class="search-result-card d-block h-100" data-score="${item.score || 0}">
              ${item.image ? `
                <div class="search-result-image-wrapper">
                  <img src="${item.image}" alt="${item.name}" class="search-result-image img-fluid" loading="lazy" decoding="async">
                </div>
              ` : `
                <div class="search-result-image-wrapper">
                  <div class="search-result-placeholder d-flex align-items-center justify-content-center h-100">
                    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="30" stroke="#C9A96E" stroke-width="1.5" fill="none" opacity="0.3"/>
                      <circle cx="50" cy="50" r="20" stroke="#C9A96E" stroke-width="2" fill="none"/>
                      <circle cx="50" cy="50" r="5" fill="#C9A96E" opacity="0.5"/>
                    </svg>
                  </div>
                </div>
              `}
              <div class="search-result-info">
                <div class="search-result-collection">${item.collection}</div>
                <div class="search-result-name">${item.name}</div>
              </div>
            </a>
          </div>
        `).join('')}
      </div>
    `;
    
    // Use RAF for smooth DOM update
    requestAnimationFrame(() => {
      searchResults.innerHTML = resultsHTML;
    });
  }

  // Search products using Fuse.js
  function searchProducts(query) {
    if (!query || query.length < 2) {
      renderSuggestions();
      return;
    }

    // Initialize Fuse if not already done
    initializeFuse();

    if (!productFuse || !gemstoneFuse) {
      // Fallback if Fuse.js not loaded
      renderNoResults('Không thể tìm kiếm lúc này. Vui lòng tải lại trang.');
      return;
    }

    // Perform fuzzy search with Fuse.js
    const productResults = productFuse.search(query, { limit: 10 })
      .map(result => ({
        type: 'product',
        name: result.item.name,
        collection: result.item.collection,
        slug: result.item.slug,
        image: result.item.image,
        url: `/product/${result.item.slug}`,
        score: result.score
      }));

    const gemstoneResults = gemstoneFuse.search(query, { limit: 5 })
      .map(result => ({
        type: 'gemstone',
        name: result.item.name,
        collection: 'Đá Quý',
        slug: result.item.slug,
        image: result.item.image,
        url: `/gemstones#${result.item.slug}`,
        score: result.score
      }));

    // Combine and sort by relevance score
    const results = [...productResults, ...gemstoneResults]
      .sort((a, b) => a.score - b.score) // Lower score = better match
      .slice(0, 12);

    // Render results
    if (results.length === 0) {
      renderNoResults();
    } else {
      renderResults(results);
    }
  }

  // Optimized debounce with RAF
  function debounce(func, wait) {
    let timeout;
    let rafId;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          func(...args);
        });
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Search on input with debounce (200ms - Fuse.js is very fast)
  const debouncedSearch = debounce((query) => {
    searchProducts(query);
  }, 200);

  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  // Initialize with suggestions
  renderSuggestions();
});
