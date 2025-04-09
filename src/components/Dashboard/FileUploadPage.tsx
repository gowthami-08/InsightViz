
import { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { DataPreview } from './DataPreview';
import { DataVisualization } from './DataVisualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, Table, BarChart, ChevronLeft, Lightbulb } from 'lucide-react';
import { EnhancedExport } from './EnhancedExport';
import { useNavigate } from 'react-router-dom';
import { DataInsights } from './DataInsights';
import { TrendingTopics } from './TrendingTopics';

export const FileUploadPage = () => {
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadComplete, setUploadComplete] = useState(false);
  const navigate = useNavigate();
  
  const handleDataExtracted = (data: any[]) => {
    setExtractedData(data);
    setUploadComplete(true);
    
    // Animate transition to preview tab after a short delay
    setTimeout(() => {
      setActiveTab("preview");
    }, 800);
  };
  
  // Confetti effect when upload completes
  useEffect(() => {
    if (uploadComplete) {
      // The confetti effect would be implemented here with a library
      // or custom animation - we'll skip the actual implementation
      // for simplicity, but this is where it would go
      
      // Reset the flag after animation completes
      const timer = setTimeout(() => {
        setUploadComplete(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadComplete]);
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-4">Data Analysis Studio</h1>
          <p className="text-muted-foreground">
            Upload CSV and PDF files to analyze, visualize and extract insights from your data
          </p>
        </div>
        
        {extractedData.length > 0 && (
          <EnhancedExport data={extractedData} />
        )}
      </div>
      
      <TabGroup 
        className="space-y-4" 
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabList className="grid grid-cols-4 max-w-[800px]">
          <Tab className="flex items-center gap-2" value="upload">
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </Tab>
          <Tab 
            className="flex items-center gap-2" 
            value="preview"
            disabled={extractedData.length === 0}
          >
            <Table className="h-4 w-4" />
            <span>Data Preview</span>
          </Tab>
          <Tab 
            className="flex items-center gap-2" 
            value="visualization"
            disabled={extractedData.length === 0}
          >
            <BarChart className="h-4 w-4" />
            <span>Visualization</span>
          </Tab>
          <Tab 
            className="flex items-center gap-2" 
            value="insights"
            disabled={extractedData.length === 0}
          >
            <Lightbulb className="h-4 w-4" />
            <span>AI Insights</span>
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Upload CSV or PDF files for data extraction and analysis. 
                  Our AI will automatically process and analyze your data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onDataExtracted={handleDataExtracted} />
              </CardContent>
            </Card>
          </TabPanel>
          
          <TabPanel value="preview">
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
                    onClick={() => setActiveTab("upload")}
                    className="mt-2"
                  >
                    Go to Upload
                  </Button>
                </div>
              </Card>
            )}
          </TabPanel>
          
          <TabPanel value="visualization">
            {extractedData.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <DataVisualization data={extractedData} />
                </CardContent>
              </Card>
            ) : (
              <Card className="p-10 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-6">
                    <BarChart className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">No Data Available for Visualization</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload CSV or PDF files to generate data visualizations.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("upload")}
                    className="mt-2"
                  >
                    Go to Upload
                  </Button>
                </div>
              </Card>
            )}
          </TabPanel>
          
          <TabPanel value="insights">
            {extractedData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <DataInsights data={extractedData} />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <TrendingTopics data={extractedData} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="p-10 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-6">
                    <Lightbulb className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">No Data Available for AI Analysis</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload CSV or PDF files to generate AI-powered insights and analysis.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("upload")}
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
