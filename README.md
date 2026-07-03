# AdGen AI — Agência Generativa

Plataforma SaaS de geração e gestão de conteúdo com IA para redes sociais, construída em React + Vite + Tailwind e backend Lovable Cloud (Supabase).

## Stack

- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS, shadcn/ui, React Router, TanStack Query
- **Backend:** Lovable Cloud (PostgreSQL, Auth, Storage, Edge Functions) via `@supabase/supabase-js`
- **Integrações:** Webhook n8n para publicação em redes sociais

## Pré-requisitos

- **Node.js 20+** e **npm** (ou Bun)
- **Git**
- Opcional: **Docker 24+** e **Docker Compose**

## Instalação local (Node)

```bash
# 1. Clone o repositório
git clone https://github.com/marckcrow/agenciagen-social-media.git
cd agenciagen-social-media

# 2. Instale as dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env    # se existir; caso contrário veja a seção abaixo

# 4. Rode o servidor de desenvolvimento
npm run dev
```

O app fica disponível em **http://localhost:8080**.

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```env
VITE_SUPABASE_URL="https://<seu-projeto>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<sua-anon-key>"
VITE_SUPABASE_PROJECT_ID="<seu-project-id>"
```

Em projetos Lovable Cloud esses valores já são preenchidos automaticamente.

### Scripts disponíveis

| Comando            | Descrição                              |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Servidor de desenvolvimento (porta 8080) |
| `npm run build`    | Build de produção em `dist/`           |
| `npm run preview`  | Preview local do build de produção     |
| `npm run lint`     | Lint com ESLint                        |

## Rodando com Docker

### Desenvolvimento (hot reload)

```bash
docker compose up --build
```

Acesse **http://localhost:8080**. Alterações em `src/` recarregam automaticamente.

### Build de produção (imagem estática com Nginx)

```bash
# Build da imagem
docker build --target prod -t agenciagen:latest .

# Rode
docker run --rm -p 8080:80 agenciagen:latest
```

Acesse **http://localhost:8080**.

## Estrutura do projeto

```
src/
├── components/       # Componentes React (admin/, register/, ui/)
├── contexts/         # Contextos (AuthContext)
├── hooks/            # Custom hooks
├── integrations/     # Cliente Supabase (auto-gerado)
├── lib/              # Utilitários
└── pages/            # Rotas da aplicação
supabase/
├── functions/        # Edge Functions
└── migrations/       # Migrações SQL
```

## Deploy

O deploy oficial é feito pelo Lovable via botão **Publish** no editor. Para hospedagem própria, use o estágio `prod` do Dockerfile em qualquer provedor que rode contêineres (Fly.io, Render, Railway, etc.).

## Licença

MIT
