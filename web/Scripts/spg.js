// Attach a keydown event listener to the document
document.addEventListener('keydown', function(event) {
  // Check if the user pressed Ctrl + J
  if (event.ctrlKey && event.key.toLowerCase() === 'j') {
    // Get all the elements on the page
    var elements = document.getElementsByTagName('*');

    // Add a mouseover event listener to each element
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('mouseover', function() {
        // Display the ID of the element on the screen
        alert('You are hovering over the element with ID: ' + this.id);
      });
    }
  }
});