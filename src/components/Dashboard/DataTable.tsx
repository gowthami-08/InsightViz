
import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  SortAsc, 
  SortDesc 
} from 'lucide-react';
import { DataItem } from '@/utils/dataUtils';

interface DataTableProps {
  data: DataItem[];
}

type SortField = keyof DataItem | null;
type SortDirection = 'asc' | 'desc';

export const DataTable = ({ data }: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }
    
    const queryLower = searchQuery.toLowerCase();
    return data.filter(item => 
      item.title.toLowerCase().includes(queryLower) ||
      item.sector.toLowerCase().includes(queryLower) ||
      item.topic.toLowerCase().includes(queryLower) ||
      item.insight.toLowerCase().includes(queryLower) ||
      item.country.toLowerCase().includes(queryLower) ||
      item.region.toLowerCase().includes(queryLower)
    );
  }, [data, searchQuery]);
  
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) {
      return filteredData;
    }
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }, [filteredData, sortField, sortDirection]);
  
  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);
  
  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }
    
    return sortDirection === 'asc' ? (
      <SortAsc className="ml-1 h-4 w-4 inline" />
    ) : (
      <SortDesc className="ml-1 h-4 w-4 inline" />
    );
  };
  
  // Truncate text
  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredData.length} results
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
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
      
      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead 
                className="w-[250px] cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleSort('title')}
              >
                Title {renderSortIcon('title')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleSort('sector')}
              >
                Sector {renderSortIcon('sector')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleSort('region')}
              >
                Region {renderSortIcon('region')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/80 transition-colors text-center"
                onClick={() => handleSort('intensity')}
              >
                Intensity {renderSortIcon('intensity')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/80 transition-colors text-center"
                onClick={() => handleSort('likelihood')}
              >
                Likelihood {renderSortIcon('likelihood')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-secondary/80 transition-colors text-center"
                onClick={() => handleSort('relevance')}
              >
                Relevance {renderSortIcon('relevance')}
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow 
                  key={index}
                  className="animate-fade-in hover:bg-secondary/30 group transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium">
                    {truncateText(item.title, 60)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50 hover:bg-secondary">
                      {item.sector}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell className="text-center">
                    <span className={`
                      inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${item.intensity >= 8 ? 'bg-red-100 text-red-700' : 
                        item.intensity >= 6 ? 'bg-amber-100 text-amber-700' : 
                        'bg-green-100 text-green-700'}
                    `}>
                      {item.intensity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{item.likelihood}</TableCell>
                  <TableCell className="text-center">{item.relevance}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(item.url, '_blank')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open</span>
                    </Button>
                  </TableCell>
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
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
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
