if (typeof(Storage) !== "undefined") {
    var redeemedCodes = JSON.parse(localStorage.getItem("redeemedCodes")) || [];
    var codeMessage = "nothing";

    function redeemCode() {
        var enteredCode = document.getElementById('codeInput').value;
        var messageContainer = document.getElementById('messageContainer');

        if (redeemedCodes.includes(enteredCode)) {
            showMessage("This code has already been redeemed. Please try a different one.", 'error');
        } else {
            if (validateCode(enteredCode)) {
                var newXp; 

                if (enteredCode === "thisisnothowyougetverified") {
                    verifiedCode();
                    codeMessage = "Verified badge";
                }
                if (enteredCode === "2024") {
                    newXp = yearCode(); 
                    codeMessage = (`${newXp} XP.`);
                }
                if (enteredCode === "SuperBowl58") {
                    newXp = xpCode(); 
                    codeMessage = (`${newXp} XP.`);
                }
                  if (enteredCode === "Chiefs") {
                    newXp = xpCode(); 
                    codeMessage = (`${newXp} XP.`);
                }
                if (enteredCode === "49ers") {
                    newXp = xpCode(); 
                    codeMessage = (`${newXp} XP.`);
                }
                 if (enteredCode === "c") {
                    newXp = secretCode(); 
                    codeMessage = (`${newXp} XP.`);
                }


                showMessage("Congratulations! you redeemed", 'success', codeMessage);
                redeemedCodes.push(enteredCode);


                localStorage.setItem("redeemedCodes", JSON.stringify(redeemedCodes));

                document.getElementById('codeInput').value = '';
            } else {
                showMessage("Sorry, the entered code is invalid. Please enter a valid code.", 'error');
            }
        }
    }

    document.getElementById('codeInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            redeemCode();
        }
    });

    function validateCode(code) {
        var validCodes = ["2024", "thisisnothowyougetverified", "Chiefs", "49ers", "SuperBowl58", "c"  ];
        return validCodes.includes(code);
    }

    function showMessage(message, type, code) {
        var messageContainer = document.getElementById('messageContainer');
        var fullMessage = message + (code ? ` (${code})` : '');

        messageContainer.className = type;
        messageContainer.innerHTML = fullMessage;
        messageContainer.style.display = 'block';


        console.log(fullMessage);

        setTimeout(function() {
            messageContainer.style.display = 'none';
        }, 3000);
    }

    function verifiedCode() {
        var badges = localStorage.getItem("badges") || "";

        if (!badges.includes("verified1")) {
            badges = badges + "verified1 || ";
            localStorage.setItem("badges", badges);

            loadProfile();

            console.log("Congratulations! You have been granted the verified badge.");
        } else {
            console.log("User already has the verified badge.");
        }
    }

    function yearCode() {
        var xp = parseInt(localStorage.getItem("xp")) || 0;
        var lvl = parseInt(localStorage.getItem("lvl")) || 1;
        var newXp = 75 * lvl;

        xp += newXp;

        if (xp >= lvl * 75) {
            xp = xp - lvl * 75;
            lvl = lvl + 1;

            console.log(`Congratulations! You have leveled up to level ${lvl}`);
        }

        localStorage.setItem("xp", xp);
        localStorage.setItem("lvl", lvl);

        loadProfile();

        console.log(`${newXp} XP granted to the user.`);

        return newXp; 
    }

    function xpCode() {
        var xp = parseInt(localStorage.getItem("xp")) || 0;
        var lvl = parseInt(localStorage.getItem("lvl")) || 1;
        var newXp = 200 * lvl;

        xp += newXp;

        if (xp >= lvl * 75) {
            xp = xp - lvl * 75;
            lvl = lvl + 1;

            console.log(`Congratulations! You have leveled up to level ${lvl}`);
        }

        localStorage.setItem("xp", xp);
        localStorage.setItem("lvl", lvl);

        loadProfile();

        console.log(`${newXp} XP granted to the user.`);

        return newXp; 
    }
    function secretCode() {
        var xp = parseInt(localStorage.getItem("xp")) || 0;
        var lvl = parseInt(localStorage.getItem("lvl")) || 1;
        var newXp = 100000000;

        xp += newXp;

        if (xp >= lvl * 75) {
            xp = xp - lvl * 75;
            lvl = lvl + 1;

            console.log(`Congratulations! You have leveled up to level ${lvl}`);
        }

        localStorage.setItem("xp", xp);
        localStorage.setItem("lvl", lvl);

        loadProfile();

        console.log(`${newXp} XP granted to the user.`);

        return newXp; 
    }
} else {
    console.error("Sorry, your browser does not support local storage.");
}
