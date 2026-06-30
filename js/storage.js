const STORAGE_KEYS = {
  cart: 'atelier-cart',
  wishlist: 'atelier-wishlist',
  theme: 'atelier-theme',
  recentlyViewed: 'atelier-recently-viewed',
};

const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Storage read failed', error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Storage write failed', error);
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

const cartStore = {
  get() {
    return storage.get(STORAGE_KEYS.cart) || [];
  },
  save(items) {
    storage.set(STORAGE_KEYS.cart, items);
  },
  add(product) {
    const items = this.get();
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    this.save(items);
    return items;
  },
  updateQuantity(id, quantity) {
    const items = this.get().map((item) => (item.id === id ? { ...item, quantity } : item)).filter((item) => item.quantity > 0);
    this.save(items);
    return items;
  },
  remove(id) {
    const items = this.get().filter((item) => item.id !== id);
    this.save(items);
    return items;
  },
};

const wishlistStore = {
  get() {
    return storage.get(STORAGE_KEYS.wishlist) || [];
  },
  save(items) {
    storage.set(STORAGE_KEYS.wishlist, items);
  },
  toggle(product) {
    const items = this.get();
    const exists = items.find((item) => item.id === product.id);
    const next = exists ? items.filter((item) => item.id !== product.id) : [...items, product];
    this.save(next);
    return next;
  },
};

const themeStore = {
  get() {
    return storage.get(STORAGE_KEYS.theme) || 'light';
  },
  set(theme) {
    storage.set(STORAGE_KEYS.theme, theme);
  },
};

const recentStore = {
  add(product) {
    const items = this.get().filter((item) => item.id !== product.id);
    items.unshift(product);
    storage.set(STORAGE_KEYS.recentlyViewed, items.slice(0, 6));
    return items.slice(0, 6);
  },
  get() {
    return storage.get(STORAGE_KEYS.recentlyViewed) || [];
  },
};
