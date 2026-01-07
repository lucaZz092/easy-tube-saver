import { motion } from "framer-motion";
import { Download, Music, Video, FileVideo, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DownloadOption {
  quality: string;
  format: string;
  size: string;
  type: "video" | "audio";
}

interface DownloadOptionsProps {
  videoId: string;
}

const downloadOptions: DownloadOption[] = [
  { quality: "1080p", format: "MP4", size: "~250 MB", type: "video" },
  { quality: "720p", format: "MP4", size: "~150 MB", type: "video" },
  { quality: "480p", format: "MP4", size: "~80 MB", type: "video" },
  { quality: "360p", format: "MP4", size: "~40 MB", type: "video" },
  { quality: "320kbps", format: "MP3", size: "~10 MB", type: "audio" },
  { quality: "128kbps", format: "MP3", size: "~4 MB", type: "audio" },
];

const DownloadOptions = ({ videoId }: DownloadOptionsProps) => {
  const { toast } = useToast();

  const handleDownload = (option: DownloadOption) => {
    toast({
      title: "Download iniciado!",
      description: `Preparando ${option.format} ${option.quality}...`,
    });
    // Here would be the actual download logic
  };

  const videoOptions = downloadOptions.filter((o) => o.type === "video");
  const audioOptions = downloadOptions.filter((o) => o.type === "audio");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Video Options */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              Vídeo
            </h3>
            <p className="text-sm text-muted-foreground">
              Download com áudio incluso
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {videoOptions.map((option, index) => (
            <motion.div
              key={option.quality}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Button
                variant="glass"
                onClick={() => handleDownload(option)}
                className="w-full h-auto py-4 flex-col gap-1 hover:border-primary/50"
              >
                <span className="text-lg font-bold text-foreground">
                  {option.quality}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.format} • {option.size}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audio Options */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Music className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              Áudio
            </h3>
            <p className="text-sm text-muted-foreground">
              Extrair apenas o áudio
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {audioOptions.map((option, index) => (
            <motion.div
              key={option.quality}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Button
                variant="glass"
                onClick={() => handleDownload(option)}
                className="w-full h-auto py-4 flex-col gap-1 hover:border-accent/50"
              >
                <span className="text-lg font-bold text-foreground">
                  {option.quality}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.format} • {option.size}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="hero"
          size="xl"
          onClick={() => handleDownload(videoOptions[0])}
          className="flex-1"
        >
          <Download className="w-5 h-5" />
          Melhor Qualidade (1080p)
        </Button>
        <Button
          variant="glass"
          size="xl"
          onClick={() => handleDownload(audioOptions[0])}
          className="flex-1"
        >
          <Music className="w-5 h-5" />
          Extrair MP3
        </Button>
      </div>
    </motion.div>
  );
};

export default DownloadOptions;
