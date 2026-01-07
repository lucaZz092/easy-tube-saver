# Guia de Solução de Problemas

## Problema: "Não foi possível obter o link de download"

### Causas Comuns

#### 1. Vídeo com Restrições
**Sintomas:** Erro ao tentar baixar qualquer qualidade
**Causa:** O vídeo tem proteção de direitos autorais, está privado, ou tem restrições regionais
**Solução:** 
- Verifique se o vídeo é público
- Tente outro vídeo
- Use uma VPN se for restrição regional

#### 2. API Temporariamente Indisponível
**Sintomas:** Erro em todos os vídeos
**Causa:** O serviço Cobalt Tools pode estar em manutenção ou sobrecarregado
**Solução:**
- Aguarde alguns minutos e tente novamente
- O sistema tenta múltiplas instâncias automaticamente
- Verifique o status em: https://status.cobalt.tools (se disponível)

#### 3. Vídeo Muito Recente
**Sintomas:** Vídeos antigos funcionam, novos não
**Causa:** Vídeos muito novos (< 1 hora) podem não estar totalmente processados
**Solução:**
- Aguarde 1-2 horas após o upload
- Tente novamente mais tarde

#### 4. Vídeo Muito Longo
**Sintomas:** Vídeos curtos funcionam, longos não
**Causa:** Vídeos > 2 horas podem ter timeout
**Solução:**
- Use qualidades mais baixas (480p ou 360p)
- Aguarde mais tempo (até 60 segundos)

#### 5. Problema de CORS
**Sintomas:** Erro no console do navegador mencionando CORS
**Causa:** Bloqueio de política de origem cruzada
**Solução:**
- Verifique se está usando HTTPS
- Limpe o cache do navegador
- Tente outro navegador

## Verificações Passo a Passo

### 1. Abra o Console do Navegador
Pressione `F12` e vá para a aba "Console"

### 2. Procure por Logs
Busque pelos seguintes símbolos:
- 🔍 = Início da busca
- ✅ = Sucesso
- ❌ = Erro
- ⚠️ = Aviso

### 3. Identifique o Erro

#### Se ver: `❌ Erro HTTP 429`
**Problema:** Rate limiting (muitas requisições)
**Solução:** Aguarde 5-10 minutos

#### Se ver: `❌ Erro HTTP 403`
**Problema:** Vídeo bloqueado ou privado
**Solução:** Verifique se o vídeo é público

#### Se ver: `❌ Erro HTTP 500`
**Problema:** Erro do servidor Cobalt
**Solução:** Aguarde e tente novamente

#### Se ver: `⚠️ Status não esperado: error`
**Problema:** Vídeo não pode ser processado
**Solução:** 
- Vídeo pode ter restrições
- Tente outro vídeo para confirmar

## Testando a API Diretamente

Você pode testar se a API está funcionando:

```bash
curl -X POST https://api.cobalt.tools/api/json \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "vQuality": "720",
    "isAudioOnly": false
  }'
```

**Resposta esperada:**
```json
{
  "status": "redirect",
  "url": "https://..."
}
```

## Soluções Alternativas

### Opção 1: Servidor Local com yt-dlp
Se as APIs externas não funcionarem, use o servidor local:

```bash
cd server
npm install
npm start
```

Veja [server/README.md](../server/README.md) para detalhes.

### Opção 2: Extensões do Navegador
Use extensões confiáveis como:
- Video DownloadHelper (Firefox/Chrome)
- SaveFrom.net Helper

### Opção 3: Sites Alternativos
Como último recurso:
- SaveFrom.net
- Y2Mate.com (cuidado com anúncios)

## Problemas Conhecidos

### Livestreams
**Status:** ❌ Não suportado
**Motivo:** APIs não processam lives

### Vídeos Privados/Não Listados
**Status:** ❌ Não suportado
**Motivo:** Requerem autenticação

### Playlists
**Status:** ⚠️ Parcialmente suportado
**Motivo:** Apenas o primeiro vídeo é processado

### Shorts
**Status:** ✅ Suportado
**Motivo:** Tratados como vídeos normais

### Vídeos com Música Protegida
**Status:** ⚠️ Pode falhar
**Motivo:** Restrições de copyright

## Relatando Bugs

Se o problema persistir, abra uma issue no GitHub com:

1. **URL do vídeo** (se público)
2. **Logs do console** (copie as mensagens com 🔍, ✅, ❌, ⚠️)
3. **Navegador e versão**
4. **Mensagem de erro exata**

### Template de Issue

```markdown
**Descrição do Problema:**
[Descreva o que aconteceu]

**URL do Vídeo:**
[Cole o link, se público]

**Logs do Console:**
```
[Cole os logs aqui]
```

**Ambiente:**
- Navegador: [Chrome/Firefox/Safari]
- Versão: [XX.X.X]
- Sistema Operacional: [Windows/Mac/Linux]

**Passos para Reproduzir:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]
```

## FAQ

### Por que alguns vídeos funcionam e outros não?
Cada vídeo tem configurações diferentes de privacidade e copyright. Alguns podem ter restrições que impedem o download.

### O download é ilegal?
Depende do uso. Para uso pessoal e educacional geralmente é permitido, mas sempre respeite os direitos autorais e os termos de serviço do YouTube.

### Por que não baixa em 4K?
A API Cobalt tem limite de 1080p. Para 4K, use o servidor local com yt-dlp.

### Posso baixar playlists inteiras?
Não diretamente. Você precisa processar cada vídeo individualmente.

### O site armazena meus downloads?
Não. Todo o processamento é feito em tempo real e nada é armazenado no servidor.

### Preciso criar conta?
Não. O serviço é completamente anônimo e gratuito.

## Contato

Para problemas não resolvidos:
- GitHub Issues: [Abrir Issue](https://github.com/lucaZz092/easy-tube-saver/issues)
- Verifique issues existentes primeiro

---

**Última atualização:** Janeiro 2026
