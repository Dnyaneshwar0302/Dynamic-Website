const homePage = {
  async init() {
    const featuredContainer = document.getElementById('categoryGrid');
    const trendingContainer = document.getElementById('trendingProducts');
    const arrivalsContainer = document.getElementById('newArrivals');
    const allProductsContainer = document.getElementById('allProducts');
    const recentlyViewedContainer = document.getElementById('recentlyViewed');

    if (!featuredContainer || !trendingContainer || !arrivalsContainer) return;

    const products = await api.fetchProducts();
    appState.products = products;

    if (!products.length) {
      featuredContainer.innerHTML = '<div class="error-card"><h3>Products are temporarily unavailable</h3><p>Please refresh or check your connection.</p></div>';
      trendingContainer.innerHTML = '';
      arrivalsContainer.innerHTML = '';
      return;
    }

    const categories = [...new Set(products.map((product) => product.category))].slice(0, 6);
    featuredContainer.innerHTML = categories
      .map((category) => `
        <a href="product.html?category=${encodeURIComponent(category)}" class="category-card reveal">
          <p class="eyebrow">Featured</p>
          <h3>${category}</h3>
          <p>Fast delivery, trusted brands, and daily deals.</p>
        </a>
      `)
      .join('');

    const renderProducts = (container, items, count = 8) => {
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();
      items.slice(0, count).forEach((product) => {
        const article = utils.createElement('article', 'product-card reveal');
        article.innerHTML = `
          <span class="badge">${product.category}</span>
          <img src="${product.thumbnail}" alt="${product.title}" loading="lazy" />
          <div class="meta">${product.brand}</div>
          <h3>${product.title}</h3>
          <div class="rating">★ ${product.rating}</div>
          <div class="price-row">
            <span class="price">${utils.formatCurrency(utils.getProductPrice(product))}</span>
            <span class="discount">-${Math.round(product.discountPercentage)}%</span>
          </div>
          <div class="stock">${product.stock} left</div>
          <div class="product-actions">
            <button class="primary" data-action="add-to-cart" data-product-id="${product.id}">Add to cart</button>
            <button data-action="toggle-wishlist" data-product-id="${product.id}">♡</button>
            <button data-action="quick-view" data-product-id="${product.id}">Quick view</button>
          </div>
        `;
        fragment.appendChild(article);
      });
      container.appendChild(fragment);
    };

    renderProducts(trendingContainer, [...products].sort((a, b) => b.rating - a.rating), 6);
    renderProducts(arrivalsContainer, [...products].sort((a, b) => b.id - a.id), 6);
    renderProducts(allProductsContainer, products, 12);

    const recentItems = recentStore.get();
    if (recentlyViewedContainer && recentItems.length) {
      const fragment = document.createDocumentFragment();
      recentItems.forEach((product) => {
        const article = utils.createElement('article', 'product-card reveal');
        article.innerHTML = `
          <img src="${product.thumbnail}" alt="${product.title}" loading="lazy" />
          <div class="meta">${product.brand}</div>
          <h3>${product.title}</h3>
          <div class="price-row">
            <span class="price">${utils.formatCurrency(utils.getProductPrice(product))}</span>
            <span class="discount">-${Math.round(product.discountPercentage)}%</span>
          </div>
        `;
        fragment.appendChild(article);
      });
      recentlyViewedContainer.innerHTML = '';
      recentlyViewedContainer.appendChild(fragment);
    } else if (recentlyViewedContainer) {
      recentlyViewedContainer.innerHTML = '<div class="empty-state"><h3>No recent views yet</h3><p>Start browsing and your latest picks will appear here.</p></div>';
    }
  },
};

document.addEventListener('DOMContentLoaded', () => homePage.init());
