document.addEventListener('DOMContentLoaded', () => {
    const catalogoGrid = document.querySelector('.catalogo-grid');
    // Detecta o caminho base correto, não importa se está na raiz ou em /pages/
    const basePath = window.location.pathname.includes('pages') ? '../' : '';

    if (!catalogoGrid) {
        console.error('Elemento .catalogo-grid não encontrado.');
        return;
    }

    async function carregarServicos() {
        try {
            // Usa o basePath para encontrar o JSON
            const response = await fetch(`${basePath}servicos.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Limpa a mensagem de "Carregando..."
            catalogoGrid.innerHTML = ''; 

            if (!data.categorias || data.categorias.length === 0) {
                catalogoGrid.innerHTML = '<p>Nenhum serviço encontrado.</p>';
                return;
            }

            // Itera sobre cada CATEGORIA
            data.categorias.forEach(categoria => {
                // Cria o título da categoria
                const tituloCategoria = document.createElement('h3');
                tituloCategoria.className = 'categoria-titulo'; 
                tituloCategoria.textContent = categoria.nome;
                catalogoGrid.appendChild(tituloCategoria);

                // Cria o grid para os serviços desta categoria
                const gridCategoria = document.createElement('div');
                gridCategoria.className = 'categoria-grid'; // Usa a classe que você já tem
                
                // Itera sobre os SERVIÇOS dentro da categoria
                categoria.servicos.forEach(servico => {
                    const card = document.createElement('div');
                    card.className = 'servico-card-item card'; // Reutiliza suas classes de estilo
                    
                    // Constrói o HTML interno do card com os novos detalhes
                    card.innerHTML = `
                        <img src="${basePath}${servico.imagem}" alt="${servico.nome}" class="servico-imagem">
                        <div class="servico-card-content">
                            <h4>${servico.nome}</h4>
                            
                            <p class="servico-o-que-e">${servico.descricao_curta}</p>

                            <h5><i class="fas fa-question-circle"></i> O que é?</h5>
                            <p class="servico-detalhe">${servico.o_que_e}</p>
                            
                            <h5><i class="fas fa-star"></i> Benefícios Diretos:</h5>
                            <ul class="servico-lista">
                                ${servico.beneficios.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                            </ul>
                            
                            <h5><i class="fas fa-box-open"></i> O que está incluído?</h5>
                            <ul class="servico-lista">
                                ${servico.o_que_inclui.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                            </ul>
                            
                            <a href="index.html#contato" class="btn-solicitar saiba-mais">Solicitar Orçamento</a>
                        </div>
                    `;
                    gridCategoria.appendChild(card);
                });

                catalogoGrid.appendChild(gridCategoria);
            });

        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            catalogoGrid.innerHTML = '<p>Não foi possível carregar os serviços. Tente novamente mais tarde.</p>';
        }
    }

    carregarServicos();
});