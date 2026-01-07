# Como Funciona o Sistema de Download

## Visão Geral

O Easy Tube Saver implementa um sistema de download em múltiplas camadas para garantir a melhor experiência possível:

## 1. Busca de Informações do Vídeo

Quando o usuário cola um link do YouTube:

1. **Validação do Link**: O sistema verifica se é um URL válido do YouTube
2. **Extração do ID**: Extrai o ID único do vídeo
3. **Chamada à Edge Function**: Faz uma requisição para `youtube-info`
4. **API oEmbed**: A Edge Function usa a API pública do YouTube (oEmbed) para obter:
   - Título do vídeo
   - Autor/Canal
   - Thumbnail em várias qualidades
   - URL para visualização

## 2. Opções de Download

O sistema oferece:

### Vídeos:
- 1080p (Full HD)
- 720p (HD)
- 480p (SD)
- 360p (Baixa)

### Áudio:
- 320kbps (Alta qualidade)
- 192kbps (Média qualidade)
- 128kbps (Básica)

## 3. Processamento do Download

O sistema usa uma abordagem em cascata:

### Método 1: Cobalt Tools API (Primário)
```typescript
// Tentativa usando cobalt.tools
const response = await downloadWithCobalt(url, quality, format);
```

**Vantagens:**
- API gratuita e open source
- Download direto
- Suporta múltiplas qualidades
- Rápido

**Fluxo:**
1. Envia requisição POST para `api.cobalt.tools`
2. Recebe URL de download direto
3. Abre em nova aba para o usuário baixar

### Método 2: Serviços Externos (Fallback)
```typescript
// Se cobalt falhar, usa serviços alternativos
const fallbackUrl = getDownloadFallback(url, isAudio);
```

**Serviços usados:**
- Para vídeo: y2mate.com
- Para áudio: ytmp3.nu

**Fluxo:**
1. Redireciona usuário para o serviço
2. Usuário clica para processar
3. Download manual

### Método 3: Servidor Próprio (Opcional)

Para usuários avançados, há um servidor Node.js com `yt-dlp`:

```bash
# Instalar yt-dlp
brew install yt-dlp  # macOS
apt install yt-dlp   # Linux

# Executar servidor
cd server
npm install
npm start
```

**Vantagens:**
- Controle total
- Downloads diretos
- Processamento local
- Privacidade total

## 4. Arquitetura

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │ Cola URL
       ▼
┌─────────────────┐
│   React App     │ ◄── Validação do URL
│   (Frontend)    │ ◄── Busca informações
└────────┬────────┘
         │
         ├─── (1) youtube-info ──► YouTube oEmbed API
         │
         └─── (2) Download
                │
                ├─── Cobalt Tools API ──► Download Direto
                │
                ├─── Y2Mate/YTMP3 ──────► Redirect
                │
                └─── Servidor Local ────► yt-dlp
```

## 5. Segurança e Privacidade

### O que NÃO fazemos:
- ❌ Não armazenamos URLs
- ❌ Não salvamos dados do usuário
- ❌ Não fazemos tracking
- ❌ Não armazenamos vídeos no servidor

### O que fazemos:
- ✅ Processamento em tempo real
- ✅ Limpeza automática de arquivos temporários
- ✅ CORS configurado corretamente
- ✅ HTTPS em produção

## 6. Limitações

### Técnicas:
- Vídeos muito grandes podem ser lentos
- Alguns vídeos com restrições regionais podem falhar
- Vídeos privados não são suportados
- Livestreams não são suportados

### Legais:
- ⚠️ Respeite direitos autorais
- ⚠️ Use apenas para conteúdo permitido
- ⚠️ Siga os termos de serviço do YouTube

## 7. Melhorias Futuras

Possíveis implementações:

1. **Queue System**: Fila para downloads múltiplos
2. **Progresso**: Mostrar progresso do download
3. **Histórico**: Salvar histórico local (localStorage)
4. **Playlists**: Suporte para baixar playlists inteiras
5. **Legendas**: Opção de baixar legendas
6. **Formatos**: Mais formatos (WEBM, OGG, FLAC)

## 8. Troubleshooting

### "Download falhou"
- Verifique se o vídeo está disponível
- Tente outra qualidade
- Use o servidor local se disponível

### "URL inválida"
- Certifique-se de usar URL completa
- Formatos aceitos:
  - `https://youtube.com/watch?v=ID`
  - `https://youtu.be/ID`
  - `https://youtube.com/shorts/ID`

### "Vídeo não encontrado"
- Vídeo pode estar privado
- Vídeo pode ter sido deletado
- Restrições regionais

## 9. Contribuindo

Para adicionar novos métodos de download:

1. Crie arquivo em `src/lib/api/`
2. Implemente interface `ApiResponse<DownloadInfo>`
3. Adicione ao fluxo de fallback
4. Teste com vários tipos de vídeos

## 10. Recursos

- [Cobalt Tools](https://cobalt.tools/)
- [yt-dlp Documentação](https://github.com/yt-dlp/yt-dlp)
- [YouTube oEmbed API](https://oembed.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
