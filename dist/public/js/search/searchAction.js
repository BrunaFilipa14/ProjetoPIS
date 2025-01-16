const form = document.getElementById('form_search');
const input = document.getElementById('input_search');


form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputValue = input.value;
    if (!inputValue) return;
    
    // Build the dynamic URL based on the filter
    const relativeURL = `/search/${inputValue}`;
    window.location.href = relativeURL; // Redirect to the URL
});

