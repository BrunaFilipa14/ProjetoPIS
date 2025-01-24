function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if(response.status == 401){
            document.getElementById("invalidCredentialsMsg").innerHTML = "*** Invalid credentials!";
        }
        else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.auth) {
            window.location.href = "/home";
        }
    })
    .catch(error => {
        console.error("Error in login fetch:", error);
        alert("An error occurred: " + error.message);
    });
    
}


function signUp(event){
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmedPassword = document.getElementById("confirmedPassword").value;

    if(password != confirmedPassword){
        alert("Passwords don´t match");
        return;
    }


    fetch("/auth/signUp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            { 
                username : username ,
                password : password
            }
        ),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("fetch response?");
        alert("Registered Successfully!");
        window.location.href = `/sign_in`; 
    })
    .catch(error => {
        console.error("Error in register fetch:", error);
        alert("An error occurred: " + error.message);
    });
}

function logout(event) {
    event.preventDefault();
    console.log('Logout button clicked');

    fetch('/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log("Logging out");
            window.location.href = '/sign_in';
        } else {
            throw new Error('Failed to log out');
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
    });
}