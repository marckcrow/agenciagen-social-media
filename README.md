# 🚀 Agência Generativa

Uma plataforma completa de geração e gerenciamento de conteúdo digital com IA, desenvolvida para agências e profissionais de marketing digital.

## 📋 Sobre o Projeto

A Agência Generativa é uma aplicação web moderna que combina inteligência artificial com ferramentas de gestão para automatizar e otimizar a criação de conteúdo digital. A plataforma oferece desde geração automática de posts até análises detalhadas de performance.

### ✨ Principais Funcionalidades

- **🤖 Geração de Conteúdo com IA**: Criação automática de posts, legendas e conteúdo visual
- **📅 Agendamento Inteligente**: Sistema completo de agendamento de posts para múltiplas redes sociais
- **🔗 Conexões Sociais**: Integração com principais plataformas de mídia social
- **📊 Analytics Avançado**: Métricas detalhadas de performance e engajamento
- **👥 Gestão de Usuários**: Sistema completo de usuários com diferentes níveis de acesso
- **⚡ Webhook System**: Sistema robusto de webhooks para integrações
- **🛡️ Sistema de Roles**: Controle granular de permissões (Admin, Moderador, Usuário)
- **📈 Dashboard Administrativo**: Painel completo para administradores

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado servidor
- **React Hook Form** - Gerenciamento de formulários

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Edge Functions
  - Real-time subscriptions
  - Authentication

### Funcionalidades de Backend
- **Edge Functions**: Processamento de webhooks e métricas
- **Cron Jobs**: Agregação automática de métricas diárias
- **Sistema de Notificações**: Notificações em tempo real
- **Upload de Arquivos**: Gerenciamento de imagens de perfil

## 🏗️ Arquitetura do Projeto

```
src/
├── components/           # Componentes React reutilizáveis
│   ├── admin/           # Componentes administrativos
│   ├── register/        # Componentes de registro
│   └── ui/              # Componentes base (shadcn/ui)
├── contexts/            # Contextos React
├── hooks/               # Custom hooks
├── integrations/        # Integrações externas
│   └── supabase/        # Cliente e tipos Supabase
├── lib/                 # Utilitários e helpers
└── pages/               # Páginas da aplicação

supabase/
├── functions/           # Edge Functions
├── migrations/          # Migrações do banco de dados
└── config.toml          # Configuração do Supabase
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **`user_roles`** - Gerenciamento de roles dos usuários
- **`admin_metrics`** - Métricas administrativas agregadas
- **`usage_stats`** - Estatísticas de uso por usuário
- **`notifications`** - Sistema de notificações
- **`webhook_events`** - Log de eventos de webhook

### Segurança
- **Row Level Security (RLS)** ativado em todas as tabelas
- **Políticas granulares** baseadas em roles de usuário
- **Função `has_role()`** para verificação de permissões

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase

### Configuração

1. **Clone o repositório**
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd agencia-generativa
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Supabase**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute as migrações do banco de dados
   - Configure as variáveis de ambiente no `src/integrations/supabase/client.ts`

4. **Execute o projeto**
```bash
npm run dev
```

## 🔐 Sistema de Autenticação e Permissões

### Roles Disponíveis
- **Admin**: Acesso completo ao sistema
- **Moderador**: Acesso limitado às funcionalidades de moderação
- **Usuário**: Acesso às funcionalidades básicas

### Funcionalidades por Role

| Funcionalidade | Admin | Moderador | Usuário |
|---------------|-------|-----------|---------|
| Dashboard Administrativo | ✅ | ❌ | ❌ |
| Gerenciamento de Usuários | ✅ | ✅ | ❌ |
| Visualizar Webhooks | ✅ | ❌ | ❌ |
| Geração de Conteúdo | ✅ | ✅ | ✅ |
| Analytics Próprio | ✅ | ✅ | ✅ |

## 📊 Edge Functions

### Webhooks (`webhook-event`)
Processa eventos externos e atualiza métricas:
- Signup de usuários
- Upgrades de plano
- Geração de conteúdo
- Expiração de trial

### Agregador de Métricas (`daily-metrics-aggregator`)
Execução diária para agregação de:
- Contagem de usuários por plano
- Cálculo de MRR (Monthly Recurring Revenue)
- Métricas de conteúdo gerado
- Taxa de conversão e churn

## 🔧 Configurações e Customização

### Design System
- Todos os estilos seguem um design system centralizado
- Tokens semânticos definidos em `index.css`
- Componentes customizáveis via `tailwind.config.ts`

### Webhooks
Configure webhooks externos para integração com:
- Sistemas de pagamento
- Plataformas de IA
- Redes sociais
- Analytics externos

## 📱 Funcionalidades Futuras

- [ ] Integração com ChatGPT/Claude para geração de conteúdo
- [ ] Agendamento automático baseado em IA
- [ ] Analytics preditivo
- [ ] App móvel React Native
- [ ] Integração com mais redes sociais
- [ ] Sistema de templates personalizáveis

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte ou dúvidas sobre o projeto:
- Abra uma issue no GitHub
- Entre em contato através do e-mail: [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ para revolucionar a gestão de conteúdo digital**