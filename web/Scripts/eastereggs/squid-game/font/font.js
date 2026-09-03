document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-box-input');
    const fontPath = 'Scripts/eastereggs/squid-game/font/font.ttf'; // Change font path here easily

    if (searchBox) {
        const font = new FontFace('SquidGameFont', `url(${fontPath})`);
        
        font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
            console.log('Font loaded successfully');
        }).catch(function(error) {
            console.error('Failed to load font:', error);
        });

        searchBox.addEventListener('input', function() {
            if (searchBox.value.toLowerCase() === 'squid game') {
                searchBox.style.fontFamily = 'SquidGameFont';
                searchBox.style.color = 'white';
            } else {
                searchBox.style.fontFamily = '';
                searchBox.style.color = '';
            }
        });
    }
});



Scripts/eastereggs/squid-game/font/font.ttf