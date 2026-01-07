# Easy Tube Saver

YouTube Video Downloader - Baixe vídeos e áudios do YouTube de forma fácil e rápida, **diretamente do site**.

## 🚀 Funcionalidades

- ✅ **Download DIRETO** - Links de download aparecem no próprio site (como SaveFrom)
- ✅ Download de vídeos em múltiplas qualidades (1080p, 720p, 480p, 360p)
- ✅ Extração de áudio para MP3 (320kbps, 192kbps, 128kbps)
- ✅ Interface moderna e responsiva
- ✅ Sem necessidade de cadastro
- ✅ Totalmente gratuito
- ✅ Sem redirecionamentos para sites externos

## 🎯 Como Funciona

1. **Cole o link** do vídeo do YouTube
2. **Clique em "Buscar"** - o sistema carrega as informações do vídeo
3. **Veja os links de download** aparecerem automaticamente
4. **Clique no botão de download** da qualidade desejada
5. **O arquivo baixa direto** no seu computador!

> **Diferente de outros sites**, você NÃO é redirecionado para outras páginas. Tudo acontece aqui!

## 🛠️ Tecnologias

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase Edge Functions
- **Download:** Cobalt Tools API (download direto)
- **Fallback:** Sistema inteligente de recuperação

## 💡 Diferenciais

### ✨ Download Direto no Site
Diferente da maioria dos sites de download de YouTube:
- ❌ **Outros sites:** Redirecionam você para outras páginas cheias de anúncios
- ✅ **Easy Tube Saver:** Mostra os links de download diretamente no site
- ✅ **Experiência limpa:** Sem popups, sem redirecionamentos
- ✅ **Mais rápido:** Um clique e pronto!

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ ou Bun
- Conta Supabase (gratuita)

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/lucaZz092/easy-tube-saver.git
cd easy-tube-saver
```

2. Instale as dependências:
```bash
npm install
# ou
bun install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
bun dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🌐 Deploy das Edge Functions

Para fazer o deploy das funções Supabase:

```bash
# Login no Supabase CLI
supabase login

# Link com seu projeto
supabase link --project-ref SEU_PROJECT_REF

# Deploy das funções
supabase functions deploy youtube-info
supabase functions deploy youtube-download
```

## 🖥️ Servidor de Download Local (Opcional)

O aplicativo funciona usando APIs externas, mas você pode executar um servidor local para ter controle total dos downloads.

Veja [server/README.md](server/README.md) para mais detalhes.

## 📝 Como Usar

1. **Cole o link** do vídeo do YouTube no campo de busca
2. **Clique em "Buscar"** para carregar as informações do vídeo
3. **Aguarde** enquanto o sistema busca os links de download disponíveis
4. **Escolha a qualidade** desejada na lista que aparece
5. **Clique no botão de download** e o arquivo será baixado automaticamente

### 🎬 Exemplo de Uso

```
1. Copie: https://www.youtube.com/watch?v=dQw4w9WgXcQ
2. Cole no campo
3. Clique em "Buscar"
4. Veja os links aparecerem:
   - 1080p MP4 [Baixar] ⬇️
   - 720p MP4 [Baixar] ⬇️
   - 480p MP4 [Baixar] ⬇️
   - 320kbps MP3 [Baixar] ⬇️
5. Clique no que você quer e pronto!
```

## 🔒 Privacidade e Segurança

- Não armazenamos nenhum dado pessoal
- Não fazemos tracking de usuários
- Todos os downloads são processados de forma segura
- Código 100% open source

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ⚠️ Aviso Legal

Esta ferramenta é apenas para uso educacional e pessoal. Respeite os direitos autorais e os termos de serviço do YouTube. Baixe apenas conteúdo que você tem permissão para baixar.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no GitHub.

---

Desenvolvido com ❤️ por [lucaZz092](https://github.com/lucaZz092)

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Deploy no Vercel

1. Faça push do código para o GitHub
2. Conecte seu repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático!

### Deploy no Netlify

1. Faça push do código para o GitHub
2. Conecte seu repositório no [Netlify](https://netlify.com)
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Adicione as variáveis de ambiente
5. Deploy!

### Outras Opções

- GitHub Pages
- Cloudflare Pages
- Railway
- Render

Qualquer serviço que suporte aplicações Vite/React pode ser usado.
