const form = document.getElementById('form_search');
const input = document.getElementById('input_search');

form.addEventListener('submit', (evt) => {
    evt.preventDefault(); // Prevent the default form submission behavior

    const inputValue = input.value.trim(); // Retrieve and trim the input value
    
    console.log(inputValue); // Log the input value
    const relativeURL = `http://localhost:8081/search/${inputValue}`; // Correct template literal
    const absoluteURL = new URL(relativeURL, window.location.href); // Combine URLs

    window.location.href = absoluteURL.href; // Redirect to the full URL
});

// Example of filter function
function filter(opt) {
    const relativeURL = `http://localhost:8081/search/${opt}/${inputValue}`; // Correct URL construction
    window.location.href = relativeURL;
};
