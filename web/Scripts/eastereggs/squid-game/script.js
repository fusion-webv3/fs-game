document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-box-input');

    searchBox.addEventListener('input', function() {
        if (searchBox.value.toLowerCase() === 'squid game') {
            showButton();
        } else {
            removeButton();
        }
    });

    function showButton() {
        if (!document.querySelector('.squid-game-button')) {
            const button = document.createElement('img');
            button.classList.add('squid-game-button');
            button.src = 'Scripts/eastereggs/squid-game/img/invitation.gif';
            button.alt = 'Squid Game Button';
            button.style.position = 'fixed';
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
            button.style.cursor = 'pointer';
            button.style.bottom = '20px';  // Starting position
            button.style.animation = 'moveUpDown 2s ease-in-out infinite'; // Animation to be added
            button.style.animationName = 'moveUpDown';
            button.style.animationDuration = '2s';
            button.style.animationTimingFunction = 'ease-in-out';
            button.style.animationIterationCount = 'infinite';

            // Prevent the button from being dragged
            button.setAttribute('draggable', 'false');

            // Optionally, you can also add a dragstart event listener to prevent drag behavior
            button.addEventListener('dragstart', function(e) {
                e.preventDefault(); // Prevent the default drag behavior
            });

            // Add the button to the body
            document.body.appendChild(button);

            // Add the keyframes for the animation directly via JS
            const styleSheet = document.styleSheets[0] || document.createElement('style');
            if (!document.styleSheets.length) {
                document.head.appendChild(styleSheet);
            }

            const keyframes = `
                @keyframes moveUpDown {
                    0% {
                        bottom: 20px;
                    }
                    50% {
                        bottom: 40px;
                    }
                    100% {
                        bottom: 20px;
                    }
                }
            `;
            
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);  // Insert the keyframes into the stylesheet

            // Add click event to the button to run game.js
            button.addEventListener('click', function() {
                const script = document.createElement('script');
                script.src = 'Scripts/eastereggs/squid-game/game.js';  // Path to your game.js file
                script.type = 'text/javascript';
                document.body.appendChild(script);
            });
        }
    }

    function removeButton() {
        const button = document.querySelector('.squid-game-button');
        if (button) {
            button.remove();
        }
    }
});
