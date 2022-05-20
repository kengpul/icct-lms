// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.validate')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } else {
                    form.elements[form.elements.length - 1].disabled = true;
                    form.elements[form.elements.length - 1].innerHTML =
                        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                         Loading`;

                }

                form.classList.add('was-validated')
            }, false)
        })
})()