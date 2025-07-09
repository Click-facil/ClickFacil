# Projeto Agiliza Tech

Este é um projeto full-stack que consiste no site institucional e no sistema de backend da **AGILIZA TECH**. O frontend é um site estático e responsivo que apresenta a empresa, seu catálogo de serviços e modelos digitais. O backend, construído em Node.js, alimenta um chatbot interativo com a IA do Google Gemini, gerencia um sistema de pagamentos via SumUp e envia notificações por e-mail.

## ✨ Funcionalidades Principais

- **Frontend Responsivo:** Site com páginas de apresentação, catálogo de serviços e modelos digitais.
- **Chatbot com IA:** Assistente virtual integrado com a API do Google Gemini para responder perguntas e guiar os usuários.
- **Sistema de Pagamentos:** Integração com a API da SumUp para venda de produtos digitais.
- **Download Seguro:** Geração de links de download únicos e com tempo de expiração após a compra.
- **Notificações por E-mail:** Envio automático de e-mails para solicitações de agendamento e confirmação de compra.
- **Formulário de Contato:** Integrado com o serviço Formspree.

## Estrutura do Projeto

```
AgilizaTech/
├── docs/                   # Contém todos os arquivos do frontend (site público)
│   ├── css/
│   │   └── style.css       # Estilos CSS
│   ├── js/
│   │   ├── main.js         # Lógica do frontend (UI, chatbot, interações)
│   │   └── catalogo.js     # Script específico da página de catálogo
│   ├── images/             # Imagens do site
│   ├── index.html          # Página inicial
│   └── ...                 # Outras páginas HTML
├── server/                 # Contém todos os arquivos do backend
│   ├── server.js           # Servidor principal (Express.js)
│   └── info.js             # Base de conhecimento para a IA
├── .env                    # Arquivo para variáveis de ambiente (NÃO versionar)
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências e scripts do Node.js
└── README.md               # Esta documentação
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm (geralmente instalado com o Node.js)

### 1. Backend
1.  Clone o repositório.
2.  Na raiz do projeto, crie um arquivo chamado `.env`.
3.  Copie o conteúdo do exemplo abaixo para o seu `.env` e preencha com suas próprias chaves e credenciais.
4.  Instale as dependências do servidor: `npm install`
5.  Inicie o servidor: `npm start`
    - O backend estará rodando em `http://localhost:3000`.

### 2. Frontend
-   Para visualizar o site, basta abrir qualquer um dos arquivos `.html` da pasta `docs/` diretamente no seu navegador.
-   O JavaScript do frontend se conectará automaticamente ao backend local (`http://localhost:3000`) quando você estiver testando em sua máquina.

## 🔑 Variáveis de Ambiente (`.env`)

Seu arquivo `.env` deve ter a seguinte estrutura:

```ini
# API do Google Gemini
GEMINI_API_KEY="SUA_CHAVE_AQUI"

# API da SumUp
SUMUP_SECRET_KEY="SUA_CHAVE_AQUI"
SUMUP_MERCHANT_CODE="SEU_CODIGO_DE_COMERCIANTE_AQUI" # Encontre no seu painel SumUp
SUMUP_WEBHOOK_SECRET="SUA_CHAVE_SECRETA_DE_WEBHOOK_AQUI" # Crie no painel da SumUp

# Chave para painel de admin
ADMIN_SECRET_KEY="CRIE_UMA_SENHA_FORTE_AQUI"

# Configuração de E-mail (Nodemailer)
MAIL_HOST="smtp.example.com"
MAIL_PORT=587
MAIL_USER="seu_email@example.com"
MAIL_PASS="sua_senha_de_app"
MAIL_FROM='"Agiliza Tech" <seu_email@example.com>'
MAIL_TO="email_para_receber_notificacoes@example.com"

# URLs do Ambiente
CLIENT_URL="http://127.0.0.1:5500" # URL do seu frontend em desenvolvimento
SERVER_URL="http://localhost:3000" # URL do seu backend em desenvolvimento
PROD_CLIENT_URL="https://agiliza-tech.onrender.com" # URL do seu frontend EM PRODUÇÃO (exemplo)
```

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **IA:** Google Gemini API
- **Pagamentos:** SumUp API
- **E-mails:** Nodemailer
- **Hospedagem (Exemplo):** Render (Backend), GitHub Pages (Frontend)

## Licença

&copy; 2024 AGILIZA TECH. Todos os direitos reservados.