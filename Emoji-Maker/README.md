# 🎨 Emoji Generator AI

Um gerador de emojis personalizados usando Inteligência Artificial. Este projeto permite criar emojis únicos baseados em descrições textuais, utilizando o modelo SDXL da Stability AI através da API do Replicate.

> **Nota**: Este é um projeto teste desenvolvido como parte do meu processo de aprendizagem em desenvolvimento de aplicações web com Inteligência Artificial. O objetivo é explorar e praticar a integração de diferentes tecnologias e APIs em um contexto real.

## ✨ Funcionalidades

- 🎯 Geração de emojis personalizados a partir de descrições textuais
- 💾 Armazenamento automático das imagens no Supabase
- ❤️ Sistema de curtidas para seus emojis favoritos
- 📥 Download dos emojis gerados
- 🎨 Interface moderna e responsiva
- 🔄 Histórico de emojis gerados

## 🚀 Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/) - Framework React com App Router
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [Replicate](https://replicate.com/) - API de IA para geração de imagens
- [Supabase](https://supabase.com/) - Backend e armazenamento
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes de UI
- [Sonner](https://sonner.emilkowal.ski/) - Notificações toast

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Replicate](https://replicate.com/) para API key
- Conta no [Supabase](https://supabase.com/) para banco de dados e storage

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/emoji-generator-AI.git
cd emoji-generator-AI
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
REPLICATE_API_TOKEN=seu_token_do_replicate
```

4. Configure o Supabase:

   a. Crie um novo projeto:
   - Acesse [Supabase](https://supabase.com/)
   - Clique em "New Project"
   - Dê um nome ao projeto
   - Escolha uma senha forte para o banco de dados
   - Selecione a região mais próxima
   - Aguarde a criação do projeto

   b. Configure a tabela `emojis`:
   - No menu lateral, vá em "Table Editor"
   - Clique em "New Table"
   - Nome da tabela: `emojis`
   - Copie e cole o seguinte SQL:
   ```sql
   create table emojis (
     id uuid default uuid_generate_v4() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     prompt text not null,
     image_url text not null,
     liked boolean default false
   );
   ```
   - Clique em "Save"

   c. Configure o Storage:
   - No menu lateral, vá em "Storage"
   - Clique em "New Bucket"
   - Nome do bucket: `emojis`
   - Marque a opção "Public bucket" (para permitir acesso público às imagens)
   - Clique em "Create bucket"

   d. Configure as políticas de segurança do bucket:
   - No bucket `emojis`, vá na aba "Policies"
   - Clique em "New Policy"
   - Selecione "Create a policy from scratch"
   - Nome da política: "Allow public access"
   - Em "Policy definition", selecione:
     - "SELECT" para permitir leitura pública
     - "INSERT" para permitir upload
   - Em "Target roles", selecione "authenticated" e "anon"
   - Clique em "Save policy"

   e. Obtenha as chaves de API:
   - No menu lateral, vá em "Project Settings"
   - Na aba "API", você encontrará:
     - Project URL (NEXT_PUBLIC_SUPABASE_URL)
     - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
     - service_role key (SUPABASE_SERVICE_ROLE_KEY)
   - Copie essas chaves para o arquivo `.env.local`

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🎮 Como Usar

1. Acesse a página inicial
2. Digite uma descrição do emoji que deseja criar (ex: "um gato feliz", "um coração brilhante")
3. Clique em "Gerar Emoji"
4. Aguarde a geração da imagem
5. Use os botões de curtir e download para interagir com o emoji gerado

## 📝 Estrutura do Projeto

```
emoji-maker/
├── app/                    # Rotas e páginas da aplicação
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── public/               # Arquivos estáticos
└── styles/              # Estilos globais
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Stability AI](https://stability.ai/) pelo modelo SDXL
- [Replicate](https://replicate.com/) pela API de IA
- [Supabase](https://supabase.com/) pelo backend e storage 