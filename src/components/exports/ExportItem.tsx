
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
  onExport: () => void;
}

export const ExportItem = ({ title, description, icon, tag, onExport }: ExportItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-4">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">{tag}</Badge>
        <Button variant="ghost" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
