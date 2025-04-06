
import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { analyzeDataSchema, extractAttributes } from '@/utils/fileParsingUtils';
import { Badge } from '@/components/ui/badge';

interface DataPreviewProps {
  data: any[];
}

export const DataPreview = ({ data }: DataPreviewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  // Analyze data schema
  const schema = useMemo(() => analyzeDataSchema(data), [data]);
  
  // Extract attributes for filtering
  const attributes = useMemo(() => extractAttributes(data), [data]);
  
  // Filter data based on search query and filters
  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    let result = [...data];
    
    // Apply attribute filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => 
          String(item[key]).toLowerCase() === String(value).toLowerCase()
        );
      }
    });
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(
          value => value && String(value).toLowerCase().includes(query)
        )
      );
    }
    
    return result;
  }, [data, searchQuery, filters]);
  
  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / pageSize);
  
  // Handle filter change
  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // Export current data as CSV
  const exportAsCSV = () => {
    const headers = schema.fields.map(field => field.name).join(',');
    const rows = filteredData.map(item => 
      schema.fields.map(field => {
        const value = item[field.name];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'exported_data.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Format cell values for display
  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '-';
    
    if (type === 'date') {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    return String(value);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-medium">Data Preview</h3>
          <div className="text-sm text-muted-foreground">
            {schema.totalRows} total rows • {schema.fields.length} fields
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={exportAsCSV}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search data..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(filters).length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {Object.keys(filters).length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.keys(filters).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] max-h-[400px] overflow-y-auto">
              {schema.fields.map(field => {
                // Only show filter options for fields with a reasonable number of unique values
                const fieldValues = attributes[field.name];
                if (!fieldValues || fieldValues.length > 50) return null;
                
                return (
                  <DropdownMenu key={field.name}>
                    <DropdownMenuTrigger className="w-full px-2 py-1.5 text-sm hover:bg-muted cursor-pointer flex items-center justify-between">
                      <span>{field.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[150px]">
                      {fieldValues.map((value, i) => (
                        <DropdownMenuItem 
                          key={i}
                          className={
                            filters[field.name] === value ? "bg-muted" : ""
                          }
                          onClick={() => handleFilterChange(field.name, value)}
                        >
                          {String(value)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {pageSize} per page
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[5, 10, 20, 50].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                >
                  {size} per page
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Applied filters display */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([field, value]) => (
            <Badge 
              key={field} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {field}: {String(value)}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters[field];
                  setFilters(newFilters);
                }}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Data table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              {schema.fields.map((field) => (
                <TableHead key={field.name}>
                  {field.name}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {field.type}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={schema.fields.length} className="text-center py-8">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow 
                  key={index}
                  className="hover:bg-secondary/20"
                >
                  {schema.fields.map((field) => (
                    <TableCell key={field.name}>
                      {formatCellValue(item[field.name], field.type)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <div className="flex items-center">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                if (pageNum <= totalPages) {
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-9"
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
