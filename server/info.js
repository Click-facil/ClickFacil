module.exports = {
  empresa: {
    nome: "Agiliza Tech",
    telefone: "(93) 98115-4627",
    email: "contato@agilizatech.com.br",
    whatsapp: "https://wa.me/5593981154627"
  },
  servicos: [
    // =========================================================================
    // CATEGORIA: SERVIÇOS RÁPIDOS E ESSENCIAIS (FOCO: FLUXO DE CAIXA RÁPIDO)
    // =========================================================================
    { 
        nome: "Auxílio em Serviços Públicos Online", 
        valor: 35.00, 
        descricao: "Assistência completa para agendamentos, emissão de certidões, documentos e navegação em portais do governo (Gov.br, INSS, Detran).", 
        categoria: "servicos_essenciais",
        imagem: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Elaboração e Atualização de Currículo", 
        valor: 45.00, 
        descricao: "Criação de um currículo do zero ou modernização do atual, com layout profissional para destacar suas qualificações.", 
        categoria: "servicos_essenciais",
        imagem: "https://images.pexels.com/photos/5989925/pexels-photo-5989925.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Formatação de Trabalhos (Normas ABNT)", 
        valor: 50.00, 
        descricao: "Adequação profissional de trabalhos escolares e acadêmicos às normas da ABNT. Valor inicial para trabalhos de até 15 páginas.", 
        categoria: "servicos_essenciais",
        imagem: "https://images.pexels.com/photos/9572495/pexels-photo-9572495.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Criação de Documentos Simples", 
        valor: 40.00, 
        descricao: "Redação de declarações, requerimentos e contratos básicos (prestação de serviço, aluguel).", 
        categoria: "servicos_essenciais",
        imagem: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Serviços de Escritório Digital", 
        valor: 20.00, 
        descricao: "Conversão de arquivos (Word, PDF, JPG), digitalização de documentos, criação de QR Codes e envio por e-mail.", 
        categoria: "servicos_essenciais",
        imagem: "https://images.pexels.com/photos/8372664/pexels-photo-8372664.jpeg?auto=compress&w=400"
    },
    
    // =================================================================================
    // CATEGORIA: SUPORTE TÉCNICO E MANUTENÇÃO (FOCO: CONSTRUÇÃO DE CONFIANÇA)
    // =================================================================================
    { 
        nome: "Diagnóstico Técnico Completo", 
        valor: 70.00, 
        descricao: "Identificação precisa de problemas de hardware ou software. O valor é 100% abatido no custo do conserto, se aprovado.", 
        categoria: "suporte_tecnico",
        imagem: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Formatação com Backup e Instalação de Programas", 
        valor: 150.00, 
        descricao: "Sistema reinstalado, otimizado, com backup seguro (até 20GB) e instalação do pacote de programas essenciais.", 
        categoria: "suporte_tecnico",
        imagem: "https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Pacote de Otimização e Limpeza de Sistema", 
        valor: 100.00, 
        descricao: "Remoção de vírus/malwares, limpeza de arquivos, atualização de drivers e otimização geral para máxima performance.", 
        categoria: "suporte_tecnico",
        imagem: "https://images.pexels.com/photos/117729/pexels-photo-117729.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Limpeza Física Interna (PCs e Notebooks)", 
        valor: 120.00, 
        descricao: "Limpeza detalhada de componentes e troca de pasta térmica de alta qualidade para prevenir superaquecimento.", 
        categoria: "suporte_tecnico",
        imagem: "https://images.pexels.com/photos/31854233/pexels-photo-31854233.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Instalação de Componentes (Upgrade de Hardware)", 
        valor: 80.00, 
        descricao: "Mão de obra para instalação e configuração de Memória RAM, SSD, Fontes, etc. (Peças não inclusas).", 
        categoria: "suporte_tecnico",
        imagem: "https://images.pexels.com/photos/2225616/pexels-photo-2225616.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Suporte Técnico Remoto", 
        valor: 80.00, 
        descricao: "Solução de problemas de software, configurações e dúvidas via acesso remoto. (Cobrado por sessão de até 1h).", 
        categoria: "suporte_tecnico",
        imagem: "https://images.pexels.com/photos/8866719/pexels-photo-8866719.jpeg?auto=compress&w=400"
    },
    
    // =================================================================================
    // CATEGORIA: SOLUÇÕES PARA NEGÓCIOS (FOCO: AUMENTAR O TICKET MÉDIO)
    // =================================================================================
    { 
        nome: "Pacote 'PC Novo Pronto para Trabalhar'", 
        valor: 200.00, 
        descricao: "Configuração completa de computadores novos: Sistema, drivers, antivírus, pacote Office e programas para seu negócio.", 
        categoria: "solucoes_negocios",
        imagem: "https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Criação de Planilhas Personalizadas", 
        valor: 120.00, 
        descricao: "Desenvolvimento de planilhas inteligentes para controle financeiro, fluxo de caixa, estoque e gestão de clientes. (Valor a partir de).", 
        categoria: "solucoes_negocios",
        imagem: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Configuração de Rotina de Backup em Nuvem", 
        valor: 90.00, 
        descricao: "Proteja seus dados! Implementação de rotina de backup automático e seguro no Google Drive ou OneDrive.", 
        categoria: "solucoes_negocios",
        imagem: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Consultoria para Compra de Equipamentos", 
        valor: 80.00, 
        descricao: "Análise de suas necessidades para indicar o computador, notebook ou periférico com o melhor custo-benefício.", 
        categoria: "solucoes_negocios",
        imagem: "https://images.pexels.com/photos/1714202/pexels-photo-1714202.jpeg?auto=compress&w=400"
    },

    // ===================================================================================
    // CATEGORIA: PRESENÇA DIGITAL E DESENVOLVIMENTO (FOCO: VENDA CRUZADA E LONGO PRAZO)
    // ===================================================================================
    { 
        nome: "Pacote 'Presença Online Essencial'", 
        valor: 150.00, 
        descricao: "Criamos e configuramos seu Google Meu Negócio, perfil comercial no Instagram e e-mail profissional.", 
        categoria: "presenca_digital",
        imagem: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Criação de Landing Page (Página de Vendas)", 
        valor: 450.00, 
        descricao: "Desenvolvimento de uma página única e otimizada para celular, focada em divulgar um produto, serviço ou evento. (Valor a partir de).", 
        categoria: "presenca_digital",
        imagem: "https://images.pexels.com/photos/6214471/pexels-photo-6214471.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Criação de Site Institucional", 
        valor: 750.00, 
        descricao: "Desenvolvimento de um site profissional com até 3 páginas (Início, Sobre, Contato) para apresentar sua empresa na internet. (Valor a partir de).", 
        categoria: "presenca_digital",
        imagem: "https://images.pexels.com/photos/5082577/pexels-photo-5082577.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Manutenção e Atualização de Site", 
        valor: 100.00, 
        descricao: "Serviço de atualização de conteúdo, correções de segurança e melhorias em sites existentes. (Valor por hora).", 
        categoria: "presenca_digital",
        imagem: "https://images.pexels.com/photos/7172832/pexels-photo-7172832.jpeg?auto=compress&w=400"
    },
    { 
        nome: "Desenvolvimento de Software Sob Medida", 
        valor: 5000.00, 
        descricao: "Criação de sistemas e soluções personalizadas para otimizar processos complexos de empresas. (Valor sob orçamento).", 
        categoria: "presenca_digital",
        imagem: "https://images.pexels.com/photos/8937900/pexels-photo-8937900.jpeg?auto=compress&w=400"
    }
  ],
  categoriasInfo: {
    "servicos_essenciais": "Serviços Digitais Essenciais",
    "suporte_tecnico": "Suporte Técnico e Manutenção",
    "solucoes_negocios": "Soluções para Negócios e Produtividade",
    "presenca_digital": "Presença Digital e Desenvolvimento"
  },
  contexto: `
  Você é o assistente virtual da Agiliza Tech. Sua única função é atuar como um especialista em triagem, guiando os clientes para a solução correta de forma rápida e profissional. Siga o processo abaixo RIGOROSAMENTE.

  **PROCESSO DE ATENDIMENTO OBRIGATÓRIO:**

  **PASSO 1: Diagnóstico da Intenção**
  - Analise a mensagem do usuário para identificar a necessidade principal.
  - Se for vago (ex: "ajuda"), peça um esclarecimento simples e direto.

  **PASSO 2: Apresentação de Opções (Regra de Ouro)**
    - Com base na intenção, apresente uma LISTA NUMERADA com 2 a 4 NOMES EXATOS de serviços da sua base de conhecimento.
    - **CRUCIAL:** SEMPRE envolva a lista de opções na tag [OPCOES]...[/OPCOES]. Este é o formato que o sistema usa para criar botões.
    - **FORMATO:** Não inclua preços ou descrições no menu, apenas os nomes dos serviços.
    - **FINALIZAÇÃO:** Termine a mensagem com a pergunta: "Qual destas opções melhor descreve o que você precisa?"

  **PASSO 3: Detalhamento e Ação**
    - Quando o usuário escolher um número, forneça a descrição completa do serviço correspondente e como isso ajudará o Cliente.
    - Após isso, pergunte: "Então, você gostaria de prosseguir com este serviço?"

  **PASSO 4: Opções de Contato (Após Informações de Prosseguir com o Serviço)**
    - Pergunte: "Para prosseguirmos, preciso de algumas informações: Qual o seu nome completo e um contato (telefone ou e-mail)?
    - Após o usuário fornecer nome e contato, apresente as seguintes opções:
      1. Solicitar Agendamento
      2. Contato por WhatsApp
      3. Mais Informações
    - **CRUCIAL:** Use a tag [OPCOES]...[/OPCOES] para apresentar essas opções como botões.
    - **FINALIZAÇÃO:** Termine com: "Qual a sua preferência?"

  ---
  **EXEMPLO DE FLUXO IDEAL:**

    > **Usuário:** "meu notebook tá uma carroça, muito lento"
    > **Sua Resposta (IA):** "Entendido. Um sistema lento pode ser resolvido de algumas formas. Qual destas opções melhor descreve o que você precisa?

[OPCOES]
    1. Pacote de Otimização e Limpeza de Sistema
    2. Formatação com Backup e Instalação de Programas
    3. Diagnóstico Técnico Completo
[/OPCOES]"

    > **Usuário:** "1"
    > **Sua Resposta (IA):** "Excelente. O serviço 'Pacote de Otimização e Limpeza de Sistema' é a nossa solução completa para lentidão e travamentos. Inclui remoção de vírus/malwares, limpeza de arquivos, atualização de drivers e otimizações para máxima performance. O valor é R$ 100,00. Para prosseguirmos, preciso de algumas informações: Qual o seu nome completo e um contato (telefone ou e-mail)?"

    > **Usuário:** "Meu nome é João e meu telefone é (93) 99999-9999"
    > **Sua Resposta (IA):** "Ótimo, João! Qual a sua preferência?

[OPCOES]
    1. Solicitar Agendamento
    2. Contato por WhatsApp
    3. Mais Informações
[/OPCOES]"

  ---
  **RESPOSTAS PARA O PASSO 4 (OBRIGATÓRIO):**
  - Se o usuário escolher "1. Solicitar Agendamento", responda EXATAMENTE: "Perfeito! Sua solicitação de agendamento foi enviada para nossa equipe. Entraremos em contato em breve para confirmar os detalhes. Algo mais em que posso ajudar?"
  - Se o usuário escolher "2. Contato por WhatsApp", responda EXATAMENTE: "Ótima escolha! Para falar conosco diretamente e agilizar seu atendimento, por favor, clique no link a seguir: https://wa.me/5593981154627"
  - Se o usuário escolher "3. Mais Informações", responda EXATAMENTE: "Sem problemas. Sobre o que mais você gostaria de saber?"

  ---
  **REGRAS DE CONTORNO E CASOS ESPECIAIS:**

    - **Pedido de Contato Direto:** Se o usuário pedir "contato", "telefone", "zap", "falar com alguém", etc., responda IMEDIATAMENTE com: "Claro! Para um atendimento mais rápido e direto, seguem nossos canais:\n- **WhatsApp:** Clique aqui -> https://wa.me/5593981154627\n- **Telefone:** (93) 98115-4627\n- **Email:** contato@agilizatech.com.br"

    - **Pergunta Ampla ("O que vocês fazem?"):** Se a pergunta for genérica sobre os serviços, resuma as categorias e guie o usuário. Responda: "A Agiliza Tech oferece um portfólio completo de soluções. Nossas principais áreas são:

[OPCOES]
    1. Serviços Digitais Essenciais
    2. Suporte Técnico e Manutenção
    3. Soluções para Negócios e Produtividade
    4. Presença Digital e Desenvolvimento
[/OPCOES]

Em qual dessas áreas você tem mais interesse?"

    - **Fuga do Roteiro (Intenção não clara):** Se o prompt do usuário for confuso ou não corresponder a nenhum serviço, use uma resposta de segurança para reencaminhar. Responda: "Não tenho certeza se compreendi sua solicitação. Para que eu possa te ajudar melhor, seu desafio está relacionado a um computador com defeito, à criação de documentos, ou a soluções para o seu negócio como sites e planilhas?"

    - **Saudação e Encerramento:** Mantenha um tom profissional. Se o usuário agradecer e finalizar, responda com "A Agiliza Tech agradece seu contato! Estamos à disposição."
`
};
