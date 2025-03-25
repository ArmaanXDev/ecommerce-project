let checkoutItems = [];

async function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueIds = [...new Set(cart)];
    
    try {
        checkoutItems = await Promise.all(
            uniqueIds.map(async (id) => {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                const product = await response.json();
                product.quantity = cart.filter(itemId => itemId === id).length;
                return product;
            })
        );
        displayCheckoutItems();
        updateCheckoutSummary();
    } catch (error) {
        console.error('Error loading checkout items:', error);
    }
}

function displayCheckoutItems() {
    const container = document.getElementById('checkout-items');
    
    container.innerHTML = checkoutItems.map(item => `
        <div class="checkout-item">
            <div class="item-info">
                <span>${item.title}</span>
                <span>x${item.quantity}</span>
            </div>
            <span>${formatINR(convertToINR(item.price * item.quantity))}</span>
        </div>
    `).join('');
}

function updateCheckoutSummary() {
    const subtotal = checkoutItems.reduce((sum, item) => 
        sum + (convertToINR(item.price) * item.quantity), 0);
    const shipping = subtotal > 0 ? 500 : 0;
    const total = subtotal + shipping;

    document.getElementById('checkout-subtotal').textContent = formatINR(subtotal);
    document.getElementById('checkout-shipping').textContent = formatINR(shipping);
    document.getElementById('checkout-total').textContent = formatINR(total);
}

document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const orderData = {
        items: checkoutItems,
        shipping: {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zipCode: document.getElementById('zipCode').value
        },
        payment: {
            cardNumber: document.getElementById('cardNumber').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value
        }
    };

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.removeItem('cart');
        alert('Order placed successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error processing order:', error);
        alert('There was an error processing your order. Please try again.');
    }
});

// Input validation
document.getElementById('cardNumber').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

document.getElementById('expiry').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
});

document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Initialize checkout
loadCheckoutItems();
updateCartCount();