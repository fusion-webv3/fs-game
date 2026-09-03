// --- Optimized Snowflake Particle Effect with iframe Protection --- //

// Create and configure the canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '0';

// Proper canvas resizing (NO CSS scaling)
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const ctx = canvas.getContext('2d');


// -------------------------------
// Iframe Protection
// -------------------------------

function injectIframeProtectionCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .gameIframe {
            position: relative !important;
            z-index: 10 !important;
        }
        .gameIframe-blocker {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 11;
            background: transparent;
        }
    `;
    document.head.appendChild(style);
}

function addIframeBlockers() {
    document.querySelectorAll('.gameIframe').forEach(iframe => {
        const parent = iframe.parentElement;

        if (parent.style.position === '' || parent.style.position === 'static') {
            parent.style.position = 'relative';
        }

        if (!parent.querySelector('.gameIframe-blocker')) {
            const blocker = document.createElement('div');
            blocker.classList.add('gameIframe-blocker');
            parent.appendChild(blocker);
        }
    });
}


// ---------------- Snowflake Logic ---------------- //

// Dynamic flake count (lower for weak devices)
const isLowEnd = window.deviceMemory && window.deviceMemory <= 4;
const numSnowflakes = isLowEnd ? 60 : 150;

class Snowflake {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.radius = Math.random() * 3 + 1;

        // Lighter calculations for smoother performance
        this.speed = (Math.random() * 1 + 0.5) * 0.5;
        this.wind = (Math.random() * 2 - 1) * 0.3;
    }

    update() {
        this.y += this.speed;
        this.x += this.wind;

        if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
            this.reset();
            this.y = 0;
        }
    }
}

const snowflakes = [];
for (let i = 0; i < numSnowflakes; i++) {
    snowflakes.push(new Snowflake());
}

let animationId;
let snowActive = true;

function checkSnowState() {
    const stored = localStorage.getItem('snowActive');
    snowActive = stored !== null ? stored === 'true' : true;

    if (stored === null) {
        localStorage.setItem('snowActive', 'true');
    }
}


// Optimized animation loop (batch draw)
function animate() {
    if (!snowActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for (const flake of snowflakes) {
        flake.update();
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    }

    ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
    ctx.fill();

    animationId = requestAnimationFrame(animate);
}


// Toggle snow with Ctrl+S
function toggleSnow() {
    snowActive = !snowActive;
    localStorage.setItem('snowActive', snowActive);

    if (snowActive) {
        animate();
    } else {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        toggleSnow();
    }
});


// ---------------- Mutation Observer (Throttled) ---------------- //

let iframeCheckTimeout = null;
const observer = new MutationObserver(() => {
    if (!iframeCheckTimeout) {
        iframeCheckTimeout = setTimeout(() => {
            addIframeBlockers();
            iframeCheckTimeout = null;
        }, 150);
    }
});
observer.observe(document.body, { childList: true, subtree: true });


// ---------------- Initialization ---------------- //

document.addEventListener('DOMContentLoaded', () => {
    injectIframeProtectionCSS();
    addIframeBlockers();
    checkSnowState();
    if (snowActive) animate();
});
