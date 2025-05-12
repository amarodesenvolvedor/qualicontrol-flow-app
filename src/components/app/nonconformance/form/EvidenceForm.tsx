
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface EvidenceFormProps {
  files: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

const EvidenceForm = ({ files, onFileChange, onRemoveFile }: EvidenceFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidências</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="files">Anexar Arquivos</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center mt-2">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Arraste arquivos ou clique para fazer upload
              </p>
              <p className="text-xs text-muted-foreground">
                (Imagens, documentos, PDFs - máx. 10MB cada)
              </p>
              <Input
                id="files"
                type="file"
                multiple
                className="hidden"
                onChange={onFileChange}
              />
              <Button
                type="button" 
                variant="outline" 
                className="mt-2"
                onClick={() => document.getElementById('files')?.click()}
              >
                Selecionar Arquivos
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <Label>Arquivos Selecionados ({files.length})</Label>
              <ul className="space-y-2 mt-2">
                {files.map((file, index) => (
                  <li 
                    key={index} 
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveFile(index)}
                    >
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvidenceForm;
