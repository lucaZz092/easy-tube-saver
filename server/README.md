# Servidor de Downloads (Opcional)

Este é um servidor backend opcional que usa `yt-dlp` para fazer downloads diretos de vídeos do YouTube.

## Por que usar?

O aplicativo web funciona sem este servidor, usando serviços externos (cobalt.tools). No entanto, se você quiser ter controle total sobre os downloads, pode executar este servidor localmente.

## Pré-requisitos

1. **Node.js** instalado (v18 ou superior)
2. **yt-dlp** instalado no sistema

### Instalar yt-dlp

**macOS (Homebrew):**
```bash
brew install yt-dlp
```

**Linux (apt):**
```bash
sudo apt install yt-dlp
```

**Windows (pip):**
```bash
pip install yt-dlp
```

**Alternativa universal (usando pip):**
```bash
pip install yt-dlp
```

## Instalação

1. Navegue até a pasta do servidor:
```bash
cd server
```

2. Instale as dependências:
```bash
npm install
```

## Executar

```bash
npm start
```

O servidor iniciará na porta `3001` por padrão.

## Configurar o Frontend

Para usar este servidor no frontend, você precisa atualizar a configuração da API para apontar para `http://localhost:3001`:

1. Crie um arquivo `.env` na raiz do projeto:
```env
VITE_DOWNLOAD_SERVER_URL=http://localhost:3001
```

2. Atualize o código para usar o servidor local quando disponível.

## Endpoints

### GET `/health`
Verifica se o servidor e yt-dlp estão funcionando.

### POST `/api/video-info`
Obtém informações sobre o vídeo.

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### POST `/api/download`
Inicia o download de um vídeo.

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "quality": "1080p",
  "format": "MP4"
}
```

### GET `/api/file/:filename`
Baixa o arquivo processado.

## Notas

- Os arquivos baixados são armazenados temporariamente em `server/downloads/`
- Arquivos com mais de 1 hora são automaticamente deletados
- O servidor suporta downloads em paralelo

## Deploy (Produção)

Para produção, você pode usar serviços como:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- AWS EC2

Certifique-se de que o servidor tenha `yt-dlp` instalado e permissões para escrita na pasta de downloads.
