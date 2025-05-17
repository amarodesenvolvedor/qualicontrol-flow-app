
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
        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-white hover:bg-gray-50">
          <DownloadIcon className="h-4 w-4 mr-1" />
          <span>Baixar</span>
          <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        <DropdownMenuItem 
          onClick={() => onDownload("pdf")}
          className="flex items-center cursor-pointer px-3 py-2.5 hover:bg-gray-100"
        >
          <FileText className="mr-2 h-4 w-4 text-red-500" />
          <span>Formato PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDownload("excel")}
          className="flex items-center cursor-pointer px-3 py-2.5 hover:bg-gray-100"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <span>Formato Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
