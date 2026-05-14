/**
 * SKILLS - LOGIC (Badge filtering)
 */

// Lógica de Repositório (Filtragem e Busca)
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const grid = document.getElementById("skillsGrid");
    
    if(!grid) return;
    
    const badges = grid.querySelectorAll(".skill-badge");
    const noResults = document.getElementById("no-results");

    function filterSkills() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeBtn = document.querySelector(".filter-btn.active");
        const filterType = activeBtn ? activeBtn.getAttribute("data-filter") : "all";

        let visibleCount = 0;

        badges.forEach((badge) => {
            const label = badge.querySelector(".badge-label").textContent.toLowerCase();
            const matchSearch = label.includes(searchTerm);

            const badgeTech = badge.getAttribute("data-tech") || "";
            let matchFilter = false;

            if (filterType === "all") {
                matchFilter = true;
            } else {
                const terms = badgeTech.split(/\s+/);
                matchFilter = terms.includes(filterType);
            }

            if (matchSearch && matchFilter) {
                badge.style.display = "inline-flex";
                visibleCount++;
            } else {
                badge.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterSkills);
    }

    if (filterBtns) {
        filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                filterSkills();
            });
        });
    }

    // Lógica para capturar filtro da URL (ex: ?filter=Backend)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam) {
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }
});