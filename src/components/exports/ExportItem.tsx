
import { Button } from "@/components/ui/button";
import { DownloadIcon, FileText, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExportItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  onExport: () => void;
  disabled?: boolean;
}

const ExportItem = ({ 
  title, 
  description, 
  icon, 
  count, 
  onExport, 
  disabled = false 
}: ExportItemProps) => {
  return (
    <Card 
      className={`p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 
                 transition-all duration-200 border-l-4 border-l-blue-500 
                 ${disabled ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-md'}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="bg-blue-100 p-2.5 rounded-full flex-shrink-0 shadow-sm">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-800">{title}</h3>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {count} {count === 1 ? 'registro' : 'registros'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 self-end lg:self-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={disabled || count === 0}
              className="flex gap-1.5 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 transition-all"
            >
              <DownloadIcon className="h-4 w-4" /> 
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-md border-blue-100">
            <DropdownMenuItem 
              onClick={onExport}
              className="flex items-center cursor-pointer px-3 py-2.5 hover:bg-red-50 group transition-colors rounded-sm"
            >
              <FileText className="mr-2 h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Formato PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onExport}
              className="flex items-center cursor-pointer px-3 py-2.5 hover:bg-green-50 group transition-colors rounded-sm"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Formato Excel</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default ExportItem;
