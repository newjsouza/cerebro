# CEREBRO APEX-ML v2.1

Sistema de análise com IA da Perplexity, com proxy backend seguro em Vercel.

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js (Serverless)
- **AI**: Perplexity API (llama-3.1-sonar-large-128k-online)
- **Deploy**: Vercel + GitHub Actions
- **CI/CD**: Automação completa

## 📦 Instalação Local

```bash
git clone https://github.com/newjsouza/cerebro.git
cd cerebro
npm install
cp .env.example .env
# Adicione sua PERPLEXITY_API_KEY no .env
npm run dev
```

## 🔑 Configuração

### 1. Obter IDs do Vercel

```bash
vercel login
vercel link
cat .vercel/project.json
```

### 2. Adicionar Secrets no GitHub

Vá em: `Settings > Secrets and variables > Actions > New repository secret`

```
PERPLEXITY_API_KEY=pplx-xxxxx
VERCEL_TOKEN=xxxxx
VERCEL_ORG_ID=xxxxx
VERCEL_PROJECT_ID=xxxxx
```

### 3. Adicionar Secret no Vercel

```bash
vercel secrets add perplexity-api-key "pplx-xxxxx"
```

## 🌐 Deploy

```bash
git add .
git commit -m "Deploy APEX-ML v2.1"
git push origin main
```

GitHub Actions irá automaticamente fazer deploy no Vercel.

## 📊 Endpoints

- `GET /` - Frontend
- `POST /api/proxy` - Proxy para Perplexity AI

## 🔒 Segurança

✅ API key armazenada em environment variables
✅ Sem exposição no frontend
✅ CORS configurado
✅ Rate limiting via Vercel
✅ HTTPS obrigatório

## 📄 Licença

MIT
