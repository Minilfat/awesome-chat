validateForm();

function validateForm() {
    var changeBtn = document.getElementById('changeBtn');
    changeBtn.classList.add('hidden');
    var oldPassword = document.getElementById('oldP');
    var oldPassword2 = document.getElementById('oldP2');

    var newPassword = document.getElementById('newP');
    newPassword.classList.add('hidden');
    newPassword.oninput = function () {
        changeBtn.classList.add('hidden');
        if (newPassword.value.length >= 1) {
            changeBtn.classList.remove('hidden');
        } else {
            changeBtn.classList.add('hidden');
        }
    };
    //
    var pFeedback = document.getElementById('pFeedback');
    //
    oldPassword2.oninput = function () {
        if (validateInput(oldPassword2)) {
            oldPassword.classList.remove('is-invalid');
            oldPassword2.classList.remove('is-invalid');
            //
            oldPassword.classList.add('is-valid');
            oldPassword2.classList.add('is-valid');
            //
            newPassword.classList.remove('hidden');
            //
            pFeedback.classList.add('hidden');
        } else {
            oldPassword.classList.remove('is-valid');
            oldPassword2.classList.remove('is-valid');
            //
            oldPassword.classList.add('is-invalid');
            oldPassword2.classList.add('is-invalid');
            //
            newPassword.classList.add('hidden');
            //
            pFeedback.classList.remove('hidden');
        }
    };

    function validateInput(input) {
        if (input.value == oldPassword.value) {
            return true;
        }
        return false;
    }
}
