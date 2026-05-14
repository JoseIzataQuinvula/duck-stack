document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.company-card');
    const noResults = document.getElementById('no-results');

    function filterCompanies() {
        const query = searchInput.value.toLowerCase().trim();
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter.toLowerCase() : 'all';
        
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const role = card.querySelector('.job-role') ? card.querySelector('.job-role').textContent.toLowerCase() : "";
            const tech = (card.dataset.tech || "").toLowerCase();

            const matchesSearch = title.includes(query) || role.includes(query);
            const matchesFilter = activeFilter === 'all' || tech.includes(activeFilter);

            if (matchesSearch && matchesFilter) {
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterCompanies);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCompanies();
        });
    });
});
