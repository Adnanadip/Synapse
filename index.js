document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('toolSearch');
    const utilityCards = document.querySelectorAll('.utility-card');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        utilityCards.forEach(card => {

            const title = card.querySelector('h2').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = card.getAttribute('data-tags').toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {

                card.style.display = 'flex'; 

            } else {

                card.style.display = 'none';

            }

        });

    });

    document.addEventListener('keydown', (e) => {

        if (e.key === '/' && document.activeElement !== searchInput) {

            e.preventDefault();
            searchInput.focus();

        }
        
    });
});