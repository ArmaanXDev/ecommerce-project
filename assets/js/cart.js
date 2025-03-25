let cartItems = [];

async function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueIds = [...new Set(cart)];
    
    try {
        cartItems = await Promise.all(
            uniqueIds.map(async (id) => {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                const product = await response.json();
                product.quantity = cart.filter(itemId => itemId === id).length;
                return product;
            })
        );
        displayCart();
        updateSummary();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function displayCart() {
    const container = document.getElementById('cart-items');
    
    if (cartItems.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    container.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
                <h3>${item.title}</h3>
                <p>${formatINR(convertToINR(item.price))}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateSummary() {
    const subtotal = cartItems.reduce((sum, item) => 
        sum + (convertToINR(item.price) * item.quantity), 0);
    const shipping = subtotal > 0 ? 500 : 0;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = formatINR(subtotal);
    document.getElementById('shipping').textContent = formatINR(shipping);
    document.getElementById('total').textContent = formatINR(total);
}

function updateQuantity(id, change) {
    const item = cartItems.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(id);
            return;
        }
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (change > 0) {
            cart.push(id);
        } else {
            const index = cart.indexOf(id);
            if (index > -1) cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        
        displayCart();
        updateSummary();
        updateCartCount();
    }
}

function removeItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(itemId => itemId !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    displayCart();
    updateSummary();
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelector('.cart-count').textContent = cart.length;
}

// Initialize cart
loadCart();
updateCartCount();