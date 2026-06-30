const cartPage = {
  async init() {
    const cartItems = document.getElementById('cartItems');
    const subtotal = document.getElementById('subtotal');
    const tax = document.getElementById('tax');
    const shipping = document.getElementById('shipping');
    const grandTotal = document.getElementById('grandTotal');

    if (!cartItems) return;

    const render = () => {
      const items = cartStore.get();
      if (!items.length) {
        cartItems.innerHTML = `
          <div class="empty-state">
            <h3>Your cart feels light</h3>
            <p>Browse the collection and add a few favorites.</p>
            <a class="btn btn-primary" href="product.html">Continue Shopping</a>
          </div>
        `;
        if (subtotal) subtotal.textContent = '$0.00';
        if (tax) tax.textContent = '$0.00';
        if (shipping) shipping.textContent = '$0.00';
        if (grandTotal) grandTotal.textContent = '$0.00';
        return;
      }

      const fragment = document.createDocumentFragment();
      let total = 0;

      items.forEach((item) => {
        const price = utils.getProductPrice(item);
        total += price * item.quantity;
        const card = utils.createElement('article', 'cart-item');
        card.innerHTML = `
          <img src="${item.thumbnail}" alt="${item.title}" />
          <div>
            <h3>${item.title}</h3>
            <p>${item.brand}</p>
            <div class="qty-controls">
              <button data-action="decrease" data-product-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-product-id="${item.id}">+</button>
            </div>
          </div>
          <div>
            <strong>${utils.formatCurrency(price * item.quantity)}</strong>
            <button class="btn btn-secondary" data-action="remove" data-product-id="${item.id}">Remove</button>
          </div>
        `;
        fragment.appendChild(card);
      });

      cartItems.innerHTML = '';
      cartItems.appendChild(fragment);

      const taxValue = total * 0.08;
      const shippingValue = total > 0 ? 24 : 0;
      const grand = total + taxValue + shippingValue;
      if (subtotal) subtotal.textContent = utils.formatCurrency(total);
      if (tax) tax.textContent = utils.formatCurrency(taxValue);
      if (shipping) shipping.textContent = utils.formatCurrency(shippingValue);
      if (grandTotal) grandTotal.textContent = utils.formatCurrency(grand);
    };

    render();

    cartItems.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      const productId = Number(button.dataset.productId);
      const action = button.dataset.action;
      if (action === 'increase') {
        cartStore.updateQuantity(productId, cartStore.get().find((item) => item.id === productId)?.quantity + 1);
      } else if (action === 'decrease') {
        cartStore.updateQuantity(productId, Math.max(0, cartStore.get().find((item) => item.id === productId)?.quantity - 1));
      } else if (action === 'remove') {
        cartStore.remove(productId);
      }
      render();
      window.dispatchEvent(new Event('storage'));
      utils.showToast('Cart updated');
    });
  },
};

document.addEventListener('DOMContentLoaded', () => cartPage.init());
