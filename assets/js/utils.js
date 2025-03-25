const USD_TO_INR = 83;

function convertToINR(usdPrice) {
    return Math.round(usdPrice * USD_TO_INR);
}

function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}