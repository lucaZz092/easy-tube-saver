import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExternalLink } from "lucide-react";

interface FallbackService {
  name: string;
  url: string;
}

interface DownloadFallbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: FallbackService[];
  onSelectService: (url: string) => void;
}

export function DownloadFallbackDialog({
  open,
  onOpenChange,
  services,
  onSelectService,
}: DownloadFallbackDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Download Alternativo</AlertDialogTitle>
          <AlertDialogDescription>
            O download direto não está disponível no momento. Escolha um serviço alternativo:
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-2 py-4">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectService(service.url);
                onOpenChange(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
            >
              <div>
                <p className="font-medium text-foreground">{service.name}</p>
                <p className="text-xs text-muted-foreground">Serviço externo de download</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
