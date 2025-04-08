
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { BookmarkPlus, Filter, Check, Trash2, ArrowRightCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '@/utils/localStorageUtils';

// Define the filter type
export interface SavedFilter {
  id: string;
  name: string;
  filters: any;
  createdAt: number;
}

interface SavedFiltersProps {
  currentFilters: any;
  applyFilter: (filters: any) => void;
}

export const SavedFilters = ({ currentFilters, applyFilter }: SavedFiltersProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const savedFilters = getFromLocalStorage<SavedFilter[]>(STORAGE_KEYS.SAVED_FILTERS, []);
  
  const saveCurrentFilter = () => {
    if (!filterName.trim()) {
      toast({
        title: "Filter name required",
        description: "Please provide a name for your filter"
      });
      return;
    }
    
    // Create new filter
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { ...currentFilters },
      createdAt: Date.now()
    };
    
    // Add to saved filters
    const updatedFilters = [...savedFilters, newFilter];
    saveToLocalStorage(STORAGE_KEYS.SAVED_FILTERS, updatedFilters);
    
    // Show success message
    toast({
      title: "Filter saved",
      description: `Filter "${filterName}" has been saved successfully`
    });
    
    // Reset and close dialog
    setFilterName('');
    setIsDialogOpen(false);
  };
  
  const deleteFilter = (id: string) => {
    const updatedFilters = savedFilters.filter(filter => filter.id !== id);
    saveToLocalStorage(STORAGE_KEYS.SAVED_FILTERS, updatedFilters);
    
    toast({
      title: "Filter deleted",
      description: "The filter has been removed"
    });
  };
  
  const loadFilter = (filter: SavedFilter) => {
    applyFilter(filter.filters);
    
    toast({
      title: "Filter applied",
      description: `Filter "${filter.name}" has been applied successfully`
    });
  };
  
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Saved Filters</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          {savedFilters.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No saved filters. Create one by saving your current filters.
            </div>
          ) : (
            savedFilters.map(filter => (
              <div key={filter.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground">
                <span className="flex-1 cursor-pointer text-sm truncate" onClick={() => loadFilter(filter)}>
                  {filter.name}
                </span>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => loadFilter(filter)}
                    title="Apply filter"
                  >
                    <ArrowRightCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive"
                    onClick={() => deleteFilter(filter.id)}
                    title="Delete filter"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
          <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
            <Button variant="outline" className="w-full mt-2">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Save Current Filters
            </Button>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Current Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Filter name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                id="filter-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCurrentFilter}>
              <Check className="h-4 w-4 mr-2" />
              Save Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
