const wishlistPage = {
  init() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    if (!wishlistGrid) return;

    const render = () => {
      const items = wishlistStore.get();
      if (!items.length) {
        wishlistGrid.innerHTML = `
          <div class="empty-state">
            <h3>No favorites yet</h3>
            <p>Save pieces that you love and revisit them anytime.</p>
            <a class="btn btn-primary" href="product.html">Start exploring</a>
          </div>
        `;
        return;
      }

      const fragment = document.createDocumentFragment();
      items.forEach((product) => {
        const article = utils.createElement('article', 'product-card reveal');
        article.innerHTML = `
          <span class="badge">${product.category}</span>
          <img src="${product.thumbnail}" alt="${product.title}" loading="lazy" />
          <div class="meta">${product.brand}</div>
          <h3>${product.title}</h3>
          <div class="price-row">
            <span class="price">${utils.formatCurrency(utils.getProductPrice(product))}</span>
            <span class="discount">-${Math.round(product.discountPercentage)}%</span>
          </div>
          <div class="product-actions">
            <button class="primary" data-action="add-to-cart" data-product-id="${product.id}">Move to cart</button>
            <button data-action="toggle-wishlist" data-product-id="${product.id}">Remove</button>
          </div>
        `;
        fragment.appendChild(article);
      });

      wishlistGrid.innerHTML = '';
      wishlistGrid.appendChild(fragment);
    };

    render();
    window.addEventListener('storage', render);
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action="toggle-wishlist"]');
      if (button) {
        const productId = Number(button.dataset.productId);
        const product = wishlistStore.get().find((item) => item.id === productId);
        if (product) {
          wishlistStore.toggle(product);
          render();
          window.dispatchEvent(new Event('storage'));
          utils.showToast('Removed from wishlist');
        }
      }
    });
  },
};

document.addEventListener('DOMContentLoaded', () => wishlistPage.init());
