
// for sign up page

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const passwordConfirm = signupForm['signup-password-confirm'].value;

    const h2 = document.getElementById('note');
    if (password === passwordConfirm) {
        console.log('Same');
        auth.createUserWithEmailAndPassword(email, password).then(() => {
            h2.textContent = 'Loading....';
            h2.style.color = 'green';
            window.location.assign('todo.html');
            signupForm.reset();

        }).catch(error => {
            h2.textContent = error;
            h2.style.color = 'red';

        })
    } else {
        console.log('Not Same');
        h2.textContent = '* password unmatched, enter the password again *';
        h2.style.color = 'red';

    }

})

