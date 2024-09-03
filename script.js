'use strict';

const STORE_BASE_URL = 'https://fakestoreapi.com';
const CONTAINER = document.querySelector('.container');
const CART = [];

const body = document.querySelector('body');
body.classList.add('mb-0');
body.style.backgroundColor = "grey";

const autorun = async () => {
  const products = await fetchProducts();
  renderProducts(products);
};

const constructUrl = (path) => {
  return `${STORE_BASE_URL}/${path}`;
};

const fetchProducts = async () => {
  const url = constructUrl(`products`);
  const res = await fetch(url);
  return res.json();
};

const fetchProduct = async (productId) => {
  const url = constructUrl(`products/${productId}`);
  const res = await fetch(url);
  return res.json();
};

const productDetails = async (product) => {
  const res = await fetchProduct(product.id);
  renderProduct(res);
};

const renderProducts = (products) => {
  CONTAINER.innerHTML = '';

  const cardRow = document.createElement('div');
  cardRow.classList.add('row');

  products.map((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('col-md-3', 'mb-5', 'd-flex', 'justify-content-center');

    productDiv.innerHTML = `
          <div class="card p-3 shadow bg-dark h-100 d-flex flex-column text-white" style="width: 18rem;">
            <img src="${product.image}" class="card-img-top d-flex align-items-center h-100 product-image rounded-pill bg-white" alt="${product.title} poster" style="width: 100%; max-height: 150px; object-fit: contain;">
            <div class="card-body d-flex flex-column">
              <h6 class="card-title product-title">${product.title}</h6>
              <p class="card-text">${product.description.substring(0, 50)}...</p>
              <p class="card-text">Price: $${product.price.toFixed(2)}</p>
              </div>
              <button class="btn btn-primary fw-bold add-to-cart" data-product-id="${product.id}">Add to Cart</button>
          </div>
          `;

    productDiv.querySelector('.product-image').addEventListener('click', () => {
      productDetails(product);
    });
    productDiv.querySelector('.product-title').addEventListener('click', () => {
      productDetails(product);
    });

    productDiv.querySelector('.add-to-cart').addEventListener('click', () => {
      addToCart(product.id);
    });

    cardRow.appendChild(productDiv);
  });

  CONTAINER.appendChild(cardRow);
};

const renderProduct = (product) => {
  const productDiv = document.createElement('div');
  productDiv.classList.add('col-md-3', 'mb-5', 'd-flex', 'justify-content-center', 'text-white');
  CONTAINER.innerHTML = `
  <div class="card p-3 mb-5 shadow h-100 d-flex flex-row text-white bg-dark" style="min-width: 22rem;">
  <img src="${product.image}" class="card-img-top d-flex align-items-center h-100 product-image rounded-pill bg-white" alt="${product.title} poster" style="width: 100%; max-height: 150px; object-fit: contain;">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description}</p> <p class="card-text">Price: $${product.price.toFixed(2)}</p>
              <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
          </div>`;
  CONTAINER.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product.id);
  });
};

const addToCart = (productId) => {
  fetchProduct(productId).then((product) => {
    const existingProductIndex = CART.findIndex((item) => item.id === productId);

    if (existingProductIndex !== -1) {
      CART[existingProductIndex].quantity += 1;
    } else {
      CART.push({ ...product, quantity: 1 });
    }
    updateCartCount();
  });
};

const updateCartCount = () => {
  const cartCountElement = document.getElementById('cartCount');
  cartCountElement.textContent = CART.length;
};

const filterCategory = (category) => {
  fetchProductsByCategory(category).then((products) => {
    renderProducts(products);
  });
};

const searchProducts = (event) => {
  event.preventDefault();
  const query = document.getElementById('searchInput').value.toLowerCase();
  fetchProducts().then((products) => {
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
  });
};

const filterProducts = (filterType) => {
  fetchProducts().then((products) => {
    let filteredProducts = [];
    if (filterType === 'rating') {
      filteredProducts = products.sort((a, b) => b.rating.rate - a.rating.rate);
    } else if (filterType === 'price') {
      filteredProducts = products.sort((a, b) => a.price - b.price);
    }
    renderProducts(filteredProducts);
  });
};

const fetchProductsByCategory = async (category) => {
  const url = constructUrl(`products/category/${category}`);
  const res = await fetch(url);
  return res.json();
};

document.addEventListener('DOMContentLoaded', () => {
  autorun();

  const navbar = document.createElement('nav');
  navbar.className = 'navbar navbar-expand-lg navbar-light bg-gray pt-0 mt-0';

  navbar.innerHTML = `
     <div class="container-fluid p-2 bg-dark mb-5">
      <a class="navbar-brand text-primary fw-bold" href="/">Ezz Store</a>
      <button class="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse ms-5 " id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <a class="nav-link active text-white fw-bold" aria-current="page" href="/">Home</a>
          <li class="nav-item d-flex align-items-center gap-2 text-muted ms-4">
            <a class="dropdown-item rounded-pill border text-white px-2" href="#" onclick="filterCategory('electronics')">Electronics</a>
            <a class="dropdown-item rounded-pill border text-white px-2" href="#" onclick="filterCategory('jewelery')">Jewelery</a>
            <a class="dropdown-item rounded-pill border text-white px-2" href="#" onclick="filterCategory(&quot;men's clothing&quot;)">Men's Clothing</a>
            <a class="dropdown-item rounded-pill border text-white px-2" href="#" onclick="filterCategory(&quot;women's clothing&quot;)">Women's Clothing</a>
          </li>
        </ul>
        <form class="d-flex" onsubmit="searchProducts(event)">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="searchInput">
          <button class="btn rounded-pill bg-primary text-white" type="submit">Search</button>
        </form>
        <div class="nav-item dropdown ms-3">
          <a class="nav-link dropdown-toggle" href="#" id="filterDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Filter
          </a>
          <ul class="dropdown-menu" aria-labelledby="filterDropdown">
            <li><a class="dropdown-item" href="#" onclick="filterProducts('rating')">Rating</a></li>
            <li><a class="dropdown-item" href="#" onclick="filterProducts('price')">Price</a></li>
          </ul>
        </div>
        <div class="nav-item ms-3">
          <a class="nav-link text-bg-white " href="#" id="cartIcon" onclick="renderCartPage()">Cart <span class="badge text-bg-white " id="cartCount">0</span></a>
        </div>
      </div>
    </div>
  `;

  document.body.insertBefore(navbar, document.body.firstChild);
});

const renderCart = () => {
  const cartModalBody = document.getElementById('cartModalBody');
  cartModalBody.innerHTML = '';

  if (CART.length === 0) {
    cartModalBody.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  CART.map((item) => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('d-flex', 'align-items-center', 'mb-2', 'bg-white', 'text-dark', 'rounded', 'p-2');
    cartItemDiv.innerHTML = `
      <img src="${item.image}" class="cart-item-image" alt="${item.title} poster" style="width: 50px; height: 50px;">
      <div class="ms-3">
        <p class="mb-0">${item.title}</p>
        <p class="mb-0">Price: $${item.price.toFixed(2)}</p>
        <p class="mb-0">Quantity: ${item.quantity}</p>
      </div>
    `;
    cartModalBody.appendChild(cartItemDiv);
  });
};

const renderCartPage = () => {
  const cartPage = document.createElement('div');
  cartPage.classList.add('bg-dark', 'text-white', 'p-5');
  CONTAINER.innerHTML = `
    <div class="cart-page bg-dark text-white">
      <h3>Your Cart</h3>
      <div class="cart-items">
        ${CART.map(item => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" style="max-width: 100px; max-height: 100px;">
            <span>${item.title}</span>
            <span>Quantity: ${item.quantity}</span>
            <span>Price: $${item.price}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};
