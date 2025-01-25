const form = document.getElementById('form_search');
const input = document.getElementById('input_search');


form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputValue = input.value;
    if (!inputValue) return;
    
    window.location.href = `/api/search/${inputValue}`;
});

