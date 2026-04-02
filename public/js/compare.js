/* ============================================
   Product Comparison JavaScript
   ============================================ */

class ProductCompare {
  constructor() {
    this.maxProducts = 3;
    this.compareProducts = this.loadFromStorage();
    this.pendingAnimation = null;
    this.init();
  }

  init() {
    this.renderCompareBar();
    this.updateCompareButtons();
    this.setupEventListeners();
    
    // Update compare bar visibility
    this.toggleCompareBar();
  }

  setupEventListeners() {
    // Listen for compare button clicks
    document.addEventListener('click', (e) => {
      const compareBtn = e.target.closest('.product-compare-btn, .btn-icon[data-product-id]');
      if (compareBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = parseInt(compareBtn.dataset.productId);
        const productSlug = compareBtn.dataset.productSlug;
        const productName = compareBtn.dataset.productName;
        const productImage = compareBtn.dataset.productImage;
        this.toggleProduct({
          id: productId,
          slug: productSlug,
          name: productName,
          image: productImage
        });
      }
    });

    // Listen for remove from compare bar
    document.addEventListener('click', (e) => {
      if (e.target.closest('.compare-bar-item-remove')) {
        const productId = parseInt(e.target.closest('.compare-bar-item-remove').dataset.productId);
        this.removeProduct(productId);
      }
    });

    // Listen for clear all
    document.addEventListener('click', (e) => {
      if (e.target.closest('.compare-clear-btn')) {
        e.preventDefault();
        this.clearAll();
      }
    });

    // Listen for compare button click
    document.addEventListener('click', (e) => {
      const compareBtn = e.target.closest('.compare-btn');
      if (compareBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if button is disabled
        if (compareBtn.disabled || compareBtn.hasAttribute('disabled')) {
          console.log('Compare button is disabled');
          this.showNotification('Vui lòng chọn ít nhất 2 sản phẩm để so sánh', 'warning');
          return;
        }
        
        if (this.compareProducts.length < 2) {
          console.log('Not enough products to compare');
          this.showNotification('Vui lòng chọn ít nhất 2 sản phẩm để so sánh', 'warning');
          return;
        }
        
        console.log('Compare button clicked! Products:', this.compareProducts);
        const productIds = this.compareProducts.map(p => p.id).join(',');
        console.log('Redirecting to:', `/compare?ids=${productIds}`);
        window.location.href = `/compare?ids=${productIds}`;
      }
    });

    // Listen for remove from comparison page
    document.addEventListener('click', (e) => {
      if (e.target.closest('.compare-remove-product')) {
        const productId = parseInt(e.target.closest('.compare-remove-product').dataset.productId);
        this.removeProduct(productId);
        window.location.reload(); // Reload to update comparison table
      }
    });
  }

  toggleProduct(product) {
    const index = this.compareProducts.findIndex(p => p.id === product.id);
    
    if (index > -1) {
      // Remove product
      this.removeProduct(product.id);
    } else {
      // Add product
      if (this.compareProducts.length >= this.maxProducts) {
        this.showNotification(`Bạn chỉ có thể so sánh tối đa ${this.maxProducts} sản phẩm!`, 'warning');
        return;
      }
      this.addProduct(product);
    }
  }

  addProduct(product) {
    this.pendingAnimation = { type: 'add', addedId: product.id };
    this.compareProducts.push(product);
    this.saveToStorage();
    this.renderCompareBar();
    this.updateCompareButtons();
    this.toggleCompareBar();
    this.showNotification('Đã thêm sản phẩm vào danh sách so sánh', 'success');
  }

  removeProduct(productId) {
    this.pendingAnimation = null;
    this.compareProducts = this.compareProducts.filter(p => p.id !== productId);
    this.saveToStorage();
    this.renderCompareBar();
    this.updateCompareButtons();
    this.toggleCompareBar();
    this.showNotification('Đã xóa sản phẩm khỏi danh sách so sánh', 'info');
  }

  clearAll() {
    if (this.compareProducts.length === 0) return;
    
    // Clear all products directly
    this.pendingAnimation = null;
    this.compareProducts = [];
    this.saveToStorage();
    this.renderCompareBar();
    this.updateCompareButtons();
    this.toggleCompareBar();
    this.showNotification('Đã xóa tất cả sản phẩm khỏi danh sách so sánh', 'info');
  }

  renderCompareBar() {
    let compareBar = document.querySelector('.compare-bar');
    
    if (!compareBar) {
      compareBar = document.createElement('div');
      compareBar.className = 'compare-bar';
      document.body.appendChild(compareBar);
    }

    const itemColsClass = this.compareProducts.length <= 1
      ? 'row-cols-1'
      : this.compareProducts.length === 2
        ? 'row-cols-2'
        : 'row-cols-3';
    const canCompareNow = this.compareProducts.length >= 2;

    const isAddAnimation = this.pendingAnimation && this.pendingAnimation.type === 'add';
    const addedId = isAddAnimation ? this.pendingAnimation.addedId : null;

    const itemsHTML = this.compareProducts.map((product, index) => {
      let motionClass = '';
      let delay = 0;

      if (isAddAnimation) {
        if (this.compareProducts.length > 1) {
          if (product.id === addedId) {
            motionClass = 'compare-enter-rtl';
            delay = 120;
          } else {
            // Animate existing items from right to left.
            motionClass = 'compare-shrink-rtl';
            delay = (this.compareProducts.length - 2 - index) * 85;
          }
        } else if (product.id === addedId) {
          motionClass = 'compare-enter-rtl';
        }
      }

      return `
      <div class="col">
        <div class="compare-bar-item ${motionClass} d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded-3 border border-warning-subtle px-2 py-2 h-100 w-100" style="--compare-delay: ${delay}ms;">
          <img src="${product.image}" alt="${product.name}" class="rounded-2 flex-shrink-0" width="40" height="40" style="object-fit: cover;">
          <div class="flex-grow-1 min-w-0">
            <p class="compare-bar-item-name text-white small fw-medium mb-0">${product.name}</p>
          </div>
          <button type="button" class="compare-bar-item-remove btn btn-link text-white p-0 lh-1 flex-shrink-0" data-product-id="${product.id}" aria-label="Xóa ${product.name} khỏi so sánh">&times;</button>
        </div>
      </div>
    `;
    }).join('');

    compareBar.innerHTML = `
      <div class="compare-bar-inner container-fluid container-xl py-3 position-relative">
        <button type="button" class="compare-clear-btn" aria-label="Đóng thanh so sánh" title="Đóng">&times;</button>
        <div class="d-flex flex-column align-items-center gap-3">
          <div>
            ${canCompareNow
              ? `<button type="button" class="compare-summary-btn compare-summary-ready compare-btn">So sánh sản phẩm (${this.compareProducts.length}/${this.maxProducts})</button>`
              : `<div class="compare-summary-btn compare-summary-idle">So sánh sản phẩm (${this.compareProducts.length}/${this.maxProducts})</div>`}
          </div>
          <div class="compare-bar-items row ${itemColsClass} g-2 m-0 justify-content-center w-100">
            ${itemsHTML}
          </div>
        </div>
      </div>
    `;

    this.pendingAnimation = null;
  }

  toggleCompareBar() {
    const compareBar = document.querySelector('.compare-bar');
    if (compareBar) {
      if (this.compareProducts.length > 0) {
        compareBar.classList.add('active');
      } else {
        compareBar.classList.remove('active');
      }
    }
  }

  updateCompareButtons() {
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const buttons = document.querySelectorAll('.product-compare-btn, .btn-icon[data-product-id]');
    buttons.forEach(btn => {
      const productId = parseInt(btn.dataset.productId);
      const isInCompare = this.compareProducts.some(p => p.id === productId);
      const productName = btn.dataset.productName || 'sản phẩm';
      const card = btn.closest('.card');
      const cardBody = card ? card.querySelector('.card-body') : null;
      
      if (isInCompare) {
        btn.classList.remove('btn-light', 'text-dark');
        btn.classList.add('is-active-compare', 'text-white');
        btn.title = 'Xóa khỏi so sánh';
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', `Xóa ${productName} khỏi so sánh`);

        // Mobile selected state: highlight card using Bootstrap utilities only.
        if (isTouchDevice && card) {
          card.classList.remove('shadow-sm', 'border-0');
          card.classList.add('shadow', 'border', 'border-warning-subtle', 'compare-selected');
        }
        if (isTouchDevice && cardBody) {
          cardBody.classList.add('bg-warning-subtle');
        }
      } else {
        btn.classList.remove('is-active-compare', 'text-white');
        btn.classList.add('btn-light', 'text-dark');
        btn.title = 'Thêm vào so sánh';
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', `Thêm ${productName} vào so sánh`);

        if (isTouchDevice && card) {
          card.classList.remove('shadow', 'border', 'border-warning-subtle', 'compare-selected');
          card.classList.add('shadow-sm', 'border-0');
        }
        if (isTouchDevice && cardBody) {
          cardBody.classList.remove('bg-warning-subtle');
        }
      }
    });
  }

  saveToStorage() {
    try {
      localStorage.setItem('compareProducts', JSON.stringify(this.compareProducts));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('compareProducts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading from localStorage:', e);
      return [];
    }
  }

  showNotification(message, type = 'info') {
    // Skip toast on mobile/touch devices per UX request.
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchDevice) {
      return;
    }

    // Remove existing notification
    const existing = document.querySelector('.compare-notification');
    if (existing) {
      existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `compare-notification compare-notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '20px',
      background: type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : '#C9A96E',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: '10000',
      animation: 'slideInRight 0.3s ease',
      maxWidth: '300px',
      fontSize: '0.9rem',
      fontWeight: '500'
    });

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  getCompareProducts() {
    return this.compareProducts;
  }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.productCompare = new ProductCompare();
});
