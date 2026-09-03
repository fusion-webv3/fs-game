function checkAndSetVerifiedStatus() {
    var username = localStorage.getItem("sgs_profile_username") || "";
    var badges = localStorage.getItem("badges") || "";

    if (username.toLowerCase().endsWith("_verified=true")) {
        var cleanedUsername = username.slice(0, -14);

       
        if (!badges.includes("verified1")) {
            badges += "verified1 || ";
            localStorage.setItem("badges", badges);
            localStorage.setItem("sgs_profile_username", cleanedUsername);
            loadProfile();

            console.log("User is verified!");
        } else {
            localStorage.setItem("sgs_profile_username", cleanedUsername);
            loadProfile();

            console.log("Username cleaned (removed _verified).");
        }
    } else {
        console.log("User is not verified.");
    }
}

// Check and set verified status every half second
setInterval(checkAndSetVerifiedStatus, 500);
