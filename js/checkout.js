const checkoutPage = {
  init() {
    const form = document.getElementById('checkoutForm');
    const summary = document.getElementById('checkoutSummary');

    if (!form || !summary) return;

    const renderSummary = () => {
      const items = cartStore.get();
      const subtotal = items.reduce((sum, item) => sum + utils.getProductPrice(item) * item.quantity, 0);
      const tax = subtotal * 0.08;
      const shipping = subtotal > 0 ? 24 : 0;
      const total = subtotal + tax + shipping;
      summary.innerHTML = `
        <div class="summary-line"><span>Items</span><strong>${items.length}</strong></div>
        <div class="summary-line"><span>Subtotal</span><strong>${utils.formatCurrency(subtotal)}</strong></div>
        <div class="summary-line"><span>Tax</span><strong>${utils.formatCurrency(tax)}</strong></div>
        <div class="summary-line"><span>Shipping</span><strong>${utils.formatCurrency(shipping)}</strong></div>
        <div class="summary-line total"><span>Total</span><strong>${utils.formatCurrency(total)}</strong></div>
      `;
    };

    renderSummary();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      cartStore.save([]);
      utils.showToast('Order placed successfully');
      window.location.href = 'index.html';
    });
  },
};

document.addEventListener('DOMContentLoaded', () => checkoutPage.init());
