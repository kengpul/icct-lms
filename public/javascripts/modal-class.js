// Get the modal
var modal = document.getElementById("myModal");
var createClassModal = document.getElementById("createClassModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var createClass = document.getElementById("createClassBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var createClassClose = document.getElementsByClassName("createClassClose")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}
createClass.onclick = function () {
    createClassModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}
createClassClose.onclick = function () {
    createClassModal.style.display = "none";
    console.log(modal.style.display)
}



// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == createClassModal) {
        createClassModal.style.display = "none";
    }
}