// Arquivo: server.js

// --- 1. CONFIGURAÇÃO INICIAL ---
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const info = require('./info.js'); // Assumindo que este arquivo contém informações sobre seus produtos/serviços
const nodemailer = require('nodemailer');
const fs = require('fs').promises; // fs/promises para operações assíncronas
const crypto = require('crypto');

const axios = require('axios');
// Carrega variáveis de ambiente do arquivo .env na raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Validação da Chave de API
if (!process.env.GEMINI_API_KEY) {
    console.error('ERRO: GEMINI_API_KEY não definida no arquivo .env');
    console.error('Verifique se o arquivo .env existe na raiz do projeto e contém a chave da API');
    process.exit(1);
}
if (!process.env.SUMUP_SECRET_KEY) {  // Alterado para SumUp
    console.error('ERRO: Credencial da SumUp (SUMUP_SECRET_KEY) não definida no arquivo .env');
    process.exit(1);
}
if (!process.env.ADMIN_SECRET_KEY) {
    console.warn('AVISO: ADMIN_SECRET_KEY não definida. O painel de admin não será seguro.');
}
if (!process.env.SUMUP_MERCHANT_CODE) {
    console.error('ERRO: SUMUP_MERCHANT_CODE não definido no arquivo .env. Você pode encontrar este código no seu painel SumUp.');
    process.exit(1);
}
if (!process.env.SUMUP_WEBHOOK_SECRET) {
    // Apenas avisa, não encerra, para não quebrar o ambiente de dev se não for configurado.
    console.warn('AVISO: SUMUP_WEBHOOK_SECRET não definida. A verificação do webhook está desativada, o que é inseguro para produção.');
}

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5500';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

const ORDERS_FILE_PATH = path.join(__dirname, 'orders.json');

const app = express();

// --- Configuração de CORS ---
// Lista de origens permitidas.
const allowedOrigins = [
    // Adiciona a URL do cliente em produção a partir das variáveis de ambiente
    process.env.CLIENT_URL,
    // Adiciona URLs para desenvolvimento local
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',
    'https://agilizatech.onrender.com', // Backend em produção
    'https://agiliza-tech.onrender.com' // Frontend em produção
].filter(Boolean); // O .filter(Boolean) remove valores nulos ou indefinidos (se CLIENT_URL não estiver setado)

app.use(cors({
    origin: function (origin, callback) {
        console.log(`[CORS] Requisição da origem: ${origin}`);
        console.log(`[CORS] Origens permitidas: ${JSON.stringify(allowedOrigins)}`);
        // Permite requisições sem 'origin' (como apps mobile ou Postman) ou se a origem estiver na lista
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            console.log(`[CORS] Acesso permitido para: ${origin}`);
        } else {
            callback(new Error('Acesso de CORS não permitido para esta origem.'));
        }
    },
    methods: ['GET', 'POST'],
    // Adicionado 'x-admin-secret' para permitir o acesso do painel de admin
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret']
}));

app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        // Salva o buffer bruto (raw body) na requisição para verificação da assinatura
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true }));

// --- 2. CONSTRUÇÃO DO CONTEXTO DE SISTEMA ---
function formatarBaseDeConhecimento(servicos) {
    return servicos.map(servico => 
        `Serviço: ${servico.nome} | Descrição: ${servico.descricao} | Valor: R$ ${servico.valor.toFixed(2)}`
    ).join('\n');
}

const systemInstruction = `
${info.contexto}

--- BASE DE CONHECIMENTO DE SERVIÇOS ---
A seguir está a lista completa de serviços que você oferece. Use esta lista para responder às perguntas dos usuários sobre detalhes, preços e recomendações.
${formatarBaseDeConhecimento(info.servicos)}
------------------------------------------
`;

// --- 3. CONFIGURAÇÃO DO GEMINI ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemInstruction,
});

// --- 4. ENDPOINT PRINCIPAL DO CHATBOT ---
app.post('/chat', async (req, res) => {
    try {
        console.log('Recebida requisição do chat:', req.body);
        
        const { history } = req.body;
        
        if (!history || !Array.isArray(history) || history.length === 0) {
            return res.status(400).json({ 
                error: 'Histórico da conversa não recebido ou inválido.',
                // Fornece uma resposta padrão se o histórico estiver vazio, consistente com o frontend
                response: 'Olá! Sou o assistente da Agiliza Tech. Como posso ajudá-lo hoje?' 
            });
        }

        // REFINAMENTO: Utilizando model.generateContent para uma abordagem "stateless".
        // Como o frontend envia o histórico completo a cada requisição, não é necessário
        // usar `startChat`, que é mais indicado para manter o estado da conversa no servidor.
        // `generateContent` é mais direto e eficiente para este caso de uso.
        // O histórico (`history`) já contém a última mensagem do usuário e está no formato correto.
        const result = await model.generateContent({
            contents: history,
            // É possível adicionar configurações de geração aqui, se necessário
            // generationConfig: { maxOutputTokens: 2048, temperature: 0.9, topP: 1 },
        });

        const botResponse = result.response.text();
        
        console.log('Resposta do bot:', botResponse);
        res.json({ response: botResponse });

    } catch (error) {
        console.error('Erro detalhado no endpoint /chat:', error);
        
        // Resposta de erro mais amigável
        let errorMessage = "Desculpe, não consegui processar sua solicitação no momento.";
        
        if (error.message && error.message.includes('API_KEY')) {
            errorMessage = "Erro de configuração da API. Entre em contato com o suporte.";
        } else if (error.message && error.message.includes('quota')) {
            errorMessage = "Limite de uso da API atingido. Tente novamente mais tarde.";
        }
        
        res.status(500).json({ response: errorMessage });
    }
});

// --- 5. ENDPOINTS DE API ---
app.post('/api/request-scheduling', async (req, res) => {
    const { history } = req.body;

    if (!history || history.length < 3) {
        return res.status(400).json({ error: 'Histórico insuficiente para agendamento.' });
    }

    // Função para extrair informações relevantes do histórico
    function extractSchedulingInfo(chatHistory) {
        let customerInfo = null;
        let serviceName = null;

        // Itera sobre o histórico para encontrar o serviço e os dados do cliente
        for (let i = 0; i < chatHistory.length; i++) {
            const message = chatHistory[i];

            // Tenta encontrar o nome do serviço na mensagem do bot
            if (message.role === 'model') {
                const serviceMatch = message.parts[0].text.match(/O serviço '(.*?)'/);
                if (serviceMatch && serviceMatch[1]) {
                    // Pega a última ocorrência, caso o usuário mude de ideia
                    serviceName = serviceMatch[1];
                }
            }

            // Tenta encontrar os dados do cliente na mensagem do usuário
            // A heurística é: o bot pede os dados, a próxima mensagem do usuário contém os dados.
            if (message.role === 'model' && message.parts[0].text.includes('Qual o seu nome completo e um contato')) {
                // Verifica se a próxima mensagem existe e é do usuário
                if (i + 1 < chatHistory.length && chatHistory[i + 1].role === 'user') {
                    const potentialInfo = chatHistory[i + 1].parts[0].text;
                    // Evita pegar respostas simples como "1" ou "sim" como dados do cliente
                    if (potentialInfo.length > 5 && isNaN(potentialInfo)) {
                        customerInfo = potentialInfo;
                    }
                }
            }
        }
        // Adiciona logs para depuração
        console.log(`[Agendamento] Serviço extraído: ${serviceName}`);
        console.log(`[Agendamento] Informações do cliente extraídas: ${customerInfo}`);
        return { customerInfo, serviceName };
    }

    const { customerInfo, serviceName } = extractSchedulingInfo(history);

    if (!customerInfo || !serviceName) {
        return res.status(400).json({ error: 'Não foi possível extrair os dados do cliente ou o serviço do histórico.' });
    }

    // Configuração do Nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // Envio do e-mail
    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: process.env.MAIL_TO,
            subject: `Nova Solicitação de Agendamento: ${serviceName}`,
            html: `
                <h2>Nova Solicitação de Agendamento Recebida!</h2>
                <p><strong>Serviço de Interesse:</strong> ${serviceName}</p>
                <p><strong>Informações do Cliente:</strong></p>
                <pre>${customerInfo}</pre>
                <hr>
                <p><em>E-mail enviado automaticamente pelo chatbot do site Agiliza Tech.</em></p>
            `,
        });
        res.status(200).json({ message: 'Solicitação de agendamento enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail de agendamento:', error);
        res.status(500).json({ error: 'Falha ao enviar a notificação de agendamento.' });
    }
});

// Endpoint para criar uma ordem de pagamento na SumUp
app.post('/api/create-payment', async (req, res) => {
    try {
        const { title, price, downloadPath } = req.body;

        if (!title || !price || !downloadPath) {
            return res.status(400).json({ error: 'Dados do produto incompletos' }); // Mensagem mais clara
        }

        // Criação do checkout na SumUp
        const checkoutData = {
            checkout_reference: crypto.randomBytes(16).toString('hex'), // Referência única
            amount: price,
            currency: "BRL",
            merchant_code: process.env.SUMUP_MERCHANT_CODE, // CORREÇÃO: Usando merchant_code em vez do obsoleto pay_to_email
            description: `Compra de: ${title}`,
            customer_information: {},  // Detalhes do cliente podem ser adicionados aqui se disponíveis
            return_url: `${CLIENT_URL}/payment-success.html?checkout_reference={checkout_reference}`,
            cancel_url: `${CLIENT_URL}/payment-failure.html`,
            metadata: {  // Armazena dados adicionais, como o downloadPath
                downloadPath: downloadPath,
                productName: title,
                price: price,
            },
        };

        const response = await axios.post('https://api.sumup.com/v0.1/checkouts', checkoutData, {
            headers: {
                'Authorization': `Bearer ${process.env.SUMUP_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const checkoutResponse = response.data;

        // Log de diagnóstico: mostra a resposta completa da SumUp
        console.log('✅ Resposta da API da SumUp ao criar checkout:', JSON.stringify(checkoutResponse, null, 2));

        if (!checkoutResponse || !checkoutResponse.id) {
            console.error("Erro ao criar checkout na SumUp:", checkoutResponse);
            return res.status(500).json({ error: 'Falha ao iniciar o pagamento com SumUp' });
        }

        // A API da SumUp não retorna a URL de pagamento completa na resposta.
        // Nós a construímos usando o ID do checkout e o domínio correto para checkouts de clientes.
        const paymentUrl = `https://pay.sumup.com/b2c/${checkoutResponse.id}`;

        // Log de diagnóstico: mostra a URL final que será enviada ao frontend
        console.log(`➡️  URL de pagamento construída: ${paymentUrl}`);

        // Retorna a URL de pagamento para o frontend
        res.status(201).json({
            checkout_url: paymentUrl
        });

    } catch (error) {
        // Se o erro da SumUp tiver mais detalhes, vamos registrá-los.
        // Isso é comum em bibliotecas que encapsulam chamadas de API.
        if (error.response && error.response.data) {
            console.error('➡️ Detalhes da API da SumUp:', error.response.data);
        }
        res.status(500).json({ error: 'Falha ao comunicar com o processador de pagamento.', details: error.message });
    }
});

// Endpoint para receber webhooks da SumUp
app.post('/api/payment-webhook', async (req, res) => {
    // --- 1. Verificação da Assinatura do Webhook (Segurança Aprimorada) ---
    const sumupSignatureHeader = req.headers['sumo-signature']; // Nome correto do header da SumUp
    const webhookSecret = process.env.SUMUP_WEBHOOK_SECRET;

    if (webhookSecret) {
        if (!sumupSignatureHeader) {
            console.warn('⚠️ Webhook recebido sem assinatura (Sumo-Signature). Ignorando.');
            return res.status(400).send('Assinatura do webhook ausente.');
        }

        try {
            // 1. Extrai timestamp e assinatura do header
            const signatureParts = sumupSignatureHeader.split(',').reduce((acc, part) => {
                const [key, value] = part.split('=');
                acc[key.trim()] = value.trim();
                return acc;
            }, {});

            const timestamp = signatureParts.t;
            const signature = signatureParts.s;

            if (!timestamp || !signature) {
                console.error('❌ Header de assinatura mal formatado:', sumupSignatureHeader);
                return res.status(400).send('Header de assinatura mal formatado.');
            }

            // (Recomendado) Verificar se o timestamp é recente para evitar ataques de repetição
            const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
            if (new Date(parseInt(timestamp, 10) * 1000) < fiveMinutesAgo) {
                 console.warn('⚠️ Webhook com timestamp antigo recebido. Possível ataque de repetição.');
                 return res.status(400).send('Timestamp do webhook muito antigo.');
            }

            // 2. Prepara o payload assinado (timestamp + '.' + corpo da requisição)
            const signedPayload = `${timestamp}.${req.rawBody.toString('utf-8')}`;

            // 3. Computa a assinatura esperada
            const hmac = crypto.createHmac('sha256', webhookSecret);
            hmac.update(signedPayload);
            const expectedSignature = hmac.digest('hex');

            // 4. Compara as assinaturas de forma segura para evitar "timing attacks"
            if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
                console.error('❌ Assinatura de webhook inválida!');
                return res.status(403).send('Assinatura inválida.');
            }
            console.log('✅ Assinatura do webhook verificada com sucesso.');
        } catch (err) {
            console.error('❌ Erro ao verificar a assinatura do webhook:', err.message);
            return res.status(400).send(`Erro na verificação do webhook: ${err.message}`);
        }
    } else {
        console.warn('🔔 Webhook recebido, mas a verificação de assinatura está desativada (SUMUP_WEBHOOK_SECRET não definida).');
    }

    // --- 2. Processamento do Evento ---
    const { event, data } = req.body;
    console.log(`🔔 Evento de webhook verificado e processado: ${event}`);

    if (event === 'checkout.paid' && data && data.id) { // CORREÇÃO DE BUG: O evento correto é 'checkout.paid'
        try {
            const response = await axios.get(`https://api.sumup.com/v0.1/checkouts/${data.id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.SUMUP_SECRET_KEY}`
                }
            });
            const checkout = response.data;

            if (checkout && checkout.status === 'PAID' && checkout.metadata) {
                const { downloadPath, productName, price } = checkout.metadata;
                const payerEmail = checkout.customer?.email; // Usando optional chaining para segurança

                if (!downloadPath || !productName || !price) {
                    console.error('❌ ERRO no Webhook: Metadados do produto ausentes no checkout.', { metadata: checkout.metadata, checkoutId: checkout.id });
                    // Acusa recebimento para a SumUp, mas loga o erro e interrompe o fluxo.
                    return res.status(200).send('OK');
                }

                if (!payerEmail) {
                    console.error('❌ ERRO no Webhook: E-mail do cliente não encontrado no checkout.', { customer: checkout.customer, checkoutId: checkout.id });
                    // Mesmo com erro, é importante não enviar o e-mail de download, mas acusar recebimento.
                    return res.status(200).send('OK');
                }

                // Gera um token de download seguro
                const downloadToken = crypto.randomBytes(20).toString('hex');

                // Salva os detalhes do pedido (similar ao que você já fazia)
                try { // Bloco de try/catch robusto para manipulação de arquivo
                    let orders = [];
                    try {
                        const ordersData = await fs.readFile(ORDERS_FILE_PATH, 'utf-8');
                        orders = JSON.parse(ordersData);
                    } catch (readError) {
                        if (readError.code === 'ENOENT') {
                            console.log('Arquivo orders.json não encontrado. Um novo será criado.');
                        } else {
                            throw readError; // Lança outros erros de leitura
                        }
                    }

                    const newOrder = {
                        id: checkout.id, // Usar o ID do checkout da SumUp
                        date: new Date().toISOString(),
                        productName,
                        payerEmail,
                        price,
                        status: 'approved',
                        downloadPath,
                        downloadToken,
                        downloadExpires: Date.now() + 24 * 60 * 60 * 1000, // Expira em 24 horas
                        downloadUsed: false,  //  Controla se o link já foi usado.
                    };
                    orders.push(newOrder);
                    await fs.writeFile(ORDERS_FILE_PATH, JSON.stringify(orders.sort((a, b) => new Date(b.date) - new Date(a.date)), null, 2));
                    console.log(`💾 Pedido ${checkout.id} salvo com sucesso em orders.json`);
                } catch (fileError) {
                    console.error('❌ Erro crítico ao salvar o pedido no arquivo:', fileError);
                }

                const downloadUrl = `${SERVER_URL}/api/download?token=${downloadToken}`;
                const transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: process.env.MAIL_PORT == 465,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                });
                // Envia o e-mail com o link de download.
                await transporter.sendMail({
                    from: process.env.MAIL_FROM,
                    // to: 'destinatario_de_teste@exemplo.com',  // Para testes, comente a linha abaixo.
                    to: payerEmail,
                    subject: `✅ Seu produto Agiliza Tech está pronto para download!`,
                    html: `
                        <h2>Obrigado por sua compra!</h2>
                        <p>Olá!</p>
                        <p>Seu pagamento para o produto "<strong>${productName}</strong>" foi aprovado com sucesso.</p>
                        <p>Você já pode baixar seu arquivo clicando no link abaixo:</p>
                        <p style="text-align: center; margin: 20px 0;">
                            <a href="${downloadUrl}" style="background-color: #29abe2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Baixar meu Arquivo</a>
                        </p>
                        <p>Se o botão não funcionar, copie e cole a seguinte URL no seu navegador:</p>
                        <p><a href="${downloadUrl}">${downloadUrl}</a></p>
                        <hr>
                        <p>Atenciosamente,<br>Equipe Agiliza Tech</p>
                    `,
                });

                console.log(`📧 E-mail de confirmação enviado para: ${payerEmail}`);

            } else {  // Loga se o checkout não foi bem-sucedido ou metadata ausente.
                console.warn(`🔔 Pagamento recebido, mas não confirmado ou dados incompletos: ${checkout ? JSON.stringify(checkout) : 'checkout indefinido'}`);
            }

        } catch (error) {
            console.error('❌ Erro ao processar webhook da SumUp:', error.response ? error.response.data : error.message);
        }
    } else {  // Loga eventos não tratados.
        console.log(`🔔 Webhook da SumUp recebido (não processado): ${event}`, data);
    }

    //  Confirma o recebimento do webhook.  É importante responder com 200 OK sempre.
    res.status(200).send('OK');
});

// Endpoint para download seguro de arquivos
app.get('/api/download', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Token de download não fornecido.');
    }

    try {
        let orders = [];
        try {
            const ordersData = await fs.readFile(ORDERS_FILE_PATH, 'utf-8');
            orders = JSON.parse(ordersData);
        } catch (readError) {
            if (readError.code !== 'ENOENT') {
                throw readError; // Lança outros erros de leitura
            }
            // Se o arquivo não existe, `orders` continua como `[]`, o que é o comportamento correto.
        }

        const orderIndex = orders.findIndex(o => o.downloadToken === token);
        if (orderIndex === -1) {
            return res.status(404).send('Link de download inválido ou não encontrado.');
        }

        const order = orders[orderIndex];

        if (order.downloadUsed) {
            return res.status(410).send('Este link de download já foi utilizado.');
        }

        if (Date.now() > order.downloadExpires) {
            return res.status(410).send('Este link de download expirou.');
        }

        // Marca o link como usado e salva
        orders[orderIndex].downloadUsed = true;
        await fs.writeFile(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2));

        const filePath = path.join(__dirname, '..', 'docs', order.downloadPath);
        res.download(filePath);

    } catch (error) {
        console.error('Erro no endpoint de download:', error);
        res.status(500).send('Ocorreu um erro ao processar seu download.');
    }
});

// --- FUNÇÃO AUXILIAR PARA EVITAR REPETIÇÃO DE CÓDIGO ---
async function getFilteredOrders(startDate, endDate) {
    try {
        const ordersData = await fs.readFile(ORDERS_FILE_PATH, 'utf-8');
        let parsedOrders = JSON.parse(ordersData);

        // Filtra por data se os parâmetros forem fornecidos
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;
            parsedOrders = parsedOrders.filter(order => {
                const orderDate = new Date(order.date);
                return (!start || orderDate >= start) && (!end || orderDate <= end);
            });
        }
        return parsedOrders;
    } catch (readError) {
        if (readError.code === 'ENOENT') {
            console.log('Arquivo orders.json não encontrado, retornando lista vazia. Isso é normal se nenhum pedido foi feito ainda.');
            return []; // Retorna array vazio se o arquivo não existe
        }
        throw readError; // Lança outros erros (ex: JSON malformado)
    }
}

// Endpoint para o painel de administração buscar os pedidos
app.get('/api/get-orders', async (req, res) => {
    try {
        if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({ error: 'Acesso não autorizado.' });
        }

        const { startDate, endDate } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10; // 10 pedidos por página

        const allOrders = await getFilteredOrders(startDate, endDate);

        const totalOrders = allOrders.length;
        const totalPages = Math.ceil(totalOrders / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedOrders = allOrders.slice(startIndex, endIndex);

        res.json({ orders: paginatedOrders, totalPages, currentPage: page });
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ error: 'Falha ao buscar os pedidos.' });
    }
});

// Endpoint para o dashboard do admin com dados resumidos
app.get('/api/sales-summary', async (req, res) => {
    try {
        if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET_KEY) {
            return res.status(401).json({ error: 'Acesso não autorizado.' });
        }

        const { startDate, endDate } = req.query;
        const allOrders = await getFilteredOrders(startDate, endDate);

        if (allOrders.length === 0) {
            return res.json({
                totalRevenue: 0,
                totalOrders: 0,
                averageTicket: 0,
                chartData: { labels: [], data: [] }
            });
        }

        const totalRevenue = allOrders.reduce((sum, order) => sum + order.price, 0);
        const totalOrders = allOrders.length;
        const averageTicket = totalRevenue / totalOrders;

        const salesByDay = allOrders.reduce((acc, order) => {
            const date = new Date(order.date).toISOString().split('T')[0]; // Formato YYYY-MM-DD
            acc[date] = (acc[date] || 0) + order.price;
            return acc;
        }, {});

        // Ordena as datas e prepara os dados para o gráfico
        const sortedDates = Object.keys(salesByDay).sort();
        const chartLabels = sortedDates.map(date => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        const chartValues = sortedDates.map(date => salesByDay[date]);

        res.json({ totalRevenue, totalOrders, averageTicket, chartData: { labels: chartLabels, data: chartValues } });

    } catch (error) {
        console.error('Erro ao buscar resumo de vendas:', error);
        res.status(500).json({ error: 'Falha ao buscar o resumo de vendas.' });
    }
});

// Endpoint para fornecer os dados do catálogo de serviços
app.get('/api/catalog-data', (req, res) => {
    try {
        console.log('GET /api/catalog-data: Lendo dados de info.js...');
        const services = info.servicos;
        const categories = info.categoriasInfo;
        console.log('GET /api/catalog-data: Dados lidos:', { services, categories });

        // A base de conhecimento 'info.js' é a única fonte da verdade.
        res.json({
            services: services,
            categories: categories
        });
    } catch (error) {
        console.error('GET /api/catalog-data: Erro ao carregar dados:', error);
        res.status(500).json({ 
            error: 'Falha ao carregar os dados do catálogo.',
            details: error.message  // Adiciona detalhes do erro para auxiliar no diagnóstico
        });
    }
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/test', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando corretamente',
        timestamp: new Date().toISOString()
    });
});

// --- 7. INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 URL do Cliente (CLIENT_URL) configurada como: ${CLIENT_URL}`);
    console.log(`🔧 URL do Servidor (SERVER_URL) configurada como: ${SERVER_URL}`);
    console.log(`🔧 Teste a API em ${SERVER_URL}/test`);
    console.log(`🤖 Chat endpoint disponível em ${SERVER_URL}/chat`);
    console.log(`🔔 Webhook da SumUp deve ser configurado para: ${SERVER_URL}/api/payment-webhook`);
});