import { motion } from "framer-motion";
import { Play, Clock, Eye } from "lucide-react";

interface VideoPreviewProps {
  videoId: string;
  title: string;
  thumbnail: string;
  duration?: string;
  views?: string;
}

const VideoPreview = ({ videoId, title, thumbnail, duration, views }: VideoPreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden max-w-2xl mx-auto"
    >
      <div className="relative group">
        <img
          src={thumbnail}
          alt={title}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center"
          >
            <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
          </motion.div>
        </div>
        {duration && (
          <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-foreground line-clamp-2 mb-2">
          {title}
        </h3>
        {views && (
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Eye className="w-4 h-4" />
            <span>{views} visualizações</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoPreview;
