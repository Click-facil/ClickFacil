// docs/js/catalogo.js - CÓDIGO CORRIGIDO
document.addEventListener('DOMContentLoaded', async function () {
    const gridContainer = document.querySelector('.catalogo-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '<p class="loading-message">Carregando serviços...</p>';

    try {
        const response = await fetch('servicos.json'); // Caminho corrigido
        if (!response.ok) throw new Error(`Erro ao carregar o arquivo: ${response.status}`);
        
        const data = await response.json();
        const { servicos, categorias } = data;
        
        if (!servicos || !categorias) {
            throw new Error('Arquivo JSON de serviços mal formatado.');
        }

        gridContainer.innerHTML = ''; 

        const servicesByCategory = servicos.reduce((acc, servico) => {
            const cat = servico.categoria;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(servico);
            return acc;
        }, {});

        for (const catKey in categorias) {
            if (servicesByCategory[catKey]) {
                const categoriaDiv = document.createElement('div');
                categoriaDiv.className = 'catalogo-categoria';

                const tituloCat = document.createElement('h3');
                tituloCat.className = 'section-title'; // Usando a classe de título padrão
                tituloCat.textContent = categorias[catKey];
                categoriaDiv.appendChild(tituloCat);

                const categoriaGrid = document.createElement('div');
                categoriaGrid.className = 'categoria-grid';

                servicesByCategory[catKey].forEach(servico => {
                    const card = document.createElement('div');
                    card.className = 'service-card'; 
                    card.innerHTML = `
                        <img src="${servico.imagem}" alt="${servico.nome}" class="servico-imagem">
                        <div class="servico-card-content">
                            <h4>${servico.nome}</h4>
                            <p>${servico.descricao}</p>
                            <div class="servico-preco">${servico.preco}</div>
                            <a href="index.html#contato" class="btn-solicitar">Solicitar Serviço</a>
                        </div>
                    `;
                    categoriaGrid.appendChild(card);
                });
                
                categoriaDiv.appendChild(categoriaGrid);
                gridContainer.appendChild(categoriaDiv);
            }
        }
    } catch (error) {
        console.error('Falha ao carregar o catálogo de serviços:', error);
        gridContainer.innerHTML = `<p class="error-message">Não foi possível carregar os serviços.</p>`;
    }
});