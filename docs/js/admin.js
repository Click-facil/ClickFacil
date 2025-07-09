document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('admin-main-content');
    const loginForm = document.getElementById('login-form');
    const adminKeyInput = document.getElementById('admin-key-input');
    const loginError = document.getElementById('login-error');
    const tableBody = document.querySelector('#orders-table tbody');
    const refreshBtn = document.getElementById('refresh-btn');
    const paginationControls = document.getElementById('pagination-controls');
    const startDateInput = document.getElementById('start-date-input');
    const endDateInput = document.getElementById('end-date-input');
    const filterBtn = document.getElementById('filter-btn');
    const clearFilterBtn = document.getElementById('clear-filter-btn');

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://agilizatech.onrender.com';

    const showLogin = () => {
        mainContent.style.display = 'none';
        loginForm.style.display = 'flex';
    };

    const showPanel = () => {
        mainContent.style.display = 'block';
        loginForm.style.display = 'none';
        const filters = getFilters();
        fetchAndRenderDashboard(filters);
        fetchOrders(1, filters); // Carrega a primeira página ao mostrar o painel
    };

    const getFilters = () => ({
        startDate: startDateInput.value,
        endDate: endDateInput.value
    });

    const fetchAndRenderDashboard = async (filters = {}) => {
        const adminKey = sessionStorage.getItem('admin_secret_key');
        if (!adminKey) return;

        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const response = await fetch(`${API_URL}/api/sales-summary?${params.toString()}`, {
                headers: { 'x-admin-secret': adminKey }
            });
            if (!response.ok) throw new Error('Falha ao carregar dados do dashboard.');

            const summary = await response.json();

            // Atualiza os cards
            document.getElementById('total-revenue').textContent = `R$ ${summary.totalRevenue.toFixed(2)}`;
            document.getElementById('total-orders').textContent = summary.totalOrders;
            document.getElementById('average-ticket').textContent = `R$ ${summary.averageTicket.toFixed(2)}`;

            // Renderiza o gráfico
            renderSalesChart(summary.chartData);

        } catch (error) {
            console.error('Erro no dashboard:', error);
            // Pode adicionar uma mensagem de erro no local do dashboard se desejar
        }
    };

    let salesChartInstance = null;
    const renderSalesChart = (chartData) => {
        const ctx = document.getElementById('salesChart').getContext('2d');
        if (salesChartInstance) {
            salesChartInstance.destroy(); // Destrói o gráfico anterior para evitar sobreposição
        }
        salesChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Vendas por Dia (R$)',
                    data: chartData.data,
                    backgroundColor: 'rgba(41, 171, 226, 0.6)',
                    borderColor: 'rgba(41, 171, 226, 1)',
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    };

    const fetchOrders = async (page = 1, filters = {}) => {
        const adminKey = sessionStorage.getItem('admin_secret_key');
        if (!adminKey) {
            showLogin();
            return;
        }

        // Mostra um feedback visual de carregamento
        refreshBtn.textContent = 'Atualizando...';
        refreshBtn.disabled = true;
        if (page === 1) { // Mostra "carregando" apenas na primeira carga ou refresh
            tableBody.innerHTML = '<tr><td colspan="5">Carregando pedidos...</td></tr>';
        }

        try {
            const params = new URLSearchParams({ page, limit: 10 });
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);


            const response = await fetch(`${API_URL}/api/get-orders?${params.toString()}`, {
                headers: {
                    'x-admin-secret': adminKey
                }
            });

            if (response.status === 401) {
                sessionStorage.removeItem('admin_secret_key');
                loginError.textContent = 'Chave de acesso inválida.';
                loginError.style.display = 'block';
                showLogin();
                return;
            }

            if (!response.ok) {
                throw new Error('Falha ao buscar os pedidos.');
            }

            const { orders, totalPages, currentPage } = await response.json();

            tableBody.innerHTML = ''; // Limpa a mensagem de "carregando"

            if (orders.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">Nenhum pedido encontrado.</td></tr>';
                return;
            }

            orders.forEach(order => { // A ordenação já é feita no backend
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(order.date).toLocaleString('pt-BR')}</td>
                    <td>${order.productName}</td>
                    <td>${order.payerEmail}</td>
                    <td>${Number(order.price).toFixed(2)}</td>
                    <td><span class="status ${order.status}">${order.status}</span></td>
                `;
                tableBody.appendChild(row);
            });

            renderPagination(totalPages, currentPage);
        } catch (error) {
            console.error('Erro:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="error-message">${error.message}</td></tr>`;
        }
        finally {
            refreshBtn.textContent = 'Atualizar Lista';
            refreshBtn.disabled = false;
        }
    };

    const renderPagination = (totalPages, currentPage) => {
        paginationControls.innerHTML = '';
        if (totalPages <= 1) return;

        // Botão "Anterior"
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => fetchOrders(currentPage - 1, getFilters()));
        paginationControls.appendChild(prevButton);

        // Indicador de página
        const pageIndicator = document.createElement('span');
        pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
        paginationControls.appendChild(pageIndicator);

        // Botão "Próximo"
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próximo';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => fetchOrders(currentPage + 1, getFilters()));
        paginationControls.appendChild(nextButton);
    };


    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const key = adminKeyInput.value;
        if (key) {
            sessionStorage.setItem('admin_secret_key', key);
            loginError.style.display = 'none';
            showPanel();
        }
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const filters = getFilters();
            fetchAndRenderDashboard(filters);
            fetchOrders(1, filters);
        });
    }

    filterBtn.addEventListener('click', () => {
        const filters = getFilters();
        fetchAndRenderDashboard(filters);
        fetchOrders(1, filters);
    });

    clearFilterBtn.addEventListener('click', () => {
        startDateInput.value = '';
        endDateInput.value = '';
        showPanel(); // Recarrega tudo sem filtros
    });

    // Verifica se já está logado ao carregar a página
    if (sessionStorage.getItem('admin_secret_key')) {
        showPanel();
    } else {
        showLogin();
    }
});