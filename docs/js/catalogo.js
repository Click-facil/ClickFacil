document.addEventListener('DOMContentLoaded', async function () {
  const grid = document.querySelector('.catalogo-grid');
  if (!grid) return;
  
  // Define a URL do backend. Usa o servidor local para desenvolvimento e o servidor do Render em produção.
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : 'https://agilizatech.onrender.com'; // <-- IMPORTANTE: Use a URL do seu Web Service (backend) aqui.
      
  console.log('Iniciando carregamento do catálogo de serviços...');
  console.log('API URL:', API_URL);
  grid.innerHTML = '<p class="loading-message">Carregando serviços...</p>';

  try {
    const response = await fetch(`${API_URL}/api/catalog-data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Dados recebidos do servidor:', data);
    const { services, categories: categoryNames } = data;

    // Limpa a mensagem de "carregando"
    grid.innerHTML = '';
    
    if (!services || !Array.isArray(services) || services.length === 0) {
        throw new Error('Dados de serviços inválidos ou ausentes.');
    }

    // Agrupa os serviços por categoria
    const servicesByCategory = services.reduce((acc, service) => {
      const category = service.categoria;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});

    // Itera sobre o objeto de nomes de categoria para manter a ordem
    for (const categoryKey in categoryNames) {
      const categoryDisplayName = categoryNames[categoryKey];
      const categoryServices = servicesByCategory[categoryKey];

      if (categoryServices && categoryServices.length > 0) {
        // Cria container da categoria
        const catDiv = document.createElement('div');
        catDiv.className = 'catalogo-categoria';

        // Título
        const catTitle = document.createElement('h3');
        catTitle.textContent = categoryDisplayName;
        catDiv.appendChild(catTitle);

        // Slider
        const slider = document.createElement('div');
        slider.className = 'catalogo-slider';


        // Cria slides
        categoryServices.forEach((servico) => {
          const card = document.createElement('div');
          card.className = 'catalogo-item';
          card.innerHTML = `
            <img src="${servico.imagem}" alt="${servico.nome}" class="catalogo-imagem">
            <h3>${servico.nome}</h3>
            <p>${servico.descricao}</p>
          `;
          slider.appendChild(card);
        });


        // Monta tudo
        catDiv.appendChild(slider);
        grid.appendChild(catDiv);
      }
    }

  } catch (error) {
    console.error('Falha ao carregar o catálogo de serviços:', error);
    let errorMessage = 'Não foi possível carregar os serviços. Tente novamente mais tarde.';

    // Tenta extrair uma mensagem mais específica do erro, se disponível
    if (error.message) {
        if (error.message.includes('404')) {
            errorMessage = 'Erro: Recurso não encontrado. Verifique a URL.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Erro no servidor: Tente novamente mais tarde.';
        }
    }

    grid.innerHTML = `<p class="error-message">${errorMessage}</p>`;
  }
});