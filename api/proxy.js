// api/proxy.js - Função Serverless para Vercel
const https = require('https');

// Configuração CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

/**
 * Função auxiliar para fazer requisições HTTPS
 */
function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

/**
 * Handler principal da função serverless
 */
module.exports = async (req, res) => {
  // Validação de método
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Only POST requests are accepted'
    });
  }

  try {
    // Validação de API Key
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Server Configuration Error',
        message: 'API key not configured'
      });
    }

    // Extrair body da requisição
    const requestBody = req.body;
    
    if (!requestBody || !requestBody.model || !requestBody.messages) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Missing required fields: model, messages'
      });
    }

    // Log da requisição (sem expor dados sensíveis)
    console.log('Proxy request:', {
      model: requestBody.model,
      messageCount: requestBody.messages?.length,
      timestamp: new Date().toISOString()
    });

    // Preparar requisição para Perplexity
    const postData = JSON.stringify(requestBody);
    
    const options = {
      hostname: 'api.perplexity.ai',
      port: 443,
      path: '/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    // Fazer requisição para Perplexity AI
    const response = await makeRequest(options, postData);

    // Tratar resposta
    if (response.statusCode === 200) {
      console.log('✓ Perplexity API success');
      return res.status(200).json(response.body);
    } else {
      console.error('✗ Perplexity API error:', response.statusCode);
      return res.status(response.statusCode).json({
        error: 'Perplexity API Error',
        statusCode: response.statusCode,
        details: response.body
      });
    }

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message
    });
  }
};
