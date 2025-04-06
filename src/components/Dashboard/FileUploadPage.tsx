
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { DataPreview } from './DataPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, Table, BarChart } from 'lucide-react';

export const FileUploadPage = () => {
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  
  const handleDataExtracted = (data: any[]) => {
    setExtractedData(data);
    // Move to data preview tab when data is extracted
    setActiveTab(1);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">File Upload & Analysis</h1>
          <p className="text-muted-foreground">
            Upload CSV and PDF files to analyze and visualize your data
          </p>
        </div>
      </div>
      
      <TabGroup 
        className="space-y-4" 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabList className="grid grid-cols-2 max-w-[400px]">
          <Tab className="flex items-center gap-2" value={0}>
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </Tab>
          <Tab 
            className="flex items-center gap-2" 
            value={1}
            disabled={extractedData.length === 0}
          >
            <Table className="h-4 w-4" />
            <span>Data Preview</span>
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel value={0}>
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Upload CSV or PDF files for data extraction and analysis. 
                  Supported formats: .csv, .pdf
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onDataExtracted={handleDataExtracted} />
              </CardContent>
            </Card>
          </TabPanel>
          
          <TabPanel value={1}>
            {extractedData.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <DataPreview data={extractedData} />
                </CardContent>
              </Card>
            ) : (
              <Card className="p-10 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-6">
                    <Table className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">No Data Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload CSV or PDF files to see the extracted data preview here.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab(0)}
                    className="mt-2"
                  >
                    Go to Upload
                  </Button>
                </div>
              </Card>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};
