// Utilities
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const money = n => `$${Number(n).toFixed(2)}`;

const CART_KEY = 'lf_cart';
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const setCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

// Open modal with product details
const modal = $('#productModal');
let activeProduct = null;

function openModal(card){
  activeProduct = {
    id: card.dataset.id,
    name: card.dataset.name,
    price: Number(card.dataset.price),
    image: card.dataset.image,
    desc: card.dataset.desc
  };

  // Fill modal fields
  $('#modalImg').src = activeProduct.image;
  $('#modalImg').alt = activeProduct.name;
  $('#modalTitle').textContent = activeProduct.name;
  $('#modalDesc').textContent = activeProduct.desc;
  $('#modalPrice').textContent = money(activeProduct.price);

  // Quantity select: ONLY 0 or 1 (no extra labels)
  const qtySel = $('#modalQty'); // this is a <select>
  qtySel.innerHTML = `
    <option value="1">1</option>
    <option value="0">0</option>
  `;
  qtySel.value = '1';

  // Disable "Add to Cart" if 0 is selected
  const addBtn = $('#addToCartBtn');
  const updateAddBtnState = () => {
    const q = parseInt(qtySel.value || '0', 10);
    addBtn.disabled = (q === 0);
  };
  qtySel.onchange = updateAddBtnState;
  updateAddBtnState();

  modal.classList.add('active');
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden','true');
  activeProduct = null;
}

$$('.product-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});

// Close modal on overlay / close buttons
$$('[data-close]', modal).forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

// Add to cart
$('#addToCartBtn').addEventListener('click', () => {
  if(!activeProduct) return;

  const qty = parseInt($('#modalQty').value || '0', 10); // 0 or 1
  if (qty <= 0) return; // nothing to add

  const cart = getCart();
  const idx = cart.findIndex(i => i.id === activeProduct.id);

  if(idx > -1){
    cart[idx].qty += qty;
  } else {
    cart.push({ id: activeProduct.id, name: activeProduct.name, price: activeProduct.price, image: activeProduct.image, qty });
  }
  setCart(cart);

  // Quick feedback
  const btn = $('#addToCartBtn');
  const prev = btn.textContent;
  btn.textContent = 'Added!';
  setTimeout(()=>btn.textContent = prev, 900);
});
