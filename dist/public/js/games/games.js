// Search Team
let gameSearchForm = document.getElementById('form_search_game');
let gameSearchInput = document.getElementById('input_search_game');

teamSearchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputValue = teamSearchInput.value;
    if (!inputValue) return;
    
    window.location.href = `/view/games/${inputValue}`;
});