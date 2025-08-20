document.addEventListener('DOMContentLoaded', async function() {
    console.log("🔄 Iniciando a loja de modelos digitais...");

    const gridContainer = document.getElementById('modelos-grid-container');
    const searchInput = document.getElementById('search-modelos-input'); // Pega a barra de pesquisa

    if (!gridContainer || !searchInput) {
        console.error('❌ Elementos essenciais (grid ou input de busca) não encontrados.');
        return;
    }

    try {
        gridContainer.innerHTML = '<p class="loading-message">Carregando modelos...</p>';

        const response = await fetch('js/modelos.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        const allProducts = data.produtos;
        const allCategories = data.categorias;

        // Renderiza todos os produtos na primeira vez que a página carrega
        renderProducts(allProducts, allCategories);

        // --- INÍCIO DA NOVA LÓGICA DE PESQUISA ---
        // Adiciona um "ouvinte" que reage a cada letra digitada na barra de pesquisa
        searchInput.addEventListener('input', function(event) {
            const searchTerm = event.target.value.toLowerCase();

            // Filtra a lista COMPLETA de produtos
            const filteredProducts = allProducts.filter(produto => {
                const title = produto.titulo.toLowerCase();
                const description = produto.descricao.toLowerCase();
                // Retorna verdadeiro se o termo de busca estiver no título OU na descrição
                return title.includes(searchTerm) || description.includes(searchTerm);
            });

            // Re-renderiza a lista na tela apenas com os produtos filtrados
            renderProducts(filteredProducts, allCategories);
        });
        // --- FIM DA NOVA LÓGICA DE PESQUISA ---

    } catch (error) {
        console.error('❌ Falha ao carregar os modelos:', error);
        gridContainer.innerHTML = `<p class="error-message">Não foi possível carregar os modelos. Tente novamente mais tarde.</p>`;
    }
});

function gerarDescricao(nome) {
    if (nome.toLowerCase().includes('financeiro')) return 'Organize suas receitas e despesas de forma prática e eficiente.';
    if (nome.toLowerCase().includes('estoque')) return 'Controle o estoque do seu negócio com facilidade e precisão.';
    if (nome.toLowerCase().includes('agenda')) return 'Gerencie seus compromissos e tarefas de forma simples e visual.';
    if (nome.toLowerCase().includes('vendas')) return 'Acompanhe suas vendas e resultados com este modelo digital.';
    if (nome.toLowerCase().includes('projeto')) return 'Planeje e monitore seus projetos com eficiência.';
    return 'Modelo digital pronto para agilizar sua rotina.';
}

function renderProducts(produtos, categorias) {
    const gridContainer = document.getElementById('modelos-grid-container');
    gridContainer.innerHTML = ''; // Sempre limpa a tela antes de renderizar

    // --- ADICIONADO: VERIFICAÇÃO DE RESULTADOS ---
    // Se a lista de produtos (filtrada ou não) estiver vazia, mostra uma mensagem
    if (produtos.length === 0) {
        gridContainer.innerHTML = '<p id="no-results-message" style="text-align: center; color: var(--text-lightest); padding: 40px 0;">Nenhum modelo encontrado com esse termo.</p>';
        return; // Para a execução da função aqui
    }

    const productsByCategory = produtos.reduce((acc, produto) => {
        const cat = produto.categoria;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(produto);
        return acc;
    }, {});

    for (const catKey in categorias) {
        // Apenas renderiza a categoria se houver produtos nela após o filtro
        if (productsByCategory[catKey] && productsByCategory[catKey].length > 0) {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'modelo-categoria';

            const tituloCat = document.createElement('h3');
            tituloCat.textContent = categorias[catKey];
            categoriaDiv.appendChild(tituloCat);

            const categoriaGrid = document.createElement('div');
            categoriaGrid.className = 'categoria-grid';

            productsByCategory[catKey].forEach(produto => {
                const card = document.createElement('div');
                card.className = 'service-card';

                card.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.titulo}" class="servico-imagem" loading="lazy">
                    <div class="servico-card-content">
                        <h4>${produto.titulo}</h4>
                        <p>${produto.descricao ? produto.descricao : gerarDescricao(produto.titulo)}</p>
                        <span class="servico-preco">R$ ${produto.preco_base.toFixed(2).replace('.', ',')}</span>
                        <a href="${produto.link_pagamento}" target="_blank" class="btn-solicitar saiba-mais">Comprar Agora</a>
                    </div>
                `;
                categoriaGrid.appendChild(card);
            });

            categoriaDiv.appendChild(categoriaGrid);
            gridContainer.appendChild(categoriaDiv);
        }
    }
}
