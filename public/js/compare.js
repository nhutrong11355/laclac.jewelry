/* ============================================
   Product Comparison JavaScript
   ============================================ */

class ProductCompare {
  constructor() {
    this.maxProducts = 3;
    this.compareProducts = this.loadFromStorage();
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
      const compareBtn = e.target.closest('.product-compare-btn');
      if (compareBtn) {
        console.log('Compare button clicked!', compareBtn);
        e.preventDefault();
        e.stopPropagation();
        const productId = parseInt(compareBtn.dataset.productId);
        const productSlug = compareBtn.dataset.productSlug;
        const productName = compareBtn.dataset.productName;
        const productImage = compareBtn.dataset.productImage;
        console.log('Product data:', { productId, productSlug, productName, productImage });
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
    this.compareProducts.push(product);
    this.saveToStorage();
    this.renderCompareBar();
    this.updateCompareButtons();
    this.toggleCompareBar();
    this.showNotification('Đã thêm sản phẩm vào danh sách so sánh', 'success');
  }

  removeProduct(productId) {
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

    const itemsHTML = this.compareProducts.map(product => `
      <div class="compare-bar-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="compare-bar-item-info">
          <p class="compare-bar-item-name">${product.name}</p>
        </div>
        <button class="compare-bar-item-remove" data-product-id="${product.id}">&times;</button>
      </div>
    `).join('');

    compareBar.innerHTML = `
      <div class="compare-bar-content">
        <h3 class="compare-bar-title">So sánh sản phẩm (${this.compareProducts.length}/${this.maxProducts})</h3>
        <div class="compare-bar-items">
          ${itemsHTML}
        </div>
        <div class="compare-bar-actions">
          <button class="compare-clear-btn">Xóa tất cả</button>
          <button class="compare-btn" ${this.compareProducts.length < 2 ? 'disabled' : ''}>
            So sánh ngay
          </button>
        </div>
      </div>
    `;
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
    const buttons = document.querySelectorAll('.product-compare-btn');
    buttons.forEach(btn => {
      const productId = parseInt(btn.dataset.productId);
      const isInCompare = this.compareProducts.some(p => p.id === productId);
      
      if (isInCompare) {
        btn.classList.add('active');
        btn.title = 'Xóa khỏi so sánh';
      } else {
        btn.classList.remove('active');
        btn.title = 'Thêm vào so sánh';
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
  console.log('Compare.js loaded - initializing ProductCompare...');
  window.productCompare = new ProductCompare();
  console.log('ProductCompare initialized:', window.productCompare);
});
