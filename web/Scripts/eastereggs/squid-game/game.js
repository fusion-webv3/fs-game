// Set up the game environment
const canvasContainer = document.createElement('div');
canvasContainer.style.position = 'fixed';
canvasContainer.style.top = '0';
canvasContainer.style.left = '0';
canvasContainer.style.width = '100%';
canvasContainer.style.height = '100%';
canvasContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
canvasContainer.style.zIndex = '9999';
canvasContainer.style.transition = 'opacity 2s'; // Apply fade-out transition
document.body.appendChild(canvasContainer);

const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 800;
canvas.style.position = 'absolute';
canvas.style.top = '50%';
canvas.style.left = '50%';
canvas.style.transform = 'translate(-50%, -50%)';
canvasContainer.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Game state
let isGameRunning = false;
let isMoving = false;
let playerSpeed = 0.5;
let gameInterval;
let finishLineY = 200;
let isGameOver = false;
let lightStatus = "green";

const messageDiv = document.createElement('div');
messageDiv.style.position = 'absolute';
messageDiv.style.top = '20px';
messageDiv.style.left = '50%';
messageDiv.style.transform = 'translateX(-50%)';
messageDiv.style.fontSize = '24px';
messageDiv.style.fontWeight = 'bold';
messageDiv.style.color = 'white';
canvasContainer.appendChild(messageDiv);

const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'absolute';
buttonContainer.style.bottom = '50px';
buttonContainer.style.left = '50%';
buttonContainer.style.transform = 'translateX(-50%)';
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '20px';
canvasContainer.appendChild(buttonContainer);

const goButton = document.createElement('img');
goButton.src = 'Scripts/eastereggs/squid-game/img/go_on.png';
goButton.style.width = '100px';
goButton.style.height = '100px';
goButton.style.cursor = 'pointer';
buttonContainer.appendChild(goButton);

const stopButton = document.createElement('img');
stopButton.src = 'Scripts/eastereggs/squid-game/img/stop-off.png';
stopButton.style.width = '100px';
stopButton.style.height = '100px';
stopButton.style.cursor = 'pointer';
buttonContainer.appendChild(stopButton);

const playerImage = new Image();
playerImage.src = 'Scripts/eastereggs/squid-game/img/person-1-back-walk-spritesheet.png';

// Player animation properties
const frameWidth = 37;
const frameHeight = 80;
let currentFrame = 0;
const totalFrames = 19;
let playerY = canvas.height - frameHeight - 100;

const dollForwardImage = new Image();
dollForwardImage.src = 'Scripts/eastereggs/squid-game/img/younghee-turn-front-spritesheet.png';
const dollAwayImage = new Image();
dollAwayImage.src = 'Scripts/eastereggs/squid-game/img/younghee-turn-back-spritesheet.png';

// Guard images (add your guard images here)
const guardLeftImage = new Image();
guardLeftImage.src = 'Scripts/eastereggs/squid-game/img/pink-suit-1.png'; // Example guard image

const guardRightImage = new Image();
guardRightImage.src = 'Scripts/eastereggs/squid-game/img/pink-suit-1.png'; // Example guard image

// Doll animation properties
const dollForwardFrameWidth = 2268 / 9;
const dollAwayFrameWidth = 3275 / 13;
const dollFrameHeight = 240;
const targetDollHeight = 150;
const dollAspectRatio = dollFrameHeight / dollForwardFrameWidth;
const targetDollWidth = targetDollHeight / dollAspectRatio;

let currentDollFrame = 0;
let dollFrameTimer = 0;
const dollFrameDelay = 10;
const dollMaxAwayFrames = 13;
const dollMaxForwardFrames = 9;
let dollAnimating = true;

// Start the game
function startGame() {
    if (isGameRunning) return;

    isGameRunning = true;
    isMoving = false;
    updateMessage("Green light! Go!");

    goButton.addEventListener('click', startMoving);
    stopButton.addEventListener('click', stopMoving);

    gameInterval = setInterval(gameLoop, 1000 / 60);
    setInterval(toggleLight, 3000);
}

// Main game loop (updates every frame)
function gameLoop() {
    if (!isGameRunning || isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawFinishLine();
    drawDoll();

    // Draw player
    ctx.drawImage(playerImage, currentFrame * frameWidth, 0,
        frameWidth, frameHeight,
        canvas.width / 2 - frameWidth / 2, playerY, frameWidth, frameHeight);

    // Draw guards on the sides of the doll
    drawGuards();

    if (playerY <= finishLineY) {
        gameOver("You win!");
    }

    if (lightStatus === "red" && isMoving) {
        gameOver("Game Over! You moved during Red light!");
    }

    if (isMoving && lightStatus === "green") {
        playerY -= playerSpeed;
        currentFrame = (currentFrame + 1) % totalFrames;
    }
}

// Draw finish line
function drawFinishLine() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, finishLineY, canvas.width, 10);
}

// Draw doll (stop at last frame until next animation)
function drawDoll() {
    const xPos = canvas.width / 2 - targetDollWidth / 2;
    const yPos = finishLineY - targetDollHeight - 10;

    if (lightStatus === "red") {
        ctx.drawImage(dollForwardImage, currentDollFrame * dollForwardFrameWidth, 0,
            dollForwardFrameWidth, dollFrameHeight,
            xPos, yPos, targetDollWidth, targetDollHeight);

        // Continue animation until the last frame
        if (currentDollFrame < dollMaxForwardFrames - 1 && dollAnimating) {
            currentDollFrame++;
        } else {
            currentDollFrame = dollMaxForwardFrames - 1;  // Hold at last frame
        }
    } else {
        ctx.drawImage(dollAwayImage, currentDollFrame * dollAwayFrameWidth, 0,
            dollAwayFrameWidth, dollFrameHeight,
            xPos, yPos, targetDollWidth, targetDollHeight);

        // Continue animation until the last frame
        if (currentDollFrame < dollMaxAwayFrames - 1 && dollAnimating) {
            currentDollFrame++;
        } else {
            currentDollFrame = dollMaxAwayFrames - 1;  // Hold at last frame
        }
    }
}

// Draw guards on the sides of the doll
function drawGuards() {
    const dollXPos = canvas.width / 2 - targetDollWidth / 2;
    const dollYPos = finishLineY - targetDollHeight + 150; // Y position of the doll

    const guardOffsetX = 20; // Distance from the doll to the guard's position
    const guardHeight = 90; // Height for the guards
    const guardWidth = 50;  // Width for the guards

    // Draw left guard
    ctx.drawImage(guardLeftImage, dollXPos - guardOffsetX, dollYPos - guardHeight, guardWidth, guardHeight);

    // Draw right guard
    ctx.drawImage(guardRightImage, dollXPos + targetDollWidth + guardOffsetX - guardWidth, dollYPos - guardHeight, guardWidth, guardHeight);
}

// Start moving
function startMoving() {
    if (!isGameRunning || isGameOver) return;
    isMoving = true;
    goButton.src = 'Scripts/eastereggs/squid-game/img/go-off.png';
    stopButton.src = 'Scripts/eastereggs/squid-game/img/stop-on.png';
}

// Stop moving
function stopMoving() {
    isMoving = false;
    goButton.src = 'Scripts/eastereggs/squid-game/img/go_on.png';
    stopButton.src = 'Scripts/eastereggs/squid-game/img/stop-off.png';
}

// Toggle light between red and green
function toggleLight() {
    lightStatus = (lightStatus === "green") ? "red" : "green";
    dollAnimating = true;
    currentDollFrame = 0;

    updateMessage(lightStatus === "green" ? "Green light! Go!" : "Red light! Stop!");
}

// Update message
function updateMessage(text) {
    messageDiv.textContent = text;
}

// Game over function
function gameOver(message) {
    isGameOver = true;
    clearInterval(gameInterval);

    // Continue the doll animation until the last frame and then freeze
    dollAnimating = false;  // Stop further movement
    let maxFrames = (lightStatus === "red") ? dollMaxForwardFrames : dollMaxAwayFrames;
    if (currentDollFrame < maxFrames - 1) {
        dollAnimating = true;  // Continue the doll animation until last frame
    }

    // Show game over message after doll animation completes
    setTimeout(() => {
        updateMessage(message);
        if (message !== "You win!") {
            fadeOutGame();  // Only fade out if the user loses
        } else {
            showWinScreen();  // Show win screen when the player wins
        }
    }, 100);  // Delay for smooth transition
}

// Show win screen in the center
function showWinScreen() {
    // Create a container for the win screen
    const winScreen = document.createElement('div');
    winScreen.style.position = 'absolute';
    winScreen.style.top = '50%';
    winScreen.style.left = '50%';
    winScreen.style.transform = 'translate(-50%, -50%)';
    winScreen.style.textAlign = 'center';
    winScreen.style.fontSize = '36px';
    winScreen.style.fontWeight = 'bold';
    winScreen.style.color = 'white';
    winScreen.textContent = "You Win!";
    
    // Append to canvas container
    canvasContainer.appendChild(winScreen);
    
    // Show confetti
    showConfetti();
}

// Show confetti effect when the player wins
function showConfetti() {
    const confettiParticles = [];
    for (let i = 0; i < 100; i++) {
        confettiParticles.push(createConfettiParticle());
    }

    function createConfettiParticle() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height - canvas.height;
        const size = Math.random() * 5 + 5;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        const speedX = Math.random() * 4 - 2;
        const speedY = Math.random() * 4 + 2;
        return { x, y, size, color, speedX, speedY };
    }

    function drawConfetti() {
        confettiParticles.forEach((particle, index) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.y > canvas.height) {
                confettiParticles.splice(index, 1); // Remove particle when it goes off screen
            }
        });
    }

    // Confetti animation loop
    const confettiInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConfetti();
    }, 1000 / 60);

    // Stop confetti after 5 seconds and fade out
    setTimeout(() => {
        clearInterval(confettiInterval);
        fadeOutGame();  // Fade out after confetti animation is done
    }, 5000);  // Duration of confetti animation
}

// Function to fade out the game content
function fadeOutGame() {
    canvasContainer.style.opacity = '0';  // Fade out the entire game container
    setTimeout(() => {
        canvasContainer.style.display = 'none';  // Optionally hide the game after fade-out
    }, 2000);  // Wait for the fade-out duration before hiding
}

startGame();
