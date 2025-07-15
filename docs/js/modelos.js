document.addEventListener('DOMContentLoaded', async function() {
    console.log("🔄 Iniciando carregamento do JSON...");

    const gridContainer = document.getElementById('modelos-grid-container');
    if (!gridContainer) {
        console.error('❌ Elemento #modelos-grid-container não encontrado.');
        return;
    }

    try {
        gridContainer.innerHTML = '<p class="loading-message">Carregando modelos...</p>';

        const response = await fetch('js/modelos.json');
        console.log("📦 Status do fetch:", response.status);

        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ JSON carregado com sucesso:", data);

        const allProducts = data.produtos;
        const allCategories = data.categorias;

        function renderProducts(produtos, categorias) {
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
                        console.log("DEBUG:", produto.titulo, produto.preco_base, produto.combo);
                        const precoCombo = (produto.preco_base + produto.combo.preco_adicional).toFixed(2);
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
                                <p class="combo-info">Combo com Suporte: + R$ ${produto.combo.preco_adicional.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div class="botoes-compra">
                                <a href="https://nubank.com.br/cobrar/uee95/687680a3-3671-440b-b6b2-6ecab61bd978" class="btn-comprar">Comprar Agora</a>
                                <a href="https://nubank.com.br/cobrar/uee95/687680a3-3671-440b-b6b2-6ecab61bd978" target="_blank" class="btn-comprar-combo">Comprar Combo</a>
                            </div>
                        `;
                        categoriaGrid.appendChild(card);
                    });

                    categoriaDiv.appendChild(categoriaGrid);
                    gridContainer.appendChild(categoriaDiv);
                }
            }
        }

        renderProducts(allProducts, allCategories);

    } catch (error) {
        console.error('❌ Falha ao carregar e renderizar os modelos:', error);
        gridContainer.innerHTML = `<p class="error-message">Não foi possível carregar os modelos. Tente novamente mais tarde.</p>`;
    }
});
