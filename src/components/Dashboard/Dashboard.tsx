
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterBar } from "./FilterBar";
import { MetricsOverview } from "./MetricsOverview";
import { DataTable } from "./DataTable";
import { useDashboardData } from "@/hooks/useDashboardData";
import { BarChart, LineChart, Download, Mail, BellRing } from 'lucide-react';
import { TopicsWordCloud } from './TopicsWordCloud';
import { ExportData } from './ExportData';
import { EmailReports } from './EmailReports';
import { CustomAlerts } from './CustomAlerts';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { ComparisonMode } from './ComparisonMode';
import { NaturalLanguageInsights } from './NaturalLanguageInsights';

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
        <div className="flex flex-wrap gap-4 mb-6 justify-end">
          <ExportData data={filteredData} />
          <EmailReports />
          <CustomAlerts />
        </div>

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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <TopicsWordCloud />
                  <NaturalLanguageInsights data={filteredData} />
                </div>

                <div className="mt-8">
                  <PredictiveAnalytics data={filteredData} />
                </div>

                <div className="mt-8">
                  <ComparisonMode data={filteredData} />
                </div>
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
