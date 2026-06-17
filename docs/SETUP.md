# 🔧 Setup - Eletro Leão Site

Guia completo para configurar o projeto.

## 1️⃣ Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta Google (para Google Sheets API)
- Conta Unsplash (para buscar imagens)

## 2️⃣ Instalação Inicial

```bash
# Clone o repositório
git clone <seu-repo>
cd eletro-leao-site

# Instale dependências (já feito, mas é bom rodar de novo)
npm install
```

## 3️⃣ Configurar Google Sheets API

### Passo 1: Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto (ou use um existente)
3. Pesquise por "Google Sheets API" e clique em "Enable"

### Passo 2: Criar Credenciais

1. Vá para "Credenciais" (esquerda)
2. Clique em "Criar Credenciais" → "Chave de API"
3. Copie a chave gerada

### Passo 3: Tornar a Planilha Pública

A planilha Google Sheets precisa estar acessível:

1. Abra a planilha
2. Clique em "Compartilhar"
3. Mude para "Visualização" (ou deixe público)

Ou adicione a service account do Google Cloud como editor.

## 4️⃣ Configurar Unsplash API

### Passo 1: Criar Conta

1. Acesse [unsplash.com/developers](https://unsplash.com/developers)
2. Clique em "Start Building" ou "Sign Up"
3. Complete o cadastro

### Passo 2: Criar Aplicação

1. Acesse seu [Dashboard de Aplicações](https://unsplash.com/oauth/applications)
2. Clique em "Create New Application"
3. Preencha o formulário (nome da app, descrição, uso)
4. Concorde com os termos
5. Copie a chave de acesso (Access Key)

**Nota:** A Unsplash API tem rate limit de 50 requisições/hora no free tier. Suficiente para sincronização inicial.

## 5️⃣ Configurar Variáveis de Ambiente

### Criar `.env.local`

Copie o arquivo `.env.example`:

```bash
cp .env.example .env.local
```

### Preencher valores

Abra `.env.local` e preencha:

```env
# Google Sheets
NEXT_PUBLIC_SHEETS_ID=1zIfqGy84T6nQ6UuevwiZvV8pvh7YKP3YLoiUXkfAg1U
GOOGLE_SHEETS_API_KEY=sua_chave_google_aqui

# Unsplash
UNSPLASH_API_KEY=sua_chave_unsplash_aqui

# WhatsApp (opcional, para link de contato)
NEXT_PUBLIC_WHATSAPP_NUMBER=5531999999999
```

## 6️⃣ Sincronizar Dados

### Primeiro: Sincronize a Planilha

```bash
npm run sync
```

Este comando:
- Lê todos os produtos da Google Sheets
- Converte para formato JSON
- Salva em `src/data/products.json`

**O que esperar:**
```
🔄 Synchronizing Google Sheets to products.json...

✓ Loaded XX products from Google Sheets

✅ Successfully synced XX products!
📁 Saved to: src/data/products.json

📋 Product summary:
   - Ar-condicionados: X products
   - Notebooks: X products
   - Smartphones: X products
```

### Segundo: Baixe as Imagens

```bash
npm run download-images
```

Este comando:
- Busca imagens no Unsplash para cada produto
- Baixa e salva em `/public/images/products/`
- Atualiza `src/data/products.json` com as URLs

**O que esperar:**
```
🖼️  Downloading product images from Unsplash...

Found XX products. Starting download...

⬇️  [1/XX] Downloading: Ar Condicionado Hisense...
✓ Downloaded image to public/images/products/AC-HISENSE-001.jpg
...

📊 Download Summary:
   ✓ Downloaded: XX
   ↩️  Already exists: X
   ✗ Failed: 0

✅ Updated products.json with image references!
```

## 7️⃣ Desenvolver Localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 8️⃣ Build & Deploy

### Build Local

```bash
npm run build
npm start
```

### Deploy no Vercel

1. Push seu código no GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Conecte no Vercel:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Import Project"
   - Selecione seu repositório GitHub
   - Adicione variáveis de ambiente (`GOOGLE_SHEETS_API_KEY`, `UNSPLASH_API_KEY`)
   - Clique em "Deploy"

3. Para sincronizações automáticas (opcional):
   - Configure GitHub Actions para rodar `npm run sync && npm run download-images` periodicamente
   - Ou execute manualmente via Vercel CLI

## 🔄 Atualizar Produtos

Quando adicionar novos produtos na Google Sheets:

1. Sincronizar dados:
   ```bash
   npm run sync
   ```

2. Baixar novas imagens:
   ```bash
   npm run download-images
   ```

3. Fazer commit e push:
   ```bash
   git add src/data/products.json public/images/products/
   git commit -m "Update products and images"
   git push
   ```

O Vercel fará deploy automático!

## 🐛 Troubleshooting

### Erro: "Missing GOOGLE_SHEETS_API_KEY"
- Verifique se `.env.local` existe
- Verifique se as chaves estão corretas
- Reinicie o terminal/IDE

### Erro: "No data found in Google Sheets"
- Verifique se a aba se chama "Produtos"
- Verifique se a planilha é acessível (compartilhada ou pública)
- Verifique se há dados na planilha

### Erro: "No Unsplash results"
- Alguns produtos podem não ter imagens no Unsplash
- Você pode adicionar imagens manualmente em `/public/images/products/`
- Nomeie como `{produto_id}.jpg`

### Imagens não aparecem no production
- Verificar se as imagens foram commitadas no Git
- Verificar se `src/data/products.json` tem as URLs corretas
- Verificar no console do navegador (Network tab) se as URLs estão retornando 200

## 📚 Estrutura Importante

```
src/
├── app/              → Páginas Next.js
├── components/       → Componentes React
├── lib/
│  ├── products.ts   → Funções de filtro
│  ├── google-sheets.ts
│  ├── unsplash.ts
│  └── types.ts
├── data/
│  └── products.json  → Base de dados sincronizada
└── scripts/
   ├── sync-sheets-to-json.ts
   └── download-product-images.ts

public/
└── images/
   └── products/     → Imagens dos produtos
```

## ✅ Checklist

- [ ] Google Sheets API key configurada
- [ ] Unsplash API key configurada
- [ ] `.env.local` preenchido
- [ ] `npm run sync` executado com sucesso
- [ ] `npm run download-images` completado
- [ ] `npm run dev` funcionando
- [ ] Produtos visíveis no http://localhost:3000
- [ ] Imagens carregando corretamente
- [ ] Repositório criado no GitHub
- [ ] Projeto importado no Vercel
- [ ] Deploy inicial funcionando

## 🚀 Próximos Passos

1. Customizar cores e branding
2. Adicionar seu número de WhatsApp
3. Configurar domínio customizado no Vercel
4. Adicionar analytics (Vercel Analytics)
5. Implementar newsletter ou sistema de contato

---

**Precisa de ajuda?** Verifique os logs dos scripts ou a documentação do Next.js.
