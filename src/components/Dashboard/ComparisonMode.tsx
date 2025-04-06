
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComparisonModeProps {
  data: any[];
}

export const ComparisonMode = ({ data }: ComparisonModeProps) => {
  const [metric, setMetric] = useState("intensity");
  const [dimensionA, setDimensionA] = useState("sector");
  const [dimensionB, setDimensionB] = useState("region");
  
  // Sample comparison data - in a real app, this would be calculated from actual data
  const regionComparisonData = [
    { name: 'Northern America', currentPeriod: 3.7, previousPeriod: 3.2 },
    { name: 'World', currentPeriod: 3.2, previousPeriod: 2.9 },
    { name: 'Western Asia', currentPeriod: 3.0, previousPeriod: 2.7 },
    { name: 'Eastern Europe', currentPeriod: 2.8, previousPeriod: 2.5 },
    { name: 'Western Europe', currentPeriod: 2.6, previousPeriod: 2.3 },
  ];
  
  const sectorComparisonData = [
    { name: 'Energy', currentPeriod: 4.5, previousPeriod: 3.9 },
    { name: 'Environment', currentPeriod: 4.1, previousPeriod: 3.7 },
    { name: 'Government', currentPeriod: 3.8, previousPeriod: 3.5 },
    { name: 'Manufacturing', currentPeriod: 3.6, previousPeriod: 3.2 },
    { name: 'Financial services', currentPeriod: 3.3, previousPeriod: 3.0 },
  ];
  
  const metricToLabel: Record<string, string> = {
    intensity: "Intensity",
    likelihood: "Likelihood",
    relevance: "Relevance"
  };
  
  const dimensionToLabel: Record<string, string> = {
    sector: "Sector",
    region: "Region",
    topic: "Topic",
    pestle: "PESTLE",
    country: "Country"
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Comparison Analysis</CardTitle>
          <CardDescription>Compare data across different dimensions</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select 
            value={metric} 
            onValueChange={setMetric}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intensity">Intensity</SelectItem>
              <SelectItem value="likelihood">Likelihood</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <TabGroup defaultValue="time">
          <TabList className="grid w-full grid-cols-2">
            <Tab value="time">Time Comparison</Tab>
            <Tab value="dimension">Dimension Comparison</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel value="time" className="space-y-4">
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm font-medium">
                  Comparing Current Period vs Previous Period
                </div>
                <Select 
                  value={dimensionA} 
                  onValueChange={setDimensionA}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select dimension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sector">Sector</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                    <SelectItem value="topic">Topic</SelectItem>
                    <SelectItem value="pestle">PESTLE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dimensionA === 'sector' ? sectorComparisonData : regionComparisonData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: metricToLabel[metric], angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="currentPeriod" name="Current Period" fill="#8884d8" />
                    <Bar dataKey="previousPeriod" name="Previous Period" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabPanel>
            
            <TabPanel value="dimension" className="space-y-4">
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm font-medium">
                  Comparing {dimensionToLabel[dimensionA]} vs {dimensionToLabel[dimensionB]}
                </div>
                <div className="flex space-x-2">
                  <Select 
                    value={dimensionA} 
                    onValueChange={setDimensionA}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="First dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sector">Sector</SelectItem>
                      <SelectItem value="region">Region</SelectItem>
                      <SelectItem value="topic">Topic</SelectItem>
                      <SelectItem value="pestle">PESTLE</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={dimensionB} 
                    onValueChange={setDimensionB}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Second dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sector">Sector</SelectItem>
                      <SelectItem value="region">Region</SelectItem>
                      <SelectItem value="topic">Topic</SelectItem>
                      <SelectItem value="pestle">PESTLE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-80">
                <div className="text-center p-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-4">Select different dimensions to compare</p>
                  <Button variant="outline">Generate Comparison</Button>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </CardContent>
    </Card>
  );
};
