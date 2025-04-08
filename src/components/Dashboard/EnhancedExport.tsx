
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, FilePdf, Loader2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface EnhancedExportProps {
  data: any[];
}

export const EnhancedExport = ({ data }: EnhancedExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToCSV = () => {
    try {
      setIsExporting(true);
      
      // Create CSV content
      const headers = Object.keys(data[0] || {}).join(',');
      const csvRows = data.map(row => 
        Object.values(row)
          .map(value => {
            if (value === null || value === undefined) return '';
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
          })
          .join(',')
      );
      
      const csvContent = [headers, ...csvRows].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `export-${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Your data has been successfully exported to CSV",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToJSON = () => {
    try {
      setIsExporting(true);
      
      // Create JSON content
      const jsonContent = JSON.stringify(data, null, 2);
      
      // Create download link
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `export-${new Date().toISOString().slice(0,10)}.json`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Your data has been successfully exported to JSON",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToExcel = () => {
    try {
      setIsExporting(true);
      
      // For Excel export, we'll simulate by creating a CSV with Excel-friendly format
      // In a real-world scenario, you'd want to use a library like exceljs
      const headers = Object.keys(data[0] || {}).join('\t');
      const rows = data.map(row => 
        Object.values(row)
          .map(value => {
            if (value === null || value === undefined) return '';
            return String(value).replace(/\t/g, ' ');
          })
          .join('\t')
      );
      
      const excelContent = [headers, ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `export-${new Date().toISOString().slice(0,10)}.xls`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Your data has been successfully exported to Excel format",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToPDF = () => {
    // In a real implementation, we would use a PDF generation library
    toast({
      title: "PDF Export",
      description: "PDF export would require a PDF generation library. This is a placeholder for that functionality.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting || data.length === 0} className="flex items-center gap-2">
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuItem onClick={exportToCSV} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Export as JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="flex items-center gap-2">
          <FilePdf className="h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
