
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Filter, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  filterOptions: {
    sectors: string[];
    topics: string[];
    regions: string[];
    endYears: string[];
    pestles: string[];
    sources: string[];
    countries: string[];
  };
  filters: {
    sector: string | null;
    topic: string | null;
    region: string | null;
    end_year: number | null;
    pestle: string | null;
    source: string | null;
    country: string | null;
  };
  updateFilter: (field: string, value: string | number | null) => void;
  resetFilters: () => void;
}

export const FilterBar = ({ 
  filterOptions, 
  filters, 
  updateFilter,
  resetFilters 
}: FilterBarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-20 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 md:hidden"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Data</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FilterDropdown 
                  label="Sector"
                  options={filterOptions.sectors}
                  value={filters.sector}
                  onChange={(value) => {
                    updateFilter('sector', value);
                    setIsDialogOpen(false);
                  }}
                  isMobile
                />
                <FilterDropdown 
                  label="Topic"
                  options={filterOptions.topics}
                  value={filters.topic}
                  onChange={(value) => {
                    updateFilter('topic', value);
                    setIsDialogOpen(false);
                  }}
                  isMobile
                />
                <FilterDropdown 
                  label="Region"
                  options={filterOptions.regions}
                  value={filters.region}
                  onChange={(value) => {
                    updateFilter('region', value);
                    setIsDialogOpen(false);
                  }}
                  isMobile
                />
                <FilterDropdown 
                  label="PESTLE"
                  options={filterOptions.pestles}
                  value={filters.pestle}
                  onChange={(value) => {
                    updateFilter('pestle', value);
                    setIsDialogOpen(false);
                  }}
                  isMobile
                />
                <FilterDropdown 
                  label="Country"
                  options={filterOptions.countries}
                  value={filters.country}
                  onChange={(value) => {
                    updateFilter('country', value); 
                    setIsDialogOpen(false);
                  }}
                  isMobile
                />
                <FilterDropdown 
                  label="Source"
                  options={filterOptions.sources}
                  value={filters.source}
                  onChange={(value) => {
                    updateFilter('source', value);
                    setIsDialogOpen(false);
                  }}
                  isMobile
                />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetFilters();
                    setIsDialogOpen(false);
                  }}
                >
                  Reset All
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Desktop filter dropdowns */}
          <div className="hidden md:flex items-center gap-2">
            <FilterDropdown 
              label="Sector"
              options={filterOptions.sectors}
              value={filters.sector}
              onChange={(value) => updateFilter('sector', value)}
            />
            <FilterDropdown 
              label="Topic"
              options={filterOptions.topics}
              value={filters.topic}
              onChange={(value) => updateFilter('topic', value)}
            />
            <FilterDropdown 
              label="Region"
              options={filterOptions.regions}
              value={filters.region}
              onChange={(value) => updateFilter('region', value)}
            />
            <FilterDropdown 
              label="PESTLE"
              options={filterOptions.pestles}
              value={filters.pestle}
              onChange={(value) => updateFilter('pestle', value)}
            />
            <FilterDropdown 
              label="Country"
              options={filterOptions.countries}
              value={filters.country}
              onChange={(value) => updateFilter('country', value)}
            />
          </div>
        </div>
        
        {/* Clear filters button */}
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="animate-fade-in text-sm"
          >
            Clear filters
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="container mx-auto flex flex-wrap items-center gap-2 px-4 mt-2 animate-slide-up">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <Badge 
                key={key} 
                variant="secondary"
                className="flex items-center gap-1 py-1 px-2"
              >
                <span className="text-xs font-medium capitalize">{key.replace('_', ' ')}: {value}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter(key, null)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | number | null;
  onChange: (value: string | null) => void;
  isMobile?: boolean;
}

const FilterDropdown = ({ label, options, value, onChange, isMobile }: FilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={value ? "default" : "outline"} 
          size="sm"
          className={`text-sm ${!isMobile ? 'h-8' : ''}`}
        >
          {label}
          {value && <Badge variant="outline" className="ml-1">{value}</Badge>}
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onChange(null)}
        >
          All {label}s
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            className="cursor-pointer"
            onClick={() => onChange(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
