
import React, { useState } from 'react';
import { FormLabel, FormDescription } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";
import { sanitizeFilename } from "@/utils/fileUtils";

interface FileUploadFieldProps {
  onFileChange: (file: File | null) => void;
  error: string | null;
  selectedFile: File | null;
}

export function FileUploadField({ onFileChange, error, selectedFile }: FileUploadFieldProps) {
  const [filenameWarning, setFilenameWarning] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFilenameWarning(null);

    if (!file) {
      onFileChange(null);
      return;
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      onFileChange(null);
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onFileChange(null);
      return;
    }

    // Check if filename contains special characters
    const originalFilename = file.name;
    const sanitizedFilename = sanitizeFilename(originalFilename);
    
    if (originalFilename !== sanitizedFilename) {
      setFilenameWarning(
        'O nome do arquivo contém caracteres especiais que serão removidos durante o upload.'
      );
    }

    onFileChange(file);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Arquivo PDF</FormLabel>
      <div className="flex items-center gap-4">
        <label 
          className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted ${
            error ? 'border-destructive' : ''
          }`}
        >
          <Upload className="h-4 w-4" />
          <span>Selecionar arquivo</span>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {selectedFile && (
          <div className="text-sm text-muted-foreground">
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
      
      {filenameWarning && (
        <Alert variant="warning" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {filenameWarning}
          </AlertDescription>
        </Alert>
      )}
      
      <FormDescription>
        Anexe o arquivo PDF do relatório de auditoria (máximo 10MB)
      </FormDescription>
    </div>
  );
}
