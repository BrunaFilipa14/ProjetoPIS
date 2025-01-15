function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("error bf");
        return response.json();
    })
    .then(data => {
        if (data.token) {
            console.log(data.token);
            document.cookie = `token=${data.token}`; // Save the token in localStorage
            alert("Login successful!");

            fetchIndex(data.token);
        } else {
            throw new Error(data.message || "Login failed!");
        }
    })
    .catch(error => {
        console.error("Error in login fetch:", error);
        alert("An error occurred: " + error.message);
    });
}

function fetchIndex(token) {
    fetch("/api/index", {
        method: "GET",
        headers: {
            "x-access-token": token, // Send token in header
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    })
    .catch(error => {
        console.error("Error fetching index:", error);
        alert("Failed to fetch index: " + error.message);
    });
}


function signUp(event){
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    fetch("/api/signUp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            alert("Register successful!");
        } else {
            throw new Error(data.message || "Register failed!");
        }
    })
    .catch(error => {
        console.error("Error in register fetch:", error);
        alert("An error occurred: " + error.message);
    });
}