import { useState } from "react";
import { Download, Music, Zap, Shield, Clock, Smartphone, Link, Clipboard, Loader2, Play, Eye, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getVideoInfo, isValidYouTubeUrl, VideoInfo, DownloadOption } from "@/lib/api/youtube";
import { getDirectDownloadLinks, downloadWithCobalt } from "@/lib/api/cobalt";

const features = [
  {
    icon: Download,
    title: "Múltiplas Qualidades",
    description: "Baixe em 1080p, 720p, 480p ou 360p. Escolha a qualidade ideal para você.",
  },
  {
    icon: Music,
    title: "Extração de Áudio",
    description: "Converta vídeos para MP3 em alta qualidade (320kbps ou 128kbps).",
  },
  {
    icon: Zap,
    title: "Super Rápido",
    description: "Servidores otimizados para downloads extremamente rápidos.",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Sem vírus, malware ou anúncios invasivos. Sua segurança é prioridade.",
  },
  {
    icon: Clock,
    title: "Sem Limites",
    description: "Baixe quantos vídeos quiser, sem restrições ou tempo de espera.",
  },
  {
    icon: Smartphone,
    title: "Funciona em Tudo",
    description: "Use em qualquer dispositivo: computador, tablet ou celular.",
  },
];

const Index = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<{
    video: Array<{ quality: string; format: string; url: string }>;
    audio: Array<{ quality: string; format: string; url: string }>;
  } | null>(null);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError(null);
      toast({ title: "Link colado!", description: "O link foi colado com sucesso." });
    } catch {
      toast({ title: "Erro ao colar", description: "Não foi possível acessar a área de transferência.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDownloadLinks(null);
    
    if (!isValidYouTubeUrl(url)) {
      setError("Por favor, insira um link válido do YouTube.");
      toast({ title: "Link inválido", description: "Por favor, insira um link válido do YouTube.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    const response = await getVideoInfo(url);

    if (response.success && response.data) {
      setVideoData(response.data);
      toast({ title: "Vídeo encontrado!", description: response.data.title });
      
      // Load direct download links
      setIsLoadingLinks(true);
      const linksResponse = await getDirectDownloadLinks(url);
      
      if (linksResponse.success && linksResponse.data) {
        setDownloadLinks(linksResponse.data);
      }
      setIsLoadingLinks(false);
    } else {
      setError(response.error || "Não foi possível encontrar o vídeo.");
      toast({ title: "Erro", description: response.error || "Não foi possível encontrar o vídeo.", variant: "destructive" });
    }
    
    setIsLoading(false);
  };

  const handleDirectDownload = (downloadUrl: string, quality: string, format: string) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `video_${quality}.${format.toLowerCase()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ 
      title: "Download iniciado!", 
      description: `Baixando ${format} ${quality}...`,
    });
  };

  const handleFallbackDownload = async (quality: string, format: string) => {
    toast({ 
      title: "Processando...", 
      description: "Obtendo link de download...",
    });

    const response = await downloadWithCobalt(url, quality, format);
    
    if (response.success && response.data?.downloadUrl) {
      handleDirectDownload(response.data.downloadUrl, quality, format);
    } else {
      toast({ 
        title: "Erro", 
        description: "Não foi possível obter o link de download. Tente outra qualidade.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setVideoData(null);
    setDownloadLinks(null);
    setUrl("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-100"
          style={{
            background: "radial-gradient(ellipse at center, hsla(0, 84%, 60%, 0.15) 0%, hsla(16, 100%, 60%, 0.05) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full animate-float opacity-50"
          style={{
            background: "radial-gradient(ellipse at center, hsla(16, 100%, 60%, 0.1) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="w-full py-6 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary-foreground fill-current" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-accent-foreground fill-current" />
                </div>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-foreground">TubeDown</h1>
                <p className="text-xs text-muted-foreground">Download rápido e fácil</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </nav>
          </div>
        </header>

        <main className="px-4 py-12 md:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm text-primary font-medium">100% Grátis • Sem Limites</span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Baixe vídeos do <span className="gradient-text">YouTube</span>
                <br />
                em segundos
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Converta e baixe vídeos em todas as qualidades, extraia áudio para MP3 e muito mais. Rápido, seguro e sem cadastro.
              </p>
            </div>

            {/* URL Input */}
            <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8">
              <div className="glass-card p-2 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Link className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                    }}
                    placeholder="Cole o link do vídeo do YouTube aqui..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-4 text-base"
                  />
                </div>
                <Button type="button" variant="glass" size="icon" onClick={handlePaste} className="shrink-0">
                  <Clipboard className="w-4 h-4" />
                </Button>
                <Button type="submit" variant="hero" size="lg" disabled={!url || isLoading} className="shrink-0">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar"}
                </Button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="w-full max-w-3xl mx-auto mb-8">
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Video Preview & Download Options */}
            {videoData && (
              <div className="space-y-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Video Preview */}
                <div className="glass-card overflow-hidden max-w-2xl mx-auto">
                  <div className="relative group">
                    <img 
                      src={videoData.thumbnail} 
                      alt={videoData.title} 
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        e.currentTarget.src = videoData.thumbnailHQ;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={videoData.watchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                      </a>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-lg text-foreground line-clamp-2 mb-2">
                      {videoData.title}
                    </h3>
                    <a 
                      href={videoData.authorUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{videoData.author}</span>
                    </a>
                  </div>
                </div>

                {/* Download Options */}
                <div className="w-full max-w-2xl mx-auto space-y-6">
                  {isLoadingLinks ? (
                    <div className="glass-card p-12 text-center">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Carregando opções de download...</p>
                    </div>
                  ) : downloadLinks && (downloadLinks.video.length > 0 || downloadLinks.audio.length > 0) ? (
                    <>
                      {/* Video Options with Direct Links */}
                      {downloadLinks.video.length > 0 && (
                        <div className="glass-card p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                              <Download className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-display font-semibold text-lg text-foreground">Vídeo</h3>
                              <p className="text-sm text-muted-foreground">Clique para baixar diretamente</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {downloadLinks.video.map((link, index) => (
                              <button
                                key={index}
                                onClick={() => handleDirectDownload(link.url, link.quality, link.format)}
                                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Download className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-semibold text-foreground">{link.quality} {link.format}</p>
                                    <p className="text-xs text-muted-foreground">Vídeo com áudio</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Baixar</span>
                                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Audio Options with Direct Links */}
                      {downloadLinks.audio.length > 0 && (
                        <div className="glass-card p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                              <Music className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-display font-semibold text-lg text-foreground">Áudio</h3>
                              <p className="text-sm text-muted-foreground">Clique para baixar diretamente</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {downloadLinks.audio.map((link, index) => (
                              <button
                                key={index}
                                onClick={() => handleDirectDownload(link.url, link.quality, link.format)}
                                className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                    <Music className="w-5 h-5 text-accent" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-semibold text-foreground">{link.quality} {link.format}</p>
                                    <p className="text-xs text-muted-foreground">Apenas áudio</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Baixar</span>
                                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Fallback: Show quality buttons that fetch on click */}
                      <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Download className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-lg text-foreground">Vídeo</h3>
                            <p className="text-sm text-muted-foreground">Download com áudio incluso</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['1080p', '720p', '480p', '360p'].map((quality) => (
                            <Button
                              key={quality}
                              variant="glass"
                              onClick={() => handleFallbackDownload(quality, 'MP4')}
                              className="w-full h-auto py-4 flex-col gap-1 hover:border-primary/50"
                            >
                              <span className="text-lg font-bold text-foreground">{quality}</span>
                              <span className="text-xs text-muted-foreground">MP4</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                            <Music className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-lg text-foreground">Áudio</h3>
                            <p className="text-sm text-muted-foreground">Extrair apenas o áudio</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {['320kbps', '192kbps', '128kbps'].map((quality) => (
                            <Button
                              key={quality}
                              variant="glass"
                              onClick={() => handleFallbackDownload(quality, 'MP3')}
                              className="w-full h-auto py-4 flex-col gap-1 hover:border-accent/50"
                            >
                              <span className="text-lg font-bold text-foreground">{quality}</span>
                              <span className="text-xs text-muted-foreground">MP3</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="text-center">
                    <button onClick={handleReset} className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                      Baixar outro vídeo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            <section id="features" className="py-16">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Por que usar o <span className="gradient-text">TubeDown</span>?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  A melhor ferramenta para baixar vídeos do YouTube com facilidade e segurança.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <div key={feature.title} className="glass-card p-6 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How it Works Section */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Como Funciona?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Em apenas 3 passos simples você baixa qualquer vídeo
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  { step: "1", title: "Cole o Link", desc: "Copie o link do vídeo do YouTube e cole no campo acima" },
                  { step: "2", title: "Escolha a Qualidade", desc: "Selecione a qualidade de vídeo ou áudio desejada" },
                  { step: "3", title: "Baixe", desc: "Clique no botão e o download começará automaticamente" },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Perguntas Frequentes</h2>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                {[
                  { q: "É grátis mesmo?", a: "Sim! O TubeDown é 100% gratuito, sem limites de downloads ou recursos pagos." },
                  { q: "Qual a qualidade máxima disponível?", a: "Você pode baixar vídeos em até 1080p (Full HD) e áudios em 320kbps." },
                  { q: "Funciona no celular?", a: "Sim! O site é totalmente responsivo e funciona em qualquer dispositivo." },
                  { q: "É seguro usar?", a: "Completamente seguro. Não armazenamos dados e não há riscos de vírus." },
                  { q: "Preciso criar conta?", a: "Não! Você pode usar o TubeDown sem nenhum cadastro ou login." },
                ].map((faq, index) => (
                  <div key={index} className="glass-card p-6">
                    <h3 className="font-display font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">© 2024 TubeDown. Ferramenta gratuita para download de vídeos.</p>
            <p className="text-xs text-muted-foreground/60 mt-2">Respeite os direitos autorais. Baixe apenas conteúdo permitido.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
