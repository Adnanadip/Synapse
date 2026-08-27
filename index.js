document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('toolSearch');
    const utilityCards = document.querySelectorAll('.utility-card');

    // Real-time search filtering
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        utilityCards.forEach(card => {
            // Grab the title, description, and hidden search tags from the HTML
            const title = card.querySelector('h2').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = card.getAttribute('data-tags').toLowerCase();

            // Check if search term exists in any of the elements
            if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                card.style.display = 'flex'; // Maintain flexbox layout for visible cards
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Optional: Add a subtle keyboard shortcut to focus the search bar (Press '/')
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
});