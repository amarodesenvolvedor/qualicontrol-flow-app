
import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { AuditReport } from '@/types/audit';
import { supabase } from '@/integrations/supabase/client';
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

interface AuditReportListProps {
  auditReports: AuditReport[];
  onDelete: (id: string) => void;
}

export function AuditReportList({ auditReports, onDelete }: AuditReportListProps) {
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  
  const handleDownload = async (report: AuditReport) => {
    const { data, error } = await supabase.storage
      .from('audit_files')
      .download(report.file_path);
      
    if (error) {
      console.error('Error downloading file:', error);
      return;
    }
    
    // Create a temporary URL for the file
    const url = URL.createObjectURL(data);
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = report.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  };

  const handleView = async (report: AuditReport) => {
    const { data: publicURL } = supabase.storage
      .from('audit_files')
      .getPublicUrl(report.file_path);
      
    window.open(publicURL.publicUrl, '_blank');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pendente</span>;
      case 'in_progress':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Em Andamento</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Concluída</span>;
      default:
        return status;
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Data da Auditoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Arquivo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum relatório de auditoria encontrado.
                </TableCell>
              </TableRow>
            ) : (
              auditReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.department?.name || 'N/A'}</TableCell>
                  <TableCell>{format(new Date(report.audit_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{getStatusLabel(report.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{report.file_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(report.file_size)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleView(report)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="sr-only md:not-sr-only md:inline-block">Visualizar</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(report)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        <span className="sr-only md:not-sr-only md:inline-block">Baixar</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setReportToDelete(report.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="sr-only md:not-sr-only md:inline-block">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!reportToDelete} onOpenChange={() => setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este
              relatório de auditoria e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (reportToDelete) {
                  onDelete(reportToDelete);
                  setReportToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
