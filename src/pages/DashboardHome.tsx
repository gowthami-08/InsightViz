
import { RecentFiles } from "@/components/Dashboard/RecentFiles";
import { SavedFilters } from "@/components/Dashboard/SavedFilters";
import { Button } from "@/components/ui/button";
import { Upload, Search, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { FilterBar } from "@/components/Dashboard/FilterBar";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { 
    filters, 
    filterOptions, 
    filteredData, 
    updateFilter, 
    resetFilters 
  } = useDashboardData();
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Upload, analyze and visualize your data
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload New Files
          </Button>
          
          <SavedFilters 
            currentFilters={filters} 
            applyFilter={(savedFilters) => {
              // Reset current filters
              resetFilters();
              // Apply saved filters
              Object.entries(savedFilters).forEach(([key, value]) => {
                if (value !== null && isValidFilterKey(key, filters)) {
                  // Now TypeScript knows this is a valid key
                  updateFilter(key as keyof typeof filters, value as string | number | null);
                }
              });
            }} 
          />
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <RecentFiles />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Quick Search</h2>
            </div>
            <FilterBar 
              filterOptions={filterOptions}
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            
            <div className="text-center py-8 text-muted-foreground">
              <p>Your recent activity will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to check if a key is a valid filter key
function isValidFilterKey(key: string, filters: any): key is keyof typeof filters {
  return key in filters;
}
