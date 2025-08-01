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
                card.className = 'modelo-card card';

                card.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.titulo}" class="modelo-imagem" loading="lazy">
                    <div class="modelo-card-content">
                        <div class="modelo-card-header"><h4>${produto.titulo}</h4></div>
                        <div class="modelo-card-description"><p>${produto.descricao}</p></div>
                    </div>
                    <div class="precos">
                        <p><strong>R$ ${produto.preco_base.toFixed(2).replace('.', ',')}</strong></p>
                    </div>
                    <div class="botoes-compra">
                        <a href="${produto.link_pagamento}" target="_blank" class="btn-comprar">Comprar Agora</a>
                    </div>
                `;
                categoriaGrid.appendChild(card);
            });

            categoriaDiv.appendChild(categoriaGrid);
            gridContainer.appendChild(categoriaDiv);
        }
    }
}
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
                card.className = 'modelo-card card';

                card.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.titulo}" class="modelo-imagem" loading="lazy">
                    <div class="modelo-card-content">
                        <div class="modelo-card-header"><h4>${produto.titulo}</h4></div>
                        <div class="modelo-card-description"><p>${produto.descricao}</p></div>
                    </div>
                    <div class="precos">
                        <p><strong>R$ ${produto.preco_base.toFixed(2).replace('.', ',')}</strong></p>
                    </div>
                    <div class="botoes-compra">
                        <a href="${produto.link_pagamento}" target="_blank" class="btn-comprar">Comprar Agora</a>
                    </div>
                `;
                categoriaGrid.appendChild(card);
            });

            categoriaDiv.appendChild(categoriaGrid);
            gridContainer.appendChild(categoriaDiv);
        }
    }
}
