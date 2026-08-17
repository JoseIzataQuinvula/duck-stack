/**
 * REPOSITÓRIO - LÓGICA DE FILTRAGEM E BUSCA
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('no-results');

    /* 1. LÓGICA DE FILTRO E BUSCA */
    function filterProjects() {
        // Pega o valor da busca em minúsculo e sem espaços extras
        const query = searchInput.value.toLowerCase().trim();
        
        // Pega o filtro ativo
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter.toLowerCase() : 'all';
        
        let visibleCount = 0;

        cards.forEach(card => {
            // Captura os dados do card para comparação
            const title = card.querySelector('h3').textContent.toLowerCase();
            // O uso de ?. evita erro caso o card não tenha tag <p>
            const description = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : "";
            const tech = (card.dataset.tech || "").toLowerCase();

            // Lógica de busca: verifica se o título ou a descrição contém o que foi digitado
            const matchesSearch = title.includes(query) || description.includes(query);
            
            // Lógica de filtro: 
            // Se for 'all', passa sempre. 
            // Se não, verifica se a string de tecnologias do card CONTÉM o filtro selecionado.
            const matchesFilter = activeFilter === 'all' || tech.includes(activeFilter);

            // Exibe o card apenas se passar em ambos os testes
            if (matchesSearch && matchesFilter) {
                card.style.display = "block";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Exibe mensagem "Nenhum resultado encontrado" se o contador for zero
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    /* 2. EVENTOS */

    // Filtro por digitação
    if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
    }

    // Filtro por clique nos botões de categoria
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe ativa de todos e adiciona ao botão clicado
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Executa a filtragem
            filterProjects();
        });
    });

    // Lógica para capturar filtro da URL (ex: ?filter=JavaScript)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam) {
        // Tenta encontrar um botão que corresponda ao filtro (case-insensitive)
        const targetBtn = Array.from(filterBtns).find(btn => 
            btn.getAttribute('data-filter').toLowerCase() === filterParam.toLowerCase() ||
            btn.textContent.toLowerCase() === filterParam.toLowerCase()
        );
        
        if (targetBtn) {
            targetBtn.click();
        }
    }
});