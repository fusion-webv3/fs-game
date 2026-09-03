(() => {
  // Only show once
  if (localStorage.getItem('whatsNewSeen')) return;
  localStorage.setItem('whatsNewSeen', 'true');

  const icon = document.querySelector('.bx.bx-conversation.icon');

  // --- Create flashing circle ---
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '100000';
  document.body.appendChild(canvas);

  icon.style.position = icon.style.position || 'relative';
  icon.style.zIndex = '100001';

  const ctx = canvas.getContext('2d');
  let visible = true;

  function updateCanvasPosition() {
    const rect = icon.getBoundingClientRect();
    canvas.width = rect.width + 10;
    canvas.height = rect.height + 10;
    canvas.style.left = (rect.left - 5 + window.scrollX) + 'px';
    canvas.style.top = (rect.top - 5 + window.scrollY) + 'px';
  }

  function drawCircle() {
    updateCanvasPosition();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (visible) {
      const radius = Math.max(canvas.width, canvas.height) / 2;
      ctx.strokeStyle = '#ff4500';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const flashInterval = setInterval(() => {
    visible = !visible;
    drawCircle();
  }, 500);

  // Update circle position on scroll or resize
  window.addEventListener('scroll', drawCircle);
  window.addEventListener('resize', drawCircle);

  // --- Discord-style overlay ---
  const style = document.createElement("style");
  style.innerHTML = `
    .whatsnew-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
    }
    .whatsnew-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .whatsnew-popup {
      background: #000;
      color: #fff;
      width: 90%;
      max-width: 460px;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      transform: scale(0.85);
      opacity: 0;
      transition: transform 0.35s ease, opacity 0.35s ease;
      box-shadow: 0 25px 70px rgba(0,0,0,0.9);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      position: relative;
    }
    .whatsnew-overlay.show .whatsnew-popup {
      transform: scale(1);
      opacity: 1;
    }
    .whatsnew-popup h2 {
      margin: 0 0 14px;
      font-size: 22px;
    }
    .whatsnew-popup p {
      font-size: 14.5px;
      color: #ccc;
      line-height: 1.55;
      margin-bottom: 22px;
    }
    .whatsnew-popup button {
      display: inline-block;
      background: #5865F2;
      color: #fff;
      padding: 12px 22px;
      border-radius: 10px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.15s ease;
    }
    .whatsnew-popup button:hover {
      background: #4752c4;
      transform: translateY(-1px);
    }
    .whatsnew-close {
      position: absolute;
      top: 14px;
      right: 16px;
      font-size: 22px;
      cursor: pointer;
      color: #888;
    }
    .whatsnew-close:hover {
      color: #fff;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'whatsnew-overlay';
  overlay.innerHTML = `
    <div class="whatsnew-popup">
      <div class="whatsnew-close">&times;</div>
      <h2>What's New</h2>
      <p>There's a new <strong>global chat</strong> available for FUSION! Check it out and start chatting with everyone.</p>
      <button>Got it</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const showOverlay = () => overlay.classList.add('show');
  const hideOverlay = () => {
    overlay.classList.remove('show');
    clearInterval(flashInterval);
    canvas.remove();
    overlay.remove();
    icon.style.zIndex = '';
    window.removeEventListener('scroll', drawCircle);
    window.removeEventListener('resize', drawCircle);
  };

  overlay.querySelector('.whatsnew-close').onclick = hideOverlay;
  overlay.querySelector('button').onclick = hideOverlay;
  overlay.onclick = (e) => {
    if (e.target === overlay) hideOverlay();
  };

  setTimeout(showOverlay, 500);
})();
