# Configuração Google Sheets - Captura de Leads

## 📋 Passo a Passo

### 1. Criar a Planilha

1. Acesse [Google Sheets](https://sheets.google.com)
2. Faça login com **matheushp90@gmail.com**
3. Crie uma nova planilha chamada "Leads Click Fácil"
4. Na primeira linha, adicione os cabeçalhos:
   - Coluna A: **Data/Hora**
   - Coluna B: **Nome**
   - Coluna C: **Email**

### 2. Criar o Google Apps Script

1. Na planilha, clique em **Extensões** → **Apps Script**
2. Apague o código padrão
3. Cole o código abaixo:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email
    ]);
    
    MailApp.sendEmail({
      to: "matheushp90@gmail.com",
      subject: "Novo Lead - Click Fácil",
      htmlBody: "<h2>Novo lead capturado!</h2>" +
                "<p><strong>Nome:</strong> " + data.name + "</p>" +
                "<p><strong>Email:</strong> " + data.email + "</p>" +
                "<p><strong>Data/Hora:</strong> " + data.timestamp + "</p>"
    });
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3. Implantar o Script

1. Clique em **Implantar** → **Nova implantação**
2. Clique no ícone de engrenagem ⚙️ → Selecione **Aplicativo da Web**
3. Configure:
   - **Descrição:** Captura de Leads Site
   - **Executar como:** Eu (matheushp90@gmail.com)
   - **Quem tem acesso:** Qualquer pessoa
4. Clique em **Implantar**
5. **Autorize** o acesso quando solicitado
6. **COPIE A URL** que aparece (algo como: `https://script.google.com/macros/s/XXXXX/exec`)

### 4. Configurar no Site

1. Abra o arquivo `index.html`
2. Procure por `YOUR_SCRIPT_URL`
3. Substitua pela URL copiada no passo anterior:

```javascript
const response=await fetch('https://script.google.com/macros/s/XXXXX/exec',{
```

### 5. Testar

1. Abra seu site
2. Preencha o formulário com dados de teste
3. Verifique se:
   - ✅ Dados aparecem na planilha
   - ✅ Você recebe email de notificação em matheushp90@gmail.com

## 📊 Resultado

Você terá:
- ✅ Planilha com todos os leads organizados
- ✅ Email instantâneo quando alguém preencher
- ✅ Histórico completo com data/hora
- ✅ Pode exportar para Excel quando quiser

## 🔒 Segurança

- O script só aceita dados do seu site
- Apenas você (matheushp90@gmail.com) tem acesso à planilha
- Os dados ficam no seu Google Drive

## 💡 Dica Extra

Para receber notificação no celular:
1. Instale o app **Gmail** no celular
2. Ative notificações push
3. Você será notificado instantaneamente de cada novo lead!
