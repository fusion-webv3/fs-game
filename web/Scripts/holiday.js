function updateAccentColor() {
    // Only run if it has never run before
    if (localStorage.getItem("2026")) return;

    localStorage.setItem("accentColor", "None (Default)");
    //localStorage.setItem("accentCustom", "#ececee");
    localStorage.setItem("mode", "Dark");
    localStorage.setItem("theme", "Custom");
    localStorage.setItem("themeHex", "#695CFE");
    //localStorage.setItem("nav", "Sidebar");
    localStorage.setItem("thumbnailtext", "true");
    //localStorage.setItem("banned", "false");

    // Mark that it has been run
    localStorage.setItem("2026", "true");
}

updateAccentColor();
