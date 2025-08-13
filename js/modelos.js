document.addEventListener('DOMContentLoaded', async function() {
    console.log("🔄 Iniciando a loja de modelos digitais...");

    const gridContainer = document.getElementById('modelos-grid-container');
    if (!gridContainer) {
        console.error('❌ Elemento #modelos-grid-container não encontrado.');
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

        renderProducts(allProducts, allCategories);

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
    // Adicione mais regras conforme necessário
    return 'Modelo digital pronto para agilizar sua rotina.';
}

function renderProducts(produtos, categorias) {
    const gridContainer = document.getElementById('modelos-grid-container');
    gridContainer.innerHTML = '';

    const productsByCategory = produtos.reduce((acc, produto) => {
        const cat = produto.categoria;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(produto);
        return acc;
    }, {});

    for (const catKey in categorias) {
        if (productsByCategory[catKey]) {
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
