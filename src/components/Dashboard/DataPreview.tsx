
import { useState, useMemo } from 'react';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileText, BarChart, Download, TrendingUp, Activity, Lightbulb } from 'lucide-react';
import { analyzeDataSchema } from '@/utils/fileParsingUtils';
import { DataVisualization } from './DataVisualization';
import { DataSummary } from './DataSummary';
import { TimeSeriesChart } from './TimeSeriesChart';
import { DataInsights } from './DataInsights';
import { TrendingTopics } from './TrendingTopics';

interface DataPreviewProps {
  data: any[];
}

export const DataPreview = ({ data }: DataPreviewProps) => {
  const [activeTab, setActiveTab] = useState("table");
  
  // Get schema information from data
  const schema = useMemo(() => analyzeDataSchema(data), [data]);
  
  // Get columns from first data item
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);
  
  // Handle export to CSV
  const handleExportCsv = () => {
    if (data.length === 0) return;
    
    // Create CSV content
    const headers = columns.join(',');
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col];
        // Handle values that might need escaping in CSV
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Data Preview</h2>
          <p className="text-sm text-muted-foreground">
            {data.length} rows extracted • {columns.length} columns
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleExportCsv}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <TabGroup 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabList className="grid w-full max-w-[600px] grid-cols-5">
          <Tab value="table" className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Table View
          </Tab>
          <Tab value="summary" className="flex items-center justify-center gap-2">
            <Activity className="h-4 w-4" />
            Summary
          </Tab>
          <Tab value="visualization" className="flex items-center justify-center gap-2">
            <BarChart className="h-4 w-4" />
            Visualization
          </Tab>
          <Tab value="timeseries" className="flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Time Analysis
          </Tab>
          <Tab value="insights" className="flex items-center justify-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Insights
          </Tab>
        </TabList>
        
        <TabPanels className="mt-4">
          <TabPanel value="table">
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(0, 100).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {columns.map((column) => (
                          <TableCell key={column}>
                            {row[column] !== null && row[column] !== undefined
                              ? String(row[column])
                              : ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {data.length > 100 && (
                <div className="px-4 py-2 text-sm text-muted-foreground border-t">
                  Showing 100 of {data.length} rows
                </div>
              )}
            </div>
          </TabPanel>
          
          <TabPanel value="summary">
            <DataSummary data={data} />
          </TabPanel>
          
          <TabPanel value="visualization">
            <DataVisualization data={data} />
          </TabPanel>
          
          <TabPanel value="timeseries">
            <TimeSeriesChart data={data} />
          </TabPanel>
          
          <TabPanel value="insights">
            <div className="space-y-6">
              <DataInsights data={data} />
              <TrendingTopics data={data} />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
