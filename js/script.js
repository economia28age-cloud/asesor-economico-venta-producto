/* ==================================================
   ESTADO GLOBAL
   Datos compartidos por todas las páginas
================================================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
/* ==================================================
   FIN ESTADO GLOBAL
================================================== */


/* ==================================================
   MODO OSCURO
   Lógica persistente de tema
================================================== */
const themeToggle = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}
/* ==================================================
   FIN MODO OSCURO
================================================== */


/* ==================================================
   BASE DE DATOS: PRODUCTOS
================================================== */
let products = [
  {
    name: "Vela de Sándalo y Cedro",
    price: 24.99,
    images: ["https://i.pinimg.com/1200x/5e/b8/4a/5eb84acec8f111bc1f1e9b65261c2976.jpg"],
    category: "velas",
    desc: "Aroma cálido y envolvente."
  },
  {
    name: "Vela de Lavanda Relajante",
    price: 24.99,
    images: ["https://i.pinimg.com/736x/57/1a/31/571a313824842ee15e5c33cf61c6d6d5.jpg"],
    category: "velas",
    desc: "Calma la mente y el cuerpo."
  },
  {
    name: "Vela Cítrica de Verano",
    price: 22.99,
    images: ["img/img1.jpeg", "img/img8.jpeg", "img/img9.jpeg"],
    category: "velas",
    desc: "Fresca y energizante."
  },
  {
    name: "Vela de Canela Especiada",
    price: 22.99,
    images: ["img/img2.jpeg"],
    category: "velas",
    desc: "Aroma intenso y acogedor."
  },
  {
    name: "Anillo de Hueso “Luna”",
    price: 45.00,
    images: ["img/img3.jpeg"],
    category: "anillos"
  },
  {
    name: "Anillo Minimalista",
    price: 35.00,
    images: ["img/img4.jpeg"],
    category: "anillos"
  },
  {
    name: "Anillo Geométrico",
    price: 49.99,
    images: ["img/img6.jpeg"],
    category: "anillos"
  },
  {
    name: "Anillo Turquesa",
    price: 55.00,
    images: ["img/img7.jpeg"],
    category: "anillos"
  }
];
/* ==================================================
   FIN BASE DE DATOS
================================================== */


/* ==================================================
   LÓGICA: HOME / INDEX
   Espacio para funciones exclusivas de la bienvenida
================================================== */
// Agrega aquí funciones para banners o animaciones del index
/* ==================================================
   FIN LÓGICA: HOME
================================================== */


/* ==================================================
   LÓGICA: SERVICIOS
   Espacio para funciones de asesoría financiera
================================================== */
// Agrega aquí funciones para calculadoras o formularios de economía
/* ==================================================
   FIN LÓGICA: SERVICIOS
================================================== */


/* ==================================================
   TIENDA: ELEMENTOS DOM Y RENDER
================================================== */
const cartBtn = document.querySelector(".cart-btn");
const cartElement = document.getElementById("cart");
const closeBtn = document.querySelector(".close-cart");
const whatsappBtn = document.querySelector(".whatsapp-btn");

function renderProducts() {
  const velas = document.querySelector("#velas .grid");
  const anillos = document.querySelector("#anillos .grid");

  if (!velas || !anillos) return; // Seguridad: Si no existen, salimos.

  velas.innerHTML = "";
  anillos.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      ${p.desc ? `<p>${p.desc}</p>` : ""}
      <span class="price">$${p.price}</span>
      <button>Agregar al carrito</button>
    `;

    card.querySelector("button").onclick = () => addToCart(p.name, p.price);
    card.querySelector("img").onclick = () => openLightbox(p.images, 0);

    if (p.category === "velas") velas.appendChild(card);
    if (p.category === "anillos") anillos.appendChild(card);
  });
}
/* ==================================================
   FIN TIENDA: RENDER
================================================== */


/* ==================================================
   SISTEMA: CARRITO
================================================== */
if (cartBtn) cartBtn.onclick = () => cartElement.classList.toggle("open");
if (closeBtn) closeBtn.onclick = () => cartElement.classList.remove("open");

function addToCart(name, price) {
  const item = cart.find(p => p.name === name);
  item ? item.qty++ : cart.push({ name, price, qty: 1 });
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
  const items = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart");
  if (!items) return;

  items.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    if (emptyMsg) emptyMsg.style.display = "block";
    document.getElementById("cart-total").textContent = "0.00";
    document.getElementById("cart-count").textContent = "0";
    return;
  }

  if (emptyMsg) emptyMsg.style.display = "none";

  cart.forEach((p, i) => {
    const subtotal = p.price * p.qty;
    total += subtotal;
    items.innerHTML += `
      <li>
        <strong>${p.name}</strong><br>
        $${p.price} x ${p.qty} = $${subtotal.toFixed(2)}<br>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="changeQty(${i},-1)">−</button>
        <button onclick="removeItem(${i})">❌</button>
      </li>
    `;
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent = cart.reduce((s, p) => s + p.qty, 0);
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
  updateCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
  const msg = document.getElementById("cart-msg");
  if (msg) {
    msg.textContent = "Carrito vacío 🗑️";
    msg.style.display = "block";
    setTimeout(() => msg.style.display = "none", 1200);
  }
}

const clearCartBtn = document.querySelector(".clear-cart");
if (clearCartBtn) clearCartBtn.onclick = (e) => { e.stopPropagation(); clearCart(); };

function sendWhatsApp() {
  if (cart.length === 0) { alert("El carrito está vacío"); return; }
  let mensaje = `Hola,\nQuiero realizar el siguiente pedido:\n\n`;
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    mensaje += `${item.name}\nCantidad: ${item.qty}\nSubtotal: $${subtotal.toFixed(2)}\n\n`;
  });
  mensaje += `Total: $${total.toFixed(2)}\n\nGracias.`;
  window.open(`https://wa.me/5212321134388?text=${encodeURIComponent(mensaje)}`, "_blank");
}
if (whatsappBtn) whatsappBtn.onclick = sendWhatsApp;
/* ==================================================
   FIN SISTEMA: CARRITO
================================================== */


/* ==================================================
   COMPONENTE: LIGHTBOX PRO
================================================== */
const lightbox = document.getElementById("lightbox");
let currentImages = [];
let currentIndex = 0;
let startX = 0;

function openLightbox(images, index = 0) {
  if (!lightbox) return;
  const img = lightbox.querySelector("img");
  currentImages = images;
  currentIndex = index;
  img.classList.remove("zoomed");
  img.src = currentImages[currentIndex];
  lightbox.classList.remove("hidden");
}

if (lightbox) {
  const img = lightbox.querySelector("img");
  const closeL = document.querySelector(".close");
  const nextL = lightbox.querySelector(".next");
  const prevL = lightbox.querySelector(".prev");

  closeL.onclick = () => lightbox.classList.add("hidden");
  lightbox.onclick = () => lightbox.classList.add("hidden");
  img.onclick = (e) => { e.stopPropagation(); img.classList.toggle("zoomed"); };

  const changeImg = (dir) => {
    currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
    img.classList.remove("zoomed");
    img.src = currentImages[currentIndex];
  };

  nextL.onclick = (e) => { e.stopPropagation(); changeImg(1); };
  prevL.onclick = (e) => { e.stopPropagation(); changeImg(-1); };

  img.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
  img.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeImg(diff > 0 ? 1 : -1);
  });
}
/* ==================================================
   FIN COMPONENTE: LIGHTBOX
================================================== */


/* ==================================================
   INICIALIZACIÓN (INIT)
================================================== */
renderProducts();
updateCart();
/* ==================================================
   FIN INICIALIZACIÓN
================================================== */