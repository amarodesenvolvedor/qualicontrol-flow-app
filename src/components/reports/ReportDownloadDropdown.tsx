
import { Button } from "@/components/ui/button";
import { DownloadIcon, ChevronDown } from "lucide-react";
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
        <Button size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Baixar
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onDownload("pdf")}>
          Formato PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload("excel")}>
          Formato Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
