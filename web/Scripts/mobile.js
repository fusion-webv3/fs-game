// Function to check if the user is on a mobile device
function isMobileDevice() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

// Function to load and execute a script file
function loadScript(scriptPath) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = scriptPath;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Function to run if the user is on a mobile device
function mobileScript() {
    console.log("Running mobile script...");
    loadScript('Scripts/game_data_mobile.js')
        .then(() => {
            console.log('Mobile script loaded successfully');
            // Request fullscreen mode
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
                document.documentElement.msRequestFullscreen();
            }
        })
        .catch(error => console.error('Error loading mobile script:', error));
}

// Function to run if the user is not on a mobile device
function desktopScript() {
    console.log("Running desktop script...");
    loadScript('Scripts/game_data.js')
        .then(() => console.log('Desktop script loaded successfully'))
        .catch(error => console.error('Error loading desktop script:', error));
}

// Check if the user is on a mobile device
if (isMobileDevice()) {
    // Run mobile script
    mobileScript();
} else {
    // Run desktop script
    desktopScript();
}
