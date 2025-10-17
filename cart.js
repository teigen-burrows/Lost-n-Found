const CART_KEY = 'lf_cart';
const money = n => `$${Number(n).toFixed(2)}`;
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const setCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

const itemsEl = document.getElementById('cartItems');
const countEl = document.getElementById('sumCount');
const subEl = document.getElementById('sumSubtotal');
const emptyMsg = document.getElementById('emptyMsg');
const clearBtn = document.getElementById('clearCart');

function render(){
  const cart = getCart();
  itemsEl.innerHTML = '';

  if(cart.length === 0){
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
  }

  let subtotal = 0;
  let totalQty = 0;

  cart.forEach((it, i) => {
    subtotal += it.price * it.qty;
    totalQty += it.qty;

    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <img src="${it.image}" alt="${it.name}">
      <div>
        <div class="title">${it.name}</div>
        <div class="controls">
          <label>Qty
            <input class="qty" type="number" min="1" value="${it.qty}" data-idx="${i}">
          </label>
          <button class="remove" data-idx="${i}">Remove</button>
        </div>
      </div>
      <div class="price">${money(it.price * it.qty)}</div>
    `;
    itemsEl.appendChild(row);
  });

  countEl.textContent = totalQty;
  subEl.textContent = money(subtotal);
}

// Handle qty change / remove
itemsEl.addEventListener('input', (e) => {
  if(e.target.matches('.qty')){
    const idx = Number(e.target.dataset.idx);
    const val = Math.max(1, parseInt(e.target.value || '1', 10));
    const cart = getCart();
    cart[idx].qty = val;
    setCart(cart);
    render();
  }
});
itemsEl.addEventListener('click', (e) => {
  if(e.target.matches('.remove')){
    const idx = Number(e.target.dataset.idx);
    const cart = getCart();
    cart.splice(idx, 1);
    setCart(cart);
    render();
  }
});

clearBtn.addEventListener('click', () => {
  localStorage.setItem(CART_KEY, '[]');
  render();
});

// Initial render
render();
