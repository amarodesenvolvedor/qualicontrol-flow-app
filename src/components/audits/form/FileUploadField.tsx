
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpIcon, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface FileUploadFieldProps {
  onFileChange: (file: File | null) => void;
  isUploading: boolean;
  uploadProgress?: number;
  error?: string | null;
}

const FileUploadField = ({ 
  onFileChange, 
  isUploading,
  uploadProgress = 0,
  error
}: FileUploadFieldProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onFileChange(null);
      setSelectedFile(null);
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      onFileChange(null);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    onFileChange(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file">Arquivo do Relatório de Auditoria</Label>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className={`border-2 border-dashed rounded-md p-6 ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/50'
        } transition-colors duration-200 ease-in-out cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileBrowser}
      >
        <Input
          type="file"
          id="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center text-center">
            {getFileIcon(selectedFile.name)}
            <p className="font-medium mt-2">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatFileSize(selectedFile.size)}
            </p>
            
            {isUploading && (
              <div className="w-full mt-4">
                <Progress value={uploadProgress} className="h-2 w-full" />
                <p className="text-xs text-center mt-1">{uploadProgress}% concluído</p>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-2">
              Clique ou arraste outro arquivo para substituir
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <FileUpIcon className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium mt-2">
              Arraste e solte ou clique para selecionar um arquivo
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Formatos suportados: PDF, DOC, DOCX, JPG, PNG
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Tamanho máximo: 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadField;
