const utils = {
  formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  },

  debounce(fn, delay = 250) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },

  slugify(value) {
    return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  },

  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(utils.toastTimer);
    utils.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  },

  getProductPrice(product) {
    const price = Number(product.price || 0);
    const discount = Number(product.discountPercentage || 0);
    const discounted = price - (price * discount) / 100;
    return Math.round(discounted * 100) / 100;
  },
};

const appState = {
  products: [],
  filters: {},
};
