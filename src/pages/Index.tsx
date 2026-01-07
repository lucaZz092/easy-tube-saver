import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Music, Zap, Shield, Clock, Smartphone } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UrlInput from "@/components/UrlInput";
import VideoPreview from "@/components/VideoPreview";
import DownloadOptions from "@/components/DownloadOptions";
import FeatureCard from "@/components/FeatureCard";
import BackgroundEffects from "@/components/BackgroundEffects";

const features = [
  {
    icon: Download,
    title: "Múltiplas Qualidades",
    description:
      "Baixe em 1080p, 720p, 480p ou 360p. Escolha a qualidade ideal para você.",
  },
  {
    icon: Music,
    title: "Extração de Áudio",
    description:
      "Converta vídeos para MP3 em alta qualidade (320kbps ou 128kbps).",
  },
  {
    icon: Zap,
    title: "Super Rápido",
    description:
      "Servidores otimizados para downloads extremamente rápidos.",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description:
      "Sem vírus, malware ou anúncios invasivos. Sua segurança é prioridade.",
  },
  {
    icon: Clock,
    title: "Sem Limites",
    description:
      "Baixe quantos vídeos quiser, sem restrições ou tempo de espera.",
  },
  {
    icon: Smartphone,
    title: "Funciona em Tudo",
    description:
      "Use em qualquer dispositivo: computador, tablet ou celular.",
  },
];

// Helper to extract video ID from YouTube URL
const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<{
    id: string;
    title: string;
    thumbnail: string;
    duration?: string;
    views?: string;
  } | null>(null);

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    const videoId = extractVideoId(url);

    if (videoId) {
      // Simulating API call - in real implementation, you'd fetch video info
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setVideoData({
        id: videoId,
        title: "Vídeo do YouTube",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: "10:32",
        views: "1.2M",
      });
    }

    setIsLoading(false);
  };

  const handleReset = () => {
    setVideoData(null);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />

      <div className="relative z-10">
        <Header />

        <main className="px-4 py-12 md:py-20">
          <div className="max-w-7xl mx-auto">
            <HeroSection />

            <div className="mb-16">
              <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
            </div>

            <AnimatePresence mode="wait">
              {videoData && (
                <motion.div
                  key="video-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 mb-20"
                >
                  <VideoPreview
                    videoId={videoData.id}
                    title={videoData.title}
                    thumbnail={videoData.thumbnail}
                    duration={videoData.duration}
                    views={videoData.views}
                  />
                  <DownloadOptions videoId={videoData.id} />

                  <div className="text-center">
                    <button
                      onClick={handleReset}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                    >
                      Baixar outro vídeo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Features Section */}
            <section id="features" className="py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Por que usar o{" "}
                  <span className="gradient-text">TubeDown</span>?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  A melhor ferramenta para baixar vídeos do YouTube com
                  facilidade e segurança.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    index={index}
                  />
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Perguntas Frequentes
                </h2>
              </motion.div>

              <div className="max-w-2xl mx-auto space-y-4">
                {[
                  {
                    q: "É grátis mesmo?",
                    a: "Sim! O TubeDown é 100% gratuito, sem limites de downloads ou recursos pagos.",
                  },
                  {
                    q: "Qual a qualidade máxima disponível?",
                    a: "Você pode baixar vídeos em até 1080p (Full HD) e áudios em 320kbps.",
                  },
                  {
                    q: "Funciona no celular?",
                    a: "Sim! O site é totalmente responsivo e funciona em qualquer dispositivo.",
                  },
                  {
                    q: "É seguro usar?",
                    a: "Completamente seguro. Não armazenamos dados e não há riscos de vírus.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <h3 className="font-display font-semibold text-foreground mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 TubeDown. Ferramenta gratuita para download de vídeos.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Respeite os direitos autorais. Baixe apenas conteúdo permitido.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
