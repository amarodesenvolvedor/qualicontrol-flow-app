
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataItem } from "./types";

interface DetailDialogProps {
  selectedItem: DataItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DetailDialog = ({ selectedItem, open, onOpenChange }: DetailDialogProps) => {
  const navigate = useNavigate();

  const handleViewNonConformance = (id: string) => {
    navigate(`/nao-conformidades/${id}`);
    onOpenChange(false);
  };

  if (!selectedItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes: {selectedItem.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">
              Total: {selectedItem.value}
            </h4>
            <Badge>
              {selectedItem.name}
            </Badge>
          </div>
          
          {selectedItem.id && selectedItem.id.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {selectedItem.id.map((id, index) => (
                  <Card key={index} className="p-3 hover:bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{id}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedItem.descriptions?.[index] || "Sem descrição disponível"}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewNonConformance(id)}
                      >
                        Ver
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Sem registros detalhados disponíveis para este item.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
