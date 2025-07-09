document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🚀 Script do chatbot carregado');
    
        // --- Elementos do DOM ---
        const chatContainer = document.getElementById('chatbot-container');
        const openBtn = document.getElementById('chat-open-btn');
        const closeBtn = document.getElementById('chat-close-btn');
        const minBtn = document.getElementById('chat-min-btn');
        const maxBtn = document.getElementById('chat-max-btn');
        const chatHeader = document.getElementById('chat-header');
        const chatBody = document.getElementById('chat-body');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const resetBtn = document.getElementById('chat-reset-btn');

        // Verificar se os elementos existem
        console.group('🔍 Verificando elementos essenciais do DOM para o chatbot:');
        console.log('chatContainer (#chatbot-container):', chatContainer);
        console.log('openBtn (#chat-open-btn):', openBtn);
        console.log('closeBtn (#chat-close-btn):', closeBtn);
        console.log('minBtn (#chat-min-btn):', minBtn);
        console.log('maxBtn (#chat-max-btn):', maxBtn);
        console.log('sendBtn (#send-btn):', sendBtn);
        console.log('chatInput (#chat-input):', chatInput);
        console.log('chatBody (#chat-body):', chatBody);
        console.log('resetBtn (#chat-reset-btn):', resetBtn);
        console.groupEnd();

        const essentialElementsFound = chatContainer && openBtn && sendBtn && chatInput && chatBody;
        if (!essentialElementsFound) {
            console.error('❌ ERRO CRÍTICO: Elementos essenciais do chatbot não encontrados no DOM. O chatbot não funcionará.');
            if (!chatContainer) console.error('  - Elemento com ID "chatbot-container" não encontrado.');
            if (!openBtn) console.error('  - Elemento com ID "chat-open-btn" não encontrado.');
            if (!sendBtn) console.error('  - Elemento com ID "send-btn" não encontrado.');
            if (!chatInput) console.error('  - Elemento com ID "chat-input" não encontrado.');
            if (!chatBody) console.error('  - Elemento com ID "chat-body" não encontrado.');
            return;
        }

        // --- Configuração da API ---
        // Define a URL do backend. Usa o servidor local para desenvolvimento e o servidor do Render em produção.
        const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000'
            : 'https://agilizatech.onrender.com'; // <-- IMPORTANTE: Use a URL do seu Web Service (backend) aqui.
        // --- Funções de Controle do Chat ---
        
        // Abrir o chat
        openBtn.addEventListener('click', function (e) {
            console.log('📱 Abrindo chat');
            e.preventDefault();
            e.stopPropagation();
            
            chatContainer.classList.remove('hidden');
            chatContainer.classList.add('chatbot-max');
            chatContainer.classList.remove('chatbot-min');
            openBtn.style.display = 'none';
            
            // Adicionar mensagem de boas-vindas se o chat estiver vazio
            if (chatBody.children.length === 0) {
                addMessage('Olá! Sou o assistente da Agiliza Tech. Como posso ajudá-lo hoje?', 'bot');
            }
            
            // Focar no input
            setTimeout(() => {
                chatInput.focus();
            }, 100);
        });

        // Fechar o chat
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                console.log('❌ Fechando e resetando o chat');
                e.preventDefault();
                e.stopPropagation();
                
                chatContainer.classList.add('hidden');
                chatContainer.classList.remove('chatbot-max', 'chatbot-min');
                openBtn.style.display = 'flex';

                // Limpa o histórico ao fechar, sem mostrar a mensagem de "reiniciado"
                // A saudação padrão será adicionada na próxima vez que o chat for aberto.
                resetChat(false);
            });
        }

        // Minimizar o chat
        if (minBtn) {
            minBtn.addEventListener('click', function (e) {
                console.log('➖ Minimizando chat');
                e.preventDefault();
                e.stopPropagation();
                
                chatContainer.classList.add('chatbot-min');
                chatContainer.classList.remove('chatbot-max');
            });
        }

        // Maximizar o chat
        function maximizeChat(e) {
            console.log('➕ Maximizando chat');
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            chatContainer.classList.remove('chatbot-min');
            chatContainer.classList.add('chatbot-max');
            
            // Focar no input após maximizar
            setTimeout(() => {
                chatInput.focus();
            }, 100);
        }

        if (maxBtn) {
            maxBtn.addEventListener('click', maximizeChat);
        }

        // Clique no header para maximizar quando minimizado
        if (chatHeader) {
            chatHeader.addEventListener('click', function (e) {
                // Só maximiza se o clique não foi em um botão e o chat está minimizado
                if (!e.target.closest('button') && chatContainer.classList.contains('chatbot-min')) {
                    maximizeChat(e);
                }
            });
        }

        // Função centralizada para resetar o chat
        function resetChat(showRestartMessage = true) {
            console.log('🔄 Resetando chat');
            try {
                localStorage.removeItem('chatAgilizaTech');
                chatBody.innerHTML = '';
                if (showRestartMessage) {
                    addMessage('Chat reiniciado. Como posso ajudá-lo?', 'bot');
                }
                console.log('✅ Chat resetado com sucesso');
            } catch (error) {
                console.error('❌ Erro ao resetar chat:', error);
            }
        }

        // --- Funções de Histórico ---
        
        function salvarHistoricoChat() {
            try {
                localStorage.setItem('chatAgilizaTech', chatBody.innerHTML);
                console.log('💾 Histórico salvo');
            } catch (error) {
                console.error('💾 Erro ao salvar histórico:', error);
            }
        }

        function restaurarHistoricoChat() {
            try {
                const historico = localStorage.getItem('chatAgilizaTech');
                if (historico) {
                    chatBody.innerHTML = historico;
                    // FIX: Reativa os botões de opção após restaurar o HTML
                    rebindOptionButtons();
                    chatBody.scrollTop = chatBody.scrollHeight;
                    console.log('📜 Histórico restaurado');
                }
            } catch (error) {
                console.error('📜 Erro ao restaurar histórico:', error);
            }
        }

        // Reativa os eventos de clique nos botões de opção do chat
        function rebindOptionButtons() {
            const optionButtons = chatBody.querySelectorAll('.chat-option-btn');
            optionButtons.forEach(button => {
                button.addEventListener('click', handleOptionClick);
            });
        }

        // Função para transformar URLs em links clicáveis
        function linkify(text) {
            const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return text.replace(urlRegex, function(url) {
                let fullUrl = url;
                if (!fullUrl.startsWith('http')) {
                    fullUrl = 'https://' + fullUrl;
                }
                return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            });
        }
        // --- Funções de Mensagens ---
        
        function addMessage(text, sender = 'bot', isHTML = false) { // isHTML é usado pelo indicador de "digitando"
            console.log(`💬 Adicionando mensagem (${sender}):`, text.substring(0, 50) + '...');
            
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${sender}`;
            const bubble = document.createElement('div');
            bubble.className = 'chat-bubble';

            // Regex para encontrar as opções formatadas como [OPCOES]...[/OPCOES]
            const optionsRegex = /\[OPCOES\]([\s\S]*?)\[\/OPCOES\]/;
            const match = text.match(optionsRegex);

            // Se for uma mensagem do bot, contiver opções e não for HTML pré-formatado
            if (sender === 'bot' && match && !isHTML) {
                // Renderiza o texto que vem ANTES das opções
                const pretext = text.replace(optionsRegex, '').trim();
                if (pretext) {
                    const p = document.createElement('p');
                    p.innerHTML = pretext.replace(/\n/g, '<br>'); // Converte quebras de linha
                    bubble.appendChild(p);
                }

                // Cria um container para os botões de opção
                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'chat-options';
                
                const optionsText = match[1].trim();
                const options = optionsText.split('\n').filter(opt => opt.trim() !== '');

                // Cria um botão para cada opção encontrada
                options.forEach(option => {
                    const optionMatch = option.match(/^\s*(\d+)\.\s*(.*)/);
                    if (optionMatch) {
                        const number = optionMatch[1];
                        const optionText = optionMatch[2].trim();

                        const button = document.createElement('button');
                        button.className = 'chat-option-btn';
                        button.textContent = optionText;
                        button.dataset.value = number; // Armazena o número para ser enviado
                        
                        button.addEventListener('click', handleOptionClick);
                        optionsContainer.appendChild(button);
                    }
                });
                bubble.appendChild(optionsContainer);
            } else if (isHTML) {
                // Para o indicador de "digitando"
                bubble.innerHTML = text;
            } else {
                // Para mensagens normais, converte quebras de linha em <br> para melhor formatação
                bubble.innerHTML = linkify(text.replace(/\n/g, '<br>'));
            }
            
            msgDiv.appendChild(bubble);
            chatBody.appendChild(msgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
            
            if (!sender.includes('typing-indicator')) {
                salvarHistoricoChat();
            }
        }

        // Função para lidar com o clique em um botão de opção
        function handleOptionClick(event) {
            const button = event.target;
            const choiceText = button.textContent;
            const choiceValue = button.dataset.value;

            button.parentElement.querySelectorAll('.chat-option-btn').forEach(btn => btn.disabled = true);
            addMessage(choiceText, 'user');

            // Lógica especial para as opções finais
            const lowerCaseText = choiceText.toLowerCase();

            if (lowerCaseText.includes('solicitar agendamento')) {
                // Envia a notificação em segundo plano
                requestScheduling(); 
                // Continua a conversa para obter a mensagem de confirmação do bot
                handleSendMessage(choiceValue); 
            } else {
                // Para todas as outras opções, apenas continua a conversa
                handleSendMessage(choiceValue);
            }
        }

        // Função para enviar a solicitação de agendamento para o backend
        async function requestScheduling() {
            console.log('📨 Enviando solicitação de agendamento...');
            const messageElements = chatBody.querySelectorAll('.chat-message:not(.typing-indicator)');
            const history = Array.from(messageElements).map(msg => ({
                role: msg.classList.contains('user') ? 'user' : 'model',
                parts: [{ text: msg.querySelector('.chat-bubble').innerText }]
            }));

            try {
                await fetch(`${API_URL}/api/request-scheduling`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ history })
                });
                console.log('✅ Notificação de agendamento enviada com sucesso para o servidor.');
            } catch (error) {
                console.error('❌ Falha ao enviar notificação de agendamento:', error);
                // O erro já é mostrado no chat principal, então não precisa de um alerta aqui.
            }
        }

        function showTypingIndicator() {
            console.log('⏳ Mostrando indicador de digitação');
            const typingIndicatorHTML = `
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            `;
            addMessage(typingIndicatorHTML, 'bot typing-indicator', true);
        }

        function hideTypingIndicator() {
            const indicator = chatBody.querySelector('.typing-indicator');
            if (indicator) {
                indicator.remove();
                console.log('⏳ Indicador de digitação removido');
            }
        }

        // --- Função Principal de Envio ---
        
        async function handleSendMessage(overrideText = null) {
            console.log('🔄 handleSendMessage iniciada');
            
            // Usa o texto do botão (se houver) ou o texto do campo de input
            const text = overrideText !== null ? String(overrideText) : chatInput.value.trim();
            console.log('📝 Texto capturado:', `"${text}"`);
            
            if (!text) {
                console.log('⚠️ Texto vazio, abortando envio');
                return;
            }

            console.log('📤 Processando envio da mensagem...');
            
            // Adiciona a mensagem do usuário à interface apenas se veio do input
            if (overrideText === null) {
                addMessage(text, 'user');
            }
            chatInput.value = '';
            showTypingIndicator();

            // Construir histórico das mensagens
            const messageElements = chatBody.querySelectorAll('.chat-message:not(.typing-indicator)');
            console.log('📋 Elementos de mensagem encontrados:', messageElements.length);
            
            const messages = Array.from(messageElements).map(msg => {
                const isUser = msg.classList.contains('user');
                const sender = isUser ? 'user' : 'model';
                const messageText = msg.querySelector('.chat-bubble').innerText;
                console.log(`📝 Mensagem mapeada (${sender}):`, messageText.substring(0, 30) + '...');
                return { role: sender, parts: [{ text: messageText }] };
            });

            console.log('📋 Histórico final construído:', messages.length, 'mensagens');

            try {
                console.log('🌐 Iniciando requisição para /chat...');
                
                const requestBody = { history: messages };
                console.log('📦 Corpo da requisição:', JSON.stringify(requestBody, null, 2));
                
                const response = await fetch(`${API_URL}/chat`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log('📡 Resposta recebida - Status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    // Tenta analisar o erro como JSON, se não, usa o texto.
                    try {
                        const errorJson = JSON.parse(errorText);
                        // Lança um erro com a mensagem específica do servidor
                        throw new Error(errorJson.response || errorJson.error || `Erro HTTP ${response.status}`);
                    } catch (e) {
                        // Se não for JSON, lança o erro com o texto bruto
                        throw new Error(errorText || `Erro HTTP ${response.status}`);
                    }
                }

                const data = await response.json();
                console.log('📨 Dados da resposta:', data);
                
                const botMessage = data.response || 'Desculpe, não recebi uma resposta válida do servidor.';
                addMessage(botMessage, 'bot');
                console.log('✅ Mensagem do bot adicionada com sucesso');

                // TODO: Implementar lógica para lidar com as opções de contato (agendamento, WhatsApp, mais informações)
                
            } catch (error) {
                console.error('❌ Erro completo ao enviar mensagem:', error);
                // A mensagem de erro agora vem diretamente do objeto Error, que foi capturado do servidor.
                const errorMessage = `Erro: ${error.message}`;
                
                addMessage(errorMessage, 'bot');
            } finally {
                hideTypingIndicator();
                console.log('🏁 handleSendMessage finalizada');
            }
        }

        // --- Event Listeners ---
        
        console.log('🔗 Configurando event listeners...');
        
        // Botão de envio - usando addEventListener em vez de onclick
        sendBtn.addEventListener('click', function(e) {
            console.log('🖱️ Clique no botão de envio detectado');
            e.preventDefault();
            e.stopPropagation();
            handleSendMessage();
        });

        // Tecla Enter no input
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                console.log('⌨️ Enter pressionado no input');
                e.preventDefault();
                e.stopPropagation();
                handleSendMessage();
            }
        });

        // Resetar histórico
        if (resetBtn) {
            resetBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                resetChat(true); // Chama a função de reset e mostra a mensagem
            });
        }

        // --- Inicialização ---
        
        // Restaurar histórico
        restaurarHistoricoChat();

        // Teste final dos elementos
        console.log('🧪 Teste final dos elementos:');
        console.log('Botão de envio clicável:', sendBtn && !sendBtn.disabled);
        console.log('Input funcional:', chatInput && !chatInput.disabled);
        console.log('Botão de minimizar clicável:', minBtn && !minBtn.disabled);
        
        // Teste de estilo do botão
        if (sendBtn) {
            const styles = getComputedStyle(sendBtn);
            console.log('🎨 Estilos do botão de envio:');
            console.log('- display:', styles.display);
            console.log('- visibility:', styles.visibility);
            console.log('- pointer-events:', styles.pointerEvents);
            console.log('- z-index:', styles.zIndex);
        }

        console.log('✅ Chatbot inicializado com sucesso');


        // --- Formulário de Contato com Feedback Aprimorado ---
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const button = form.querySelector('button');
                const status = document.createElement('p');
                status.className = 'form-status'; // Você pode estilizar esta classe se quiser
                if (!form.querySelector('.form-status')) {
                    form.appendChild(status);
                }

                button.textContent = 'Enviando...';
                button.disabled = true;
                status.textContent = '';

                const data = new FormData(form);
                fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        status.textContent = "Obrigado pelo seu contato!";
                        status.style.color = 'green';
                        form.reset();
                    } else {
                        status.textContent = "Oops! Houve um problema ao enviar seu formulário.";
                        status.style.color = 'red';
                    }
                    button.textContent = 'Enviar';
                    button.disabled = false;
                }).catch(error => {
                    status.textContent = "Oops! Houve um problema ao enviar seu formulário.";
                    status.style.color = 'red';
                    button.textContent = 'Enviar';
                    button.disabled = false;
                });
            });
        }
        
        // --- Hamburger Menu Logic ---
        const hamburgerBtn = document.getElementById('hamburger-menu');
        const mainNav = document.getElementById('main-nav');

        if (hamburgerBtn && mainNav) {
            hamburgerBtn.addEventListener('click', function() {
                mainNav.classList.toggle('open');
                document.body.classList.toggle('no-scroll'); // Trava/destrava o scroll do body
                // Toggle icon
                const icon = hamburgerBtn.querySelector('i');
                if (mainNav.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Fecha o menu ao clicar em um link da navegação (em telas móveis)
            mainNav.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' && mainNav.classList.contains('open')) {
                    hamburgerBtn.click(); // Simula um clique no botão para fechar
                }
            });
        }
        // --- Sticky Header on Scroll ---
        const header = document.querySelector('.main-header');
        if (header) {
            window.addEventListener('scroll', function() {
                // Adiciona a classe 'scrolled' ao header se a rolagem for maior que 50px
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }

        // --- Botão Voltar ao Topo ---
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) { // Mostra o botão após rolar 300px
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });

            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Rolagem suave para o topo
            });
        }

        // --- Rolagem Suave para Âncoras ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 100; // Altura do header fixo
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    // Close menu after clicking a link (for mobile)
                    if (mainNav && mainNav.classList.contains('open')) {
                        mainNav.classList.remove('open');
                        hamburgerBtn.querySelector('i').classList.remove('fa-times');
                        hamburgerBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
            });
        });

        // --- Ano Dinâmico no Rodapé ---
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        // --- Animação de Fade-in ao Rolar ---
        const sections = document.querySelectorAll('.fade-in-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => observer.observe(section));

    } catch (error) {
        console.error("Ocorreu um erro em main.js, mas a execução continuará:", error);
    }
});

/**
 * Exibe uma notificação toast na tela.
 * @param {string} message A mensagem a ser exibida.
 * @param {string} type O tipo de notificação ('info', 'success', 'error').
 * @param {number} duration A duração em milissegundos.
 */
function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Adiciona a classe 'show' para ativar a animação de entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove o toast após a duração especificada
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}