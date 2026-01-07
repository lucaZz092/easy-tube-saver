import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Clipboard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

const UrlInput = ({ onSubmit, isLoading }: UrlInputProps) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      toast({
        title: "Link colado!",
        description: "O link foi colado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao colar",
        description: "Não foi possível acessar a área de transferência.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      onSubmit(url);
    } else {
      toast({
        title: "Link inválido",
        description: "Por favor, insira um link válido do YouTube.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="glass-card p-2 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Link className="w-5 h-5 text-muted-foreground" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole o link do vídeo do YouTube aqui..."
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-4 text-base input-glow"
          />
        </div>
        <Button
          type="button"
          variant="glass"
          size="icon"
          onClick={handlePaste}
          className="shrink-0"
        >
          <Clipboard className="w-4 h-4" />
        </Button>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={!url || isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Buscar"
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default UrlInput;
