document.addEventListener('DOMContentLoaded', async function() {
    // --- Configuração da API ---
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://agilizatech.onrender.com';

    // --- Elementos do DOM ---
    const searchInput = document.getElementById('search-modelos-input');
    const gridContainer = document.getElementById('modelos-grid-container');
    const modal = document.getElementById('assistance-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalPaymentBtn = document.getElementById('modal-payment-btn');

    if (!gridContainer) return;

    let allProducts = []; // Armazena todos os produtos para a busca
    let allCategories = {}; // Armazena os nomes das categorias

    // --- Carregamento Dinâmico dos Produtos ---
    try {
        gridContainer.innerHTML = '<p class="loading-message">Carregando modelos...</p>';
        const response = await fetch('js/modelos.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        allProducts = data.produtos;
        allCategories = data.categorias;
        renderProducts(allProducts, allCategories);
    } catch (error) {
        console.error('Falha ao carregar os modelos:', error);
        gridContainer.innerHTML = `<p class="error-message">Não foi possível carregar os modelos. Tente novamente mais tarde.</p>`;
    }

    function renderProducts(produtos, categorias, isSearchResult = false) {
        gridContainer.innerHTML = ''; // Limpa a mensagem de "carregando" ou resultados anteriores

        if (produtos.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.id = 'no-results-message';
            // Mensagem mais apropriada dependendo do contexto (busca ou carga inicial)
            noResultsMessage.textContent = isSearchResult
                ? 'Nenhum modelo encontrado para sua busca.'
                : 'Nenhum modelo disponível no momento.';
            gridContainer.appendChild(noResultsMessage);
            return; // Encerra a função se não houver produtos para renderizar
        }

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
                    const precoCombo = (produto.preco_base + produto.combo.preco_adicional).toFixed(2);
                    const card = document.createElement('div');
                    card.className = 'modelo-card';
                    card.innerHTML = `
                        <img src="${produto.imagem}" alt="${produto.titulo}" class="modelo-imagem" loading="lazy">
                        <div class="modelo-card-content">
                            <div class="modelo-card-header">
                                <h4>${produto.titulo}</h4>
                                <button class="btn-info">+ Info</button>
                            </div>
                            <div class="modelo-card-description"><p>${produto.descricao}</p></div>
                        </div>
                        <div class="precos">
                            <p><strong>R$ ${produto.preco_base.toFixed(2).replace('.', ',')}</strong></p>
                            <p class="combo-info">Combo: + R$ ${produto.combo.preco_adicional.toFixed(2).replace('.', ',')} (${produto.combo.descricao})</p>
                        </div>
                        <div class="botoes-compra">
                            <button class="btn-comprar" data-title="${produto.titulo} (Editável)" data-price="${produto.preco_base.toFixed(2)}" data-download-path="${produto.download_path}">Comprar e Baixar</button>
                            <button class="btn-comprar-combo" data-title="${produto.titulo} com Assistência" data-price="${precoCombo}" data-download-path="${produto.download_path}">Comprar com Assistência</button>
                        </div>
                    `;
                    categoriaGrid.appendChild(card);
                });

                categoriaDiv.appendChild(categoriaGrid);
                gridContainer.appendChild(categoriaDiv);
            }
        }
    }

    // --- Função de Debounce para otimizar a busca ---
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // --- Lógica de Busca ---
    if (searchInput) {
        const handleSearch = debounce(() => {
            const searchTerm = searchInput.value.toLowerCase().trim();

            if (!searchTerm) {
                // Se a busca estiver vazia, renderiza todos os produtos
                renderProducts(allProducts, allCategories);
                return;
            }

            // Filtra o array de produtos em vez de manipular o DOM
            const filteredProducts = allProducts.filter(produto => {
                const title = produto.titulo.toLowerCase();
                const description = produto.descricao.toLowerCase();
                return title.includes(searchTerm) || description.includes(searchTerm);
            });

            // Renderiza apenas os produtos filtrados
            renderProducts(filteredProducts, allCategories, true); // Passa true para indicar que é um resultado de busca
        }, 300); // Atraso de 300ms

        searchInput.addEventListener('input', handleSearch);
    }

    // --- Lógica de Pagamento (Função Auxiliar) ---
    const handlePayment = async (button) => {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
        
        // Adiciona o spinner e desabilita o botão
        const originalText = button.textContent;
        button.classList.add('btn-loading');
        const spinner = document.createElement('div');
        spinner.className = 'btn-spinner';
        button.appendChild(spinner);
        button.disabled = true;

        // Lógica para remover o spinner e restaurar o botão
        const restoreButton = () => {
            button.classList.remove('btn-loading');
            const existingSpinner = button.querySelector('.btn-spinner');
            if (existingSpinner) existingSpinner.remove();
            button.textContent = originalText;
            button.disabled = false;
        };
        const { title, price, downloadPath } = button.dataset;

        // VALIDAÇÃO ROBUSTA PARA EVITAR ERRO 400
        if (!title || !price || !downloadPath) {
            const errorMsg = 'Dados do produto ausentes no botão. Verifique os atributos data-* no HTML.';
            console.error(errorMsg, { title, price, downloadPath });
            alert('Erro de configuração. Não foi possível obter os dados do produto.');
            restoreButton();
            return;
        }

        // Constrói as URLs absolutas para o redirecionamento do pagamento
        // Gateways de pagamento exigem URLs completas.
        const successUrl = `${window.location.origin}${window.location.pathname.replace('modelosdigitais.html', '')}payment-success.html`;
        const failureUrl = `${window.location.origin}${window.location.pathname.replace('modelosdigitais.html', '')}payment-failure.html`;

        try {
            const response = await fetch(`${API_URL}/api/create-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    price: parseFloat(price),
                    downloadPath,
                    success_url: successUrl,
                    failure_url: failureUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Falha ao criar o link de pagamento (Erro ${response.status})`);
            }

            const data = await response.json();

            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error('URL de pagamento não recebida do servidor.');
            }

        } catch (error) {
            console.error('Erro no pagamento:', error);
            // Utiliza a função showToast (se disponível) para um feedback mais elegante
            if (typeof showToast === 'function') {
                showToast(`Erro: ${error.message}`, 'error');
            } else {
                alert(`Ocorreu um erro ao iniciar o pagamento: ${error.message}`);
            }
            restoreButton();
        }
    };

    // --- Lógica do Modal ---
    const openModal = (button) => {
        if (!modal) return;
        if (modalPaymentBtn) {
            modalPaymentBtn.dataset.title = button.dataset.title;
            modalPaymentBtn.dataset.price = button.dataset.price;
            modalPaymentBtn.dataset.downloadPath = button.dataset.downloadPath;
        }
        modal.classList.add('show');
    };

    const closeModal = () => {
        if (modal) modal.classList.remove('show');
    };

    // --- Event Delegation: Um único listener para todos os cliques ---
    document.addEventListener('click', function(event) {
        const target = event.target;

        const infoButton = target.closest('.btn-info');
        if (infoButton) {
            const card = infoButton.closest('.modelo-card');
            const description = card.querySelector('.modelo-card-description');
            const isShown = description.classList.toggle('show');
            infoButton.textContent = isShown ? '- Info' : '+ Info';
            return;
        }

        const comboButton = target.closest('.btn-comprar-combo');
        if (comboButton) {
            event.preventDefault();
            openModal(comboButton);
            return;
        }

        const paymentButton = target.closest('.btn-comprar, #modal-payment-btn');
        if (paymentButton) {
            handlePayment(paymentButton);
            return;
        }

        if (target === closeModalBtn || target === modalOverlay) {
            closeModal();
        }
    });
});