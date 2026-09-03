// Get the value from local storage
const username = localStorage.getItem('sgs_profile_username');

// Find the text box with ID 'last_10'
const lastTenTextBox = document.getElementById('input_4');

// Set the value of the text box
lastTenTextBox.value = username;

// Make the text box uneditable
lastTenTextBox.readOnly = true;