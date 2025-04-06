
import { useState } from 'react';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/tabs";
import { FilterBar } from "./FilterBar";
import { MetricsOverview } from "./MetricsOverview";
import { DataTable } from "./DataTable";
import { useDashboardData } from "@/hooks/useDashboardData";
import { BarChart, LineChart, Download, Mail, BellRing, Upload } from 'lucide-react';
import { ExportData } from './ExportData';
import { EmailReports } from './EmailReports';
import { CustomAlerts } from './CustomAlerts';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { ComparisonMode } from './ComparisonMode';
import { NaturalLanguageInsights } from './NaturalLanguageInsights';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
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
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate('/upload')}
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
          <ExportData data={filteredData} />
          <EmailReports />
          <CustomAlerts />
        </div>

        <TabGroup 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <TabList className="grid w-full max-w-md grid-cols-2">
              <Tab value="overview" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Dashboard</span>
              </Tab>
              <Tab value="data" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Data Table</span>
              </Tab>
            </TabList>
          </div>
          
          <TabPanels>
            <TabPanel value="overview" className="animate-fade-in">
              {dashboardData && (
                <>
                  <MetricsOverview 
                    dashboardData={dashboardData} 
                    filteredDataCount={filteredData.length}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
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
            </TabPanel>
            
            <TabPanel value="data" className="animate-fade-in">
              <DataTable data={filteredData} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
