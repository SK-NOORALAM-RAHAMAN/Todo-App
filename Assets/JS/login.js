// For log in page 
const loginForm = document.getElementById("login-form");

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    const h2 = document.getElementById('note');
    auth.signInWithEmailAndPassword(email, password).then(() => {

        h2.textContent = 'Loading....';
        h2.style.color = 'green';
        window.location.assign('todo.html');
        loginForm.reset();

    }).catch(error => {
       
        h2.textContent = 'No record Found. Please recheak your email and password or Sign up now.';
        h2.style.color = 'red';
        
    })


})


// for move to Sign up page
document.getElementById('new').addEventListener('click', e => {
    window.location.replace('signup.html');
})

// test: sagar@gmail.com sagar121