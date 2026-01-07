# Serviços de Download Alternativos

## Visão Geral

O Easy Tube Saver usa uma abordagem em cascata para garantir que você sempre consiga fazer o download dos seus vídeos favoritos. Se o método primário falhar, oferecemos múltiplas alternativas.

## Método Primário: Cobalt Tools

**URL:** `https://api.cobalt.tools`

**Características:**
- ✅ API gratuita e open source
- ✅ Download direto, sem redirecionamentos
- ✅ Suporta múltiplas qualidades
- ✅ Funciona para vídeo e áudio
- ✅ Sem anúncios
- ✅ Rápido e confiável

**Quando funciona:**
- Vídeos públicos do YouTube
- Vídeos sem restrições de região
- Vídeos sem proteção de copyright ativa

**Quando pode falhar:**
- Vídeos com restrições regionais
- Vídeos muito longos (>2 horas)
- Sobrecarga do servidor
- Vídeos privados ou não listados

## Serviços Alternativos para Vídeo

### 1. SaveFrom.net ⭐ (Recomendado)
**URL:** `https://en.savefrom.net`

**Características:**
- Interface simples e limpa
- Suporta múltiplas qualidades
- Funciona em navegadores mobile
- Sem necessidade de registro

**Como usar:**
1. A página abrirá automaticamente com o link do vídeo
2. Escolha a qualidade desejada
3. Clique em "Download"
4. O arquivo será baixado

### 2. 9xbuddy
**URL:** `https://9xbuddy.org`

**Características:**
- Suporta diversos sites além do YouTube
- Interface amigável
- Opções de qualidade variadas

**Como usar:**
1. O link já estará preenchido
2. Clique em "Download"
3. Escolha o formato desejado
4. Clique para baixar

### 3. Y2Mate
**URL:** `https://y2mate.com`

**Características:**
- Popular e confiável
- Múltiplas qualidades
- Opção de conversão para MP3

**Como usar:**
1. Clique em "Start" ou "Converter"
2. Aguarde o processamento
3. Escolha a qualidade
4. Clique em "Download"

## Serviços Alternativos para Áudio (MP3)

### 1. YTMP3.cc ⭐ (Recomendado)
**URL:** `https://ytmp3.cc`

**Características:**
- Especializado em conversão para MP3
- Alta qualidade de áudio
- Rápido e confiável
- Interface limpa

**Como usar:**
1. A página abrirá com o vídeo carregado
2. Clique em "Convert"
3. Aguarde o processamento
4. Clique em "Download"

### 2. MP3Juice
**URL:** `https://mp3juices.cc`

**Características:**
- Conversão rápida
- Qualidade 320kbps
- Sem limites de uso

**Como usar:**
1. O link já estará na busca
2. Clique no resultado
3. Clique em "Download"

### 3. 320ytmp3
**URL:** `https://320ytmp3.com`

**Características:**
- Qualidade máxima (320kbps)
- Interface simples
- Download rápido

**Como usar:**
1. Clique em "Convert"
2. Aguarde o processamento
3. Clique em "Download MP3"

## Dicas Importantes

### Bloqueadores de Anúncios
Recomendamos usar um bloqueador de anúncios (como uBlock Origin) ao usar serviços externos:
- Reduz anúncios intrusivos
- Melhora a experiência
- Aumenta a segurança

### Antivírus
Mantenha seu antivírus ativo:
- Protege contra downloads maliciosos
- Verifica arquivos automaticamente
- Dá mais segurança ao usar serviços externos

### Verificação de Arquivos
Sempre verifique o arquivo baixado:
- Confirme o tamanho (deve ser proporcional à duração)
- Verifique a extensão (.mp4, .mp3)
- Teste o arquivo antes de remover o original

### Privacidade
Os serviços externos:
- ⚠️ Podem ter seus próprios termos de privacidade
- ⚠️ Podem usar cookies
- ⚠️ Podem ter anúncios
- ✅ Não armazenam seus dados pessoais (na maioria)

## Solução de Problemas

### "Download não inicia"
1. Desative bloqueadores de pop-up temporariamente
2. Tente outro navegador
3. Limpe cache e cookies
4. Tente outro serviço da lista

### "Arquivo corrompido"
1. Baixe novamente
2. Tente uma qualidade diferente
3. Use outro serviço alternativo
4. Verifique espaço em disco

### "Qualidade baixa"
1. Escolha uma qualidade superior
2. Verifique se o vídeo original está em HD
3. Tente outro serviço
4. Use o servidor local (se disponível)

### "Vídeo não encontrado"
1. Verifique se o vídeo ainda está disponível no YouTube
2. Confirme se não é privado
3. Tente copiar o link novamente
4. Recarregue a página

## Alternativa: Servidor Local

Para máximo controle e privacidade, considere usar o servidor local:

```bash
cd server
npm install
npm start
```

Veja [server/README.md](../server/README.md) para mais detalhes.

## Questões Legais

⚠️ **IMPORTANTE:**
- Respeite os direitos autorais
- Baixe apenas conteúdo que você tem permissão
- Siga os termos de serviço do YouTube
- Use apenas para fins pessoais e educacionais

## Contribuindo

Conhece outro serviço confiável? Contribua!

1. Fork o repositório
2. Adicione o serviço em `src/lib/api/cobalt.ts`
3. Teste o funcionamento
4. Abra um Pull Request

---

**Nota:** Todos os serviços listados são de terceiros e independentes. Não temos controle sobre disponibilidade ou políticas destes serviços.
