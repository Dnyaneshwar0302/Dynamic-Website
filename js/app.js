document.addEventListener('DOMContentLoaded', async () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.remove(), 500);
  }

  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = themeStore.get();
  document.body.classList.toggle('dark', savedTheme === 'dark');
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀';
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      themeStore.set(isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '🌙' : '☀';
      utils.showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });
  }

  const cartCount = document.getElementById('cartCount');
  const wishlistCount = document.getElementById('wishlistCount');
  const modal = document.getElementById('quickViewModal');
  const getProductById = (productId) => {
    return appState.products.find((item) => item.id === productId)
      || cartStore.get().find((item) => item.id === productId)
      || wishlistStore.get().find((item) => item.id === productId)
      || null;
  };
  const updateCounts = () => {
    if (cartCount) cartCount.textContent = cartStore.get().reduce((sum, item) => sum + item.quantity, 0);
    if (wishlistCount) wishlistCount.textContent = wishlistStore.get().length;
  };
  updateCounts();

  const header = document.getElementById('siteHeader');
  const scrollTopButton = document.getElementById('scrollTop');
  const progressBar = document.getElementById('progressBar');
  const menuToggle = document.getElementById('menuToggle');

  const onScroll = () => {
    if (header) header.classList.toggle('shrink', window.scrollY > 20);
    if (scrollTopButton) scrollTopButton.classList.toggle('visible', window.scrollY > 500);
    if (progressBar) progressBar.style.transform = `scaleX(${Math.min(window.scrollY / 500, 1)})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (scrollTopButton) {
    scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const header = document.getElementById('siteHeader');
      if (header) header.classList.toggle('open');
    });
  }

  document.querySelectorAll('.menu-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        document.querySelectorAll('.menu-item').forEach((menu) => menu.classList.remove('active'));
        item.classList.add('active');
      }
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        item.classList.remove('active');
      }
    });

    item.addEventListener('click', (event) => {
      if (window.innerWidth <= 768) {
        event.preventDefault();
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.menu-item').forEach((menu) => menu.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu-item')) {
      document.querySelectorAll('.menu-item').forEach((item) => item.classList.remove('active'));
    }
  });

  const immersiveModes = {
    studio: {
      title: 'Studio Edit',
      text: 'A calm, elevated collection with premium finishes and refined essentials.',
      items: ['Curated bestsellers', 'Thoughtful gifting ideas', 'Fast delivery and support'],
    },
    speed: {
      title: 'Fast Lane',
      text: 'Discover everyday essentials with instant checkout, quick delivery, and smart recommendations.',
      items: ['Lightning-fast dispatch', 'Easy reordering', 'Live order tracking'],
    },
    gift: {
      title: 'Gift Finder',
      text: 'Let the experience help you find thoughtful surprises for every milestone and mood.',
      items: ['Personalized picks', 'Occasion-based ideas', 'Premium wrapping options'],
    },
  };

  document.querySelectorAll('.mode-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.mode-pill').forEach((item) => item.classList.remove('active'));
      pill.classList.add('active');
      const mode = immersiveModes[pill.dataset.mode];
      const title = document.getElementById('spotlightTitle');
      const text = document.getElementById('spotlightText');
      const list = document.getElementById('spotlightList');
      if (title && text && list && mode) {
        title.textContent = mode.title;
        text.textContent = mode.text;
        list.innerHTML = mode.items.map((item) => `<li>${item}</li>`).join('');
      }
    });
  });

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim()) {
        utils.showToast('You are on the list — expect early access soon.');
        newsletterForm.reset();
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('reveal');
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  window.addEventListener('offline', () => utils.showToast('You are offline. Some features may be limited.'));
  window.addEventListener('online', () => utils.showToast('Connection restored.'));

  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput') || document.getElementById('productSearchInput');
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const term = searchInput.value.trim().toLowerCase();
      if (term) {
        window.location.href = `product.html?search=${encodeURIComponent(term)}`;
      }
    });
  }

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = '';
    }
  };

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
  }

  document.addEventListener('click', (event) => {
    const addToCartButton = event.target.closest('[data-action="add-to-cart"]');
    if (addToCartButton) {
      const productId = Number(addToCartButton.dataset.productId);
      const product = getProductById(productId);
      if (product) {
        recentStore.add(product);
        cartStore.add(product);
        updateCounts();
        utils.showToast(`${product.title} added to cart`);
      }
    }

    const wishlistButton = event.target.closest('[data-action="toggle-wishlist"]');
    if (wishlistButton) {
      const productId = Number(wishlistButton.dataset.productId);
      const product = getProductById(productId);
      if (product) {
        recentStore.add(product);
        const nextWishlist = wishlistStore.toggle(product);
        updateCounts();
        const isSaved = nextWishlist.some((item) => item.id === product.id);
        utils.showToast(`${product.title} ${isSaved ? 'saved to' : 'removed from'} wishlist`);
        window.dispatchEvent(new Event('storage'));
      }
    }

    const quickViewButton = event.target.closest('[data-action="quick-view"]');
    if (quickViewButton && modal) {
      const productId = Number(quickViewButton.dataset.productId);
      const product = getProductById(productId);
      if (product) {
        recentStore.add(product);
        modal.innerHTML = `
          <div class="modal-content">
            <button class="icon-btn" id="closeQuickView" aria-label="Close modal">✕</button>
            <div class="product-detail-grid">
              <img src="${product.thumbnail}" alt="${product.title}" />
              <div>
                <p class="eyebrow">Quick view</p>
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <div class="detail-price-row">
                  <span class="price">${utils.formatCurrency(utils.getProductPrice(product))}</span>
                  <span class="discount">-${Math.round(product.discountPercentage)}%</span>
                </div>
                <div class="product-actions">
                  <button class="primary" data-action="add-to-cart" data-product-id="${product.id}">Add to cart</button>
                  <button data-action="toggle-wishlist" data-product-id="${product.id}">Save</button>
                </div>
              </div>
            </div>
          </div>
        `;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('closeQuickView')?.addEventListener('click', closeModal);
      }
    }
  });

  const syncCounts = () => updateCounts();
  window.addEventListener('storage', syncCounts);
  window.addEventListener('focus', syncCounts);
});
