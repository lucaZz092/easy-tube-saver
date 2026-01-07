# TubeDown - Documentação da API

## Visão Geral

O TubeDown utiliza Edge Functions do Lovable Cloud para processar requisições de download de vídeos do YouTube. O sistema é dividido em duas funções principais:

1. **youtube-info**: Busca informações do vídeo
2. **youtube-download**: Processa requisições de download

---

## Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│   Frontend      │────▶│   Edge Function  │────▶│   YouTube API   │
│   (React)       │     │   (Deno)         │     │   (oEmbed)      │
│                 │◀────│                  │◀────│                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Endpoints

### 1. Buscar Informações do Vídeo

**Endpoint:** `youtube-info`

**Método:** POST

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "id": "VIDEO_ID",
    "title": "Título do Vídeo",
    "author": "Nome do Canal",
    "authorUrl": "https://www.youtube.com/channel/...",
    "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
    "thumbnailHQ": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
    "thumbnailMQ": "https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg",
    "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
    "watchUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
    "downloadOptions": {
      "video": [
        { "quality": "1080p", "format": "MP4", "estimatedSize": "~250 MB" },
        { "quality": "720p", "format": "MP4", "estimatedSize": "~150 MB" },
        { "quality": "480p", "format": "MP4", "estimatedSize": "~80 MB" },
        { "quality": "360p", "format": "MP4", "estimatedSize": "~40 MB" }
      ],
      "audio": [
        { "quality": "320kbps", "format": "MP3", "estimatedSize": "~10 MB" },
        { "quality": "192kbps", "format": "MP3", "estimatedSize": "~7 MB" },
        { "quality": "128kbps", "format": "MP3", "estimatedSize": "~4 MB" }
      ]
    }
  }
}
```

**Erros Possíveis:**
- `400`: URL não fornecida ou inválida
- `500`: Erro ao buscar informações do vídeo

---

### 2. Solicitar Download

**Endpoint:** `youtube-download`

**Método:** POST

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "quality": "1080p",
  "format": "MP4"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "videoId": "VIDEO_ID",
    "quality": "1080p",
    "format": "MP4",
    "type": "video",
    "message": "Preparando download MP4 1080p...",
    "instructions": [
      "1. Clique no botão de download abaixo",
      "2. Aguarde o processamento do vídeo",
      "3. O download iniciará automaticamente"
    ],
    "status": "ready"
  }
}
```

---

## Uso no Frontend

### Importando o Cliente

```typescript
import { getVideoInfo, requestDownload, isValidYouTubeUrl } from '@/lib/api/youtube';
```

### Buscando Informações do Vídeo

```typescript
const handleSearch = async (url: string) => {
  // Validar URL antes de enviar
  if (!isValidYouTubeUrl(url)) {
    console.error('URL inválida');
    return;
  }

  const response = await getVideoInfo(url);
  
  if (response.success) {
    console.log('Vídeo encontrado:', response.data);
  } else {
    console.error('Erro:', response.error);
  }
};
```

### Solicitando Download

```typescript
const handleDownload = async (url: string, quality: string, format: string) => {
  const response = await requestDownload(url, quality, format);
  
  if (response.success) {
    console.log('Download pronto:', response.data);
  } else {
    console.error('Erro:', response.error);
  }
};
```

---

## Formatos Suportados

### Vídeo (MP4)
| Qualidade | Resolução | Tamanho Estimado |
|-----------|-----------|------------------|
| 1080p     | 1920x1080 | ~250 MB          |
| 720p      | 1280x720  | ~150 MB          |
| 480p      | 854x480   | ~80 MB           |
| 360p      | 640x360   | ~40 MB           |

### Áudio (MP3)
| Qualidade | Bitrate | Tamanho Estimado |
|-----------|---------|------------------|
| 320kbps   | 320 kb/s| ~10 MB           |
| 192kbps   | 192 kb/s| ~7 MB            |
| 128kbps   | 128 kb/s| ~4 MB            |

---

## URLs Suportadas

O sistema aceita os seguintes formatos de URL do YouTube:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

---

## Tratamento de Erros

### Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200    | Sucesso |
| 400    | Requisição inválida (URL faltando ou formato incorreto) |
| 404    | Vídeo não encontrado |
| 500    | Erro interno do servidor |

### Estrutura de Erro

```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

---

## Limitações

1. **Rate Limiting**: O YouTube pode limitar requisições frequentes
2. **Vídeos Privados**: Não é possível acessar vídeos privados ou não listados
3. **Restrições Regionais**: Alguns vídeos podem ter restrições de região
4. **Conteúdo Protegido**: Vídeos com proteção DRM não podem ser baixados

---

## Notas de Implementação

Para uma implementação completa de download, seria necessário:

1. **Servidor com yt-dlp**: Um servidor separado rodando Python com yt-dlp
2. **API de Download**: Integração com serviços como Cobalt ou similares
3. **Armazenamento Temporário**: Storage para arquivos processados
4. **Fila de Processamento**: Sistema de filas para downloads em massa

O sistema atual busca informações reais do vídeo e está preparado para integrar com um serviço de download externo.
