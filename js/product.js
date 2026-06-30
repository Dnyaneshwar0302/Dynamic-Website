const productPage = {
  filters: {
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 3000,
    rating: 0,
    availability: 'all',
    search: '',
    sort: 'featured',
  },

  async init() {
    const productGrid = document.getElementById('productGrid');
    const productCount = document.getElementById('productCount');
    const detailSection = document.getElementById('productDetailSection');
    const categoryFilters = document.getElementById('categoryFilters');
    const priceFilters = document.getElementById('priceFilters');
    const ratingFilters = document.getElementById('ratingFilters');
    const availabilityFilters = document.getElementById('availabilityFilters');
    const brandFilters = document.getElementById('brandFilters');
    const sortSelect = document.getElementById('sortSelect');
    const clearFilters = document.getElementById('clearFilters');

    if (!productGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    this.filters.search = urlParams.get('search') || '';
    const selectedBrand = urlParams.get('brand');
    const selectedCategory = urlParams.get('category');
    if (selectedBrand) this.filters.brands = [selectedBrand];
    if (selectedCategory) this.filters.categories = [selectedCategory];
    const productSearchInput = document.getElementById('productSearchInput');
    if (productSearchInput) productSearchInput.value = this.filters.search;

    const products = await api.fetchProducts();
    appState.products = products;
    this.products = products;

    this.renderFilters(products, categoryFilters, brandFilters);
    this.applyUrlFiltersToDom();
    this.renderPriceFilters(priceFilters);
    this.renderRatingFilters(ratingFilters);
    this.renderAvailabilityFilters(availabilityFilters);
    this.renderDetailSection(detailSection, products);
    this.renderProducts(productGrid, productCount);

    const debounced = utils.debounce(() => this.renderProducts(productGrid, productCount), 250);
    const handleFilterChange = () => {
      this.syncFiltersFromDom();
      this.renderProducts(productGrid, productCount);
    };

    document.querySelectorAll('[data-filter="category"]').forEach((checkbox) => checkbox.addEventListener('change', handleFilterChange));
    document.querySelectorAll('[data-filter="brand"]').forEach((checkbox) => checkbox.addEventListener('change', handleFilterChange));
    document.querySelectorAll('[data-filter="price"]').forEach((checkbox) => checkbox.addEventListener('change', handleFilterChange));
    document.querySelectorAll('[data-filter="rating"]').forEach((checkbox) => checkbox.addEventListener('change', handleFilterChange));
    document.querySelectorAll('[data-filter="availability"]').forEach((checkbox) => checkbox.addEventListener('change', handleFilterChange));

    if (sortSelect) {
      sortSelect.addEventListener('change', (event) => {
        this.filters.sort = event.target.value;
        this.renderProducts(productGrid, productCount);
      });
    }

    if (clearFilters) {
      clearFilters.addEventListener('click', () => {
        this.filters = {
          categories: [],
          brands: [],
          minPrice: 0,
          maxPrice: 3000,
          rating: 0,
          availability: 'all',
          search: '',
          sort: 'featured',
        };
        document.querySelectorAll('input[data-filter="category"]').forEach((checkbox) => (checkbox.checked = false));
        document.querySelectorAll('input[data-filter="brand"]').forEach((checkbox) => (checkbox.checked = false));
        document.querySelectorAll('input[name="price"]').forEach((radio) => (radio.checked = false));
        document.querySelectorAll('input[name="rating"]').forEach((radio) => (radio.checked = false));
        document.querySelectorAll('input[name="availability"]').forEach((radio) => (radio.checked = false));
        document.querySelector('input[name="availability"][value="all"]').checked = true;
        if (productSearchInput) productSearchInput.value = '';
        if (sortSelect) sortSelect.value = 'featured';
        this.renderProducts(productGrid, productCount);
      });
    }

    if (productSearchInput) {
      productSearchInput.addEventListener('input', (event) => {
        this.filters.search = event.target.value.trim().toLowerCase();
        debounced();
      });
    }
  },

  applyUrlFiltersToDom() {
    document.querySelectorAll('input[data-filter="category"]').forEach((checkbox) => {
      checkbox.checked = this.filters.categories.includes(checkbox.value);
    });
    document.querySelectorAll('input[data-filter="brand"]').forEach((checkbox) => {
      checkbox.checked = this.filters.brands.includes(checkbox.value);
    });
  },

  renderFilters(products, categoryFilters, brandFilters) {
    const categories = [...new Set(products.map((product) => product.category))];
    const brands = [...new Set(products.map((product) => product.brand))];

    categoryFilters.innerHTML = categories
      .map((category) => `
        <label>
          <input type="checkbox" data-filter="category" value="${category}" />
          ${category}
        </label>
      `)
      .join('');

    brandFilters.innerHTML = brands
      .map((brand) => `
        <label>
          <input type="checkbox" data-filter="brand" value="${brand}" />
          ${brand}
        </label>
      `)
      .join('');
  },

  renderPriceFilters(container) {
    container.innerHTML = `
      <label><input type="radio" name="price" data-filter="price" value="0-100" /> Under $100</label>
      <label><input type="radio" name="price" data-filter="price" value="100-500" /> $100 - $500</label>
      <label><input type="radio" name="price" data-filter="price" value="500-1000" /> $500 - $1000</label>
      <label><input type="radio" name="price" data-filter="price" value="1000-3000" /> $1000+</label>
    `;
  },

  renderRatingFilters(container) {
    container.innerHTML = `
      <label><input type="radio" name="rating" data-filter="rating" value="4" /> 4★ & up</label>
      <label><input type="radio" name="rating" data-filter="rating" value="3" /> 3★ & up</label>
      <label><input type="radio" name="rating" data-filter="rating" value="2" /> 2★ & up</label>
    `;
  },

  renderAvailabilityFilters(container) {
    container.innerHTML = `
      <label><input type="radio" name="availability" data-filter="availability" value="all" checked /> All</label>
      <label><input type="radio" name="availability" data-filter="availability" value="instock" /> In Stock</label>
      <label><input type="radio" name="availability" data-filter="availability" value="soldout" /> Sold Out</label>
    `;
  },

  syncFiltersFromDom() {
    this.filters.categories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked')).map((checkbox) => checkbox.value);
    this.filters.brands = Array.from(document.querySelectorAll('input[data-filter="brand"]:checked')).map((checkbox) => checkbox.value);

    const selectedPrice = document.querySelector('input[name="price"]:checked')?.value;
    if (selectedPrice) {
      const [min, max] = selectedPrice.split('-').map(Number);
      this.filters.minPrice = min;
      this.filters.maxPrice = max;
    } else {
      this.filters.minPrice = 0;
      this.filters.maxPrice = 3000;
    }

    const selectedRating = Number(document.querySelector('input[name="rating"]:checked')?.value || 0);
    this.filters.rating = selectedRating;

    const selectedAvailability = document.querySelector('input[name="availability"]:checked')?.value || 'all';
    this.filters.availability = selectedAvailability;
  },

  getFilteredProducts() {
    const normalized = this.products.filter((product) => {
      const matchesSearch = !this.filters.search || [product.title, product.brand, product.category, product.description]
        .join(' ')
        .toLowerCase()
        .includes(this.filters.search);

      const matchesCategory = this.filters.categories.length === 0 || this.filters.categories.includes(product.category);
      const matchesBrand = this.filters.brands.length === 0 || this.filters.brands.includes(product.brand);
      const price = utils.getProductPrice(product);
      const matchesPrice = this.filters.minPrice <= price && price <= this.filters.maxPrice;
      const matchesRating = product.rating >= this.filters.rating;
      const matchesAvailability = this.filters.availability === 'all' || (this.filters.availability === 'instock' ? product.stock > 0 : product.stock === 0);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesAvailability;
    });

    switch (this.filters.sort) {
      case 'newest':
        return normalized.sort((a, b) => b.id - a.id);
      case 'price-low':
        return normalized.sort((a, b) => utils.getProductPrice(a) - utils.getProductPrice(b));
      case 'price-high':
        return normalized.sort((a, b) => utils.getProductPrice(b) - utils.getProductPrice(a));
      case 'rating':
        return normalized.sort((a, b) => b.rating - a.rating);
      default:
        return normalized;
    }
  },

  renderDetailSection(container, products) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedId = Number(urlParams.get('productId'));
    if (!selectedId || !products.length) {
      if (container) container.classList.add('hidden');
      return;
    }
    const product = products.find((item) => item.id === selectedId);
    if (!product) {
      if (container) container.classList.add('hidden');
      return;
    }

    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `
        <div class="product-detail-grid">
          <img src="${product.thumbnail}" alt="${product.title}" />
          <div>
            <p class="eyebrow">Featured highlight</p>
            <h2>${product.title}</h2>
            <div class="detail-meta">${product.brand} • ${product.category}</div>
            <p>${product.description}</p>
            <div class="detail-price-row">
              <span class="price">${utils.formatCurrency(utils.getProductPrice(product))}</span>
              <span class="discount">-${Math.round(product.discountPercentage)}%</span>
              <span class="rating">★ ${product.rating}</span>
            </div>
            <div class="stock">${product.stock} left • SKU ${product.id}</div>
            <div class="product-actions">
              <button class="primary" data-action="add-to-cart" data-product-id="${product.id}">Add to cart</button>
              <button data-action="toggle-wishlist" data-product-id="${product.id}">Add to wishlist</button>
            </div>
          </div>
        </div>
      `;
    }
  },

  renderProducts(productGrid, productCount) {
    const filteredProducts = this.getFilteredProducts();
    productCount.textContent = `${filteredProducts.length} products found`;

    if (!filteredProducts.length) {
      productGrid.innerHTML = '<div class="empty-state"><h3>No products found</h3><p>Try relaxing the filters or search term.</p></div>';
      return;
    }

    const fragment = document.createDocumentFragment();
    filteredProducts.forEach((product) => {
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

    productGrid.innerHTML = '';
    productGrid.appendChild(fragment);
  },
};

document.addEventListener('DOMContentLoaded', () => productPage.init());
