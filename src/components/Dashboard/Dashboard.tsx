
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterBar } from "./FilterBar";
import { MetricsOverview } from "./MetricsOverview";
import { DataTable } from "./DataTable";
import { useDashboardData } from "@/hooks/useDashboardData";
import { BarChart, LineChart } from 'lucide-react';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    filters, 
    filterOptions, 
    filteredData, 
    dashboardData, 
    updateFilter, 
    resetFilters 
  } = useDashboardData();
  
  return (
    <div className="min-h-screen flex flex-col">
      <FilterBar 
        filterOptions={filterOptions}
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />
      
      <div className="container max-w-7xl mx-auto flex-grow px-4 py-8">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Data Table</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="animate-fade-in">
            {dashboardData && (
              <>
                <MetricsOverview 
                  dashboardData={dashboardData} 
                  filteredDataCount={filteredData.length}
                />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="data" className="animate-fade-in">
            <DataTable data={filteredData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
