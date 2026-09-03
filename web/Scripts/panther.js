document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'j') {
        event.preventDefault();
        
        // Function to create the popup and buttons
        function createPopup() {
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.width = '80%';
            popup.style.maxWidth = '400px';
            popup.style.height = '80%';
            popup.style.maxHeight = '400px';
            popup.style.backgroundColor = 'white';
            popup.style.padding = '20px';
            popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            popup.style.overflowY = 'auto';
            popup.style.borderRadius = '10px';
            
            const closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.background = 'red';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '50%';
            closeButton.style.cursor = 'pointer';
            closeButton.addEventListener('click', function() {
                document.body.removeChild(popup);
            });

            popup.appendChild(closeButton);
            
            const storageKeys = Object.keys(localStorage);
            storageKeys.forEach(key => {
                const button = document.createElement('button');
                button.textContent = key;
                button.style.display = 'block';
                button.style.width = '100%';
                button.style.margin = '5px 0';
                button.style.padding = '10px';
                button.style.background = '#f0f0f0';
                button.style.border = '1px solid #ccc';
                button.style.borderRadius = '5px';
                button.style.cursor = 'pointer';
                
                button.addEventListener('click', function() {
                    const newValue = prompt(`Enter new value for ${key}:`, localStorage.getItem(key));
                    if (newValue !== null) {
                        localStorage.setItem(key, newValue);
                        alert(`Value for ${key} updated!`);
                    }
                });
                
                popup.appendChild(button);
            });

            document.body.appendChild(popup);
        }
        
        createPopup();
    }
});
