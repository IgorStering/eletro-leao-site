# ⚡ Eletro Leão - Catálogo Online

Site de catálogo de produtos eletrônicos conectado a Google Sheets.

## 🚀 Quick Start

### 1. Configurar variáveis de ambiente

Copie o `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

Adicione suas chaves:
- `GOOGLE_SHEETS_API_KEY` - [Google Cloud Console](https://console.cloud.google.com)
- `UNSPLASH_API_KEY` - [Unsplash Developers](https://unsplash.com/developers)

### 2. Sincronizar produtos

```bash
npm run sync
```

### 3. Baixar imagens

```bash
npm run download-images
```

### 4. Desenvolver localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## 📋 Estrutura

```
├── app/                  # Páginas Next.js
│  ├── page.tsx          # Catálogo
│  └── product/[id]/     # Detalhes do produto
├── components/          # Componentes React
├── lib/                 # Funções utilitárias
├── data/                # products.json (sincronizado)
├── scripts/             # Scripts de sincronização
└── public/images/       # Imagens dos produtos
```

## 🔧 Comandos

- `npm run dev` - Desenvolver localmente
- `npm run build` - Build para produção
- `npm run sync` - Sincronizar Google Sheets
- `npm run download-images` - Baixar imagens do Unsplash
- `npm run lint` - Verificar código

## 📚 Documentação Completa

Veja [docs/SETUP.md](docs/SETUP.md) para instruções detalhadas.

## 🚀 Deploy no Vercel

1. Push no GitHub
2. Conectar ao Vercel
3. Adicionar variáveis de ambiente
4. Deploy automático!

## 📝 Notas

- Atualize produtos na Google Sheets
- Execute `npm run sync && npm run download-images`
- Commit e push para auto-deploy no Vercel

---

Desenvolvido com ❤️ usando Next.js + Tailwind CSS
