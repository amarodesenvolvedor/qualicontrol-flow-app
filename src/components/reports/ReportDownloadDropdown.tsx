
import { Button } from "@/components/ui/button";
import { DownloadIcon, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReportDownloadDropdownProps {
  onDownload: (format: "pdf" | "excel") => void;
}

export const ReportDownloadDropdown = ({ onDownload }: ReportDownloadDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200"
        >
          <DownloadIcon className="h-4 w-4" />
          <span>Baixar</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-md border-blue-100 dark:border-blue-900">
        <DropdownMenuItem 
          onClick={() => onDownload("pdf")}
          className="flex items-center cursor-pointer px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/40 group transition-colors rounded-sm"
        >
          <FileText className="mr-2 h-4 w-4 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Formato PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDownload("excel")}
          className="flex items-center cursor-pointer px-3 py-2.5 hover:bg-green-50 dark:hover:bg-green-900/30 group transition-colors rounded-sm"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Formato Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
