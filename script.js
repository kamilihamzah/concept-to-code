// --- DISCOUNT CONFIGURATION ---
window.DISCOUNT_CONFIG = { 
    quick:   { code: "QUICK20",  usd_percent: 20, inr_percent: 15 },
    kash:    { code: "KASH40",  usd_percent: 40, inr_percent: 30 },  
    iran:    { code: "IRAN786", usd_percent: 60, inr_percent: 50 },
    special: { code: "OFFER5",  usd_percent: 5,  inr_percent: 10 },
    mega:    { code: "FREE100", usd_percent: 0,  inr_percent: 0 },
    Rsb:     { code: "RSB", usd_percent: 95, inr_percent: 95 }
};

// --- THEME TOGGLE ---
const pillTrack = document.getElementById('theme-track-container'); 
const pillIcon = document.getElementById('theme-icon-btn');

if (pillTrack) {
    pillTrack.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        pillIcon.innerText = isDark ? '🌙' : '☀️';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// --- PHASE 1: FIELD TOGGLING & VALIDATION ---

function togglePhase1Fields() {
    const projectType = document.querySelector('input[name="projectType"]:checked').value;
    const reviewBox = document.getElementById('fields-review');
    const scratchBox = document.getElementById('fields-scratch');
    
    // Grab the new message container elements
    const msgContainer = document.getElementById('selection-message-container');
    const msgHeader = document.getElementById('selection-header');
    const msgBody = document.getElementById('selection-body');
    const msgCta = document.getElementById('selection-cta');

    if (msgContainer) msgContainer.classList.remove('hidden');

    if (projectType === 'review') {
        reviewBox.classList.remove('hidden');
        scratchBox.classList.add('hidden');
        
        if(msgHeader) msgHeader.innerText = "Ready for a Performance Audit?";
        if(msgBody) msgBody.innerText = "We will analyze your current site structure, identify bottlenecks, and provide a clear plan for optimization.";
        if(msgCta) msgCta.innerText = "Next Step: Provide your current site details below.";
        
    } else {
        reviewBox.classList.add('hidden');
        scratchBox.classList.remove('hidden');
        
        if(msgHeader) msgHeader.innerText = "Let’s Build Your Vision.";
        if(msgBody) msgBody.innerText = "This path involves gathering your requirements, preferred features, and aesthetic preferences to ensure a high-performance build from the ground up.";
        if(msgCta) msgCta.innerText = "Next Step: Define your project requirements below.";
    }
    
    validatePhase1(); 
}

function validatePhase1() {
    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const projectType = document.querySelector('input[name="projectType"]:checked').value;
    const nextBtn = document.getElementById('next-btn');
    
    let specificFieldValid = false;
    if (projectType === 'review') {
        specificFieldValid = document.getElementById('current-url').value.trim().length > 5;
    } else {
        specificFieldValid = document.getElementById('project-details').value.trim().length > 10;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const formIsValid = (name !== "" && isEmailValid && specificFieldValid);
    if(nextBtn) nextBtn.disabled = !formIsValid;
}

// --- QUICK EMAIL BUTTONS ---
function appendEmailDomain(domain) {
    const emailInput = document.getElementById('client-email');
    let currentText = emailInput.value.trim();
    
    if (currentText.includes('@')) {
        currentText = currentText.split('@')[0];
    }
    
    emailInput.value = currentText + domain;
    validatePhase1(); 
}

// --- DISCOUNT LOGIC ---
function applyDiscount() {
    const isPayPal = !document.getElementById('flow-paypal').classList.contains('hidden');
    const packageSelect = document.getElementById(isPayPal ? 'package-paypal' : 'package-upi');
    const priceDisplay = document.getElementById(isPayPal ? 'final-price-pp' : 'final-price-upi');
    const discountCode = document.getElementById('discount-code').value.trim().toUpperCase();
    
    let basePrice = packageSelect.value ? parseFloat(packageSelect.value) : 0;
    const symbol = isPayPal ? '$' : '₹';

    if (basePrice === 0) {
        priceDisplay.innerHTML = `${symbol}0`;
        return;
    }

    let finalPrice = basePrice;
    let discountApplied = false;

    if (window.DISCOUNT_CONFIG) {
        for (const key in window.DISCOUNT_CONFIG) {
            if (window.DISCOUNT_CONFIG[key].code.toUpperCase() === discountCode) {
                let percent = isPayPal ? window.DISCOUNT_CONFIG[key].usd_percent : window.DISCOUNT_CONFIG[key].inr_percent;
                finalPrice = basePrice - (basePrice * (percent / 100));
                discountApplied = true;
                break;
            }
        }
    }
    
    if (discountApplied) {
        finalPrice = Number.isInteger(finalPrice) ? finalPrice : finalPrice.toFixed(2);
        priceDisplay.innerHTML = `<strike style="color: #888; font-size: 0.85em; margin-right: 8px;">${symbol}${basePrice}</strike> ${symbol}${finalPrice}`;
    } else {
        priceDisplay.innerHTML = `${symbol}${basePrice}`;
    }
}

// --- PAYPAL VALIDATION (Missing Function) ---
function validatePayPal() {
    const btn = document.getElementById('paypal-submit');
    const packageSelect = document.getElementById('package-paypal');
    // Turns the button blue (removes disabled state) if a package is selected
    btn.disabled = (packageSelect.value === "");
}

// --- INITIALIZERS ---
document.addEventListener('DOMContentLoaded', () => {
    // Discount Listener
    const dInput = document.getElementById('discount-code');
    if (dInput) dInput.addEventListener('input', applyDiscount);

    // Slider Logic (Unified)
    const container = document.getElementById('portfolio-container');
    const track = document.getElementById('slider-track');
    
    function getCards() { return document.querySelectorAll('.pcard'); }
    
    if (container && track) {
        let currentIndex = 0;
        let autoSlideInterval;

        function updateSlider() {
            const cards = getCards();
            cards.forEach(card => card.classList.remove('active'));
            const activeCard = cards[currentIndex];
            if (activeCard) {
                activeCard.classList.add('active');
                const offset = (container.offsetWidth / 2) - (activeCard.offsetLeft + (activeCard.offsetWidth / 2));
                track.style.transform = `translateX(${offset}px)`;
            }
        }

        function nextSlide() {
            const cards = getCards();
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        }

        container.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        container.addEventListener('mouseleave', () => autoSlideInterval = setInterval(nextSlide, 3000));
        window.addEventListener('resize', updateSlider);

        setTimeout(() => { updateSlider(); autoSlideInterval = setInterval(nextSlide, 3000); }, 100);
    }
});

function expandForm() {
    const projectType = document.querySelector('input[name="projectType"]:checked').value;
    const paypalSelect = document.getElementById('package-paypal');
    const upiSelect = document.getElementById('package-upi');

    if (projectType === 'review') {
        paypalSelect.innerHTML = `
            <option value="" disabled selected>Select USD Review Package</option>
            <option value="45 - HTML & CSS Audit (100% Improvement)">HTML & CSS Speed Audit - $45</option>
            <option value="25 - WordPress Audit (40-60% Improvement)">WordPress Speed Audit - $25</option>
            <option value="100 - P2P Developer Review">P2P Developer Review - $100</option>
        `;
        upiSelect.innerHTML = `
            <option value="" disabled selected>Select UPI INR Package</option>
            <option value="3800 - HTML & CSS Audit (100% Improvement)">HTML & CSS Speed Audit - ₹3,800</option>
            <option value="2000 - WordPress Audit (40-60% Improvement)">WordPress Speed Audit - ₹2,000</option>
            <option value="8000 - P2P Developer Review">P2P Developer Review - ₹8,000</option>
        `;
    } else {
        paypalSelect.innerHTML = `
            <option value="" disabled selected>Select USD Build Package</option>
            <option value="200 - Custom Build From Scratch">From-Scratch Custom Development - $200</option>
        `;
        upiSelect.innerHTML = `
            <option value="" disabled selected>Select UPI INR Package</option>
            <option value="16500 - Custom Build From Scratch">From-Scratch Custom Development - ₹16,500</option>
        `;
    }

    document.getElementById('phase-1-content').classList.add('hidden');
    document.getElementById('next-btn-container').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
    
    // Hide improvement messages initially
    document.getElementById('improve-message-pp').style.display = 'none';
    document.getElementById('improve-message').style.display = 'none';
    
    if (typeof applyDiscount === 'function') {
        applyDiscount();
    }
}

function updateImprovement() {
    const isPayPal = !document.getElementById('flow-paypal').classList.contains('hidden');
    const selectId = isPayPal ? 'package-paypal' : 'package-upi';
    const msgBoxId = isPayPal ? 'improve-message-pp' : 'improve-message';
    
    const selectedValue = document.getElementById(selectId).value || "";
    const msgBox = document.getElementById(msgBoxId);
    
    if (selectedValue.includes("HTML & CSS")) {
        msgBox.innerHTML = "✨ <strong>Expected Result:</strong> 100% Performance Improvement Guaranteed.";
        msgBox.style.display = "block";
    } else if (selectedValue.includes("WordPress")) {
        msgBox.innerHTML = "🚀 <strong>Expected Result:</strong> 40-60% Performance Improvement.";
        msgBox.style.display = "block";
    } else {
        // Hides the box for "From Scratch" or "P2P Review" where it isn't relevant
        msgBox.style.display = "none"; 
    }
}


function validateUPI() {
    const btn = document.getElementById('upi-submit');
    const isPackageSelected = document.getElementById('package-upi').value !== "";
    const isRefValid = /^\d{12}$/.test(document.getElementById('ref-number').value.trim());
    btn.disabled = !(isPackageSelected && isRefValid);
    btn.classList.toggle('disabled-btn', btn.disabled);
}

// function submitFinalForm() {
//     const email = document.getElementById('client-email').value.trim() || "New Client";
//     const newCard = document.createElement('div');
//     newCard.classList.add('pcard');
//     newCard.innerHTML = `<img src="sample 1.jpeg" alt="New Project"><p>${email}</p>`;
//     document.getElementById('slider-track').appendChild(newCard);
//     alert("Project submitted!");
// }

// --- FORM SUBMISSION LOGIC ---

function submitFinalForm() {
    // Optional: Keep your alert so the user knows it's processing
    //alert("Payment Confirmed! Submitting your project details...");
    
    // This is the magic line that actually sends the email via Web3Forms
    document.getElementById('mainForm').submit();
}

function payWithPayPal() {
    // You can add your PayPal redirection logic here later
    alert("Processing PayPal... Submitting your project details...");
    
    // Submits the form data so you get the email
    document.getElementById('mainForm').submit();
}

function switchPaymentMethod(method) {
    document.getElementById('tab-paypal').classList.toggle('active', method === 'paypal');
    document.getElementById('tab-upi').classList.toggle('active', method !== 'paypal');
    document.getElementById('flow-paypal').classList.toggle('hidden', method !== 'paypal');
    document.getElementById('flow-upi').classList.toggle('hidden', method === 'paypal');
    applyDiscount();
}

function cancelCheckout() {
    // 1. Show Step 1 and hide Step 2
    document.getElementById('phase-1-content').classList.remove('hidden');
    document.getElementById('next-btn-container').classList.remove('hidden');
    document.getElementById('step-2').classList.add('hidden');
    
    // 2. Smoothly scroll back to the top of the form
    window.scrollTo({ top: 350, behavior: 'smooth' });
}