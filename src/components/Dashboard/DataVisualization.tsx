
import { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon,
  Download
} from 'lucide-react';
import { analyzeDataSchema, extractAttributes } from '@/utils/fileParsingUtils';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

// Colors for charts
const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#2563eb', '#1d4ed8', '#1e40af', '#4f46e5', '#8b5cf6'];

interface DataVisualizationProps {
  data: any[];
}

export const DataVisualization = ({ data }: DataVisualizationProps) => {
  const [activeTab, setActiveTab] = useState("bar");
  const [xField, setXField] = useState<string>("");
  const [yField, setYField] = useState<string>("");
  const [categoryField, setCategoryField] = useState<string>("");
  
  // Analyze data schema to get fields and their types
  const dataSchema = useMemo(() => analyzeDataSchema(data), [data]);
  
  // Extract unique values for categorical fields
  const attributeValues = useMemo(() => extractAttributes(data), [data]);
  
  // Separate fields by type for selection
  const fields = useMemo(() => {
    const result = {
      numeric: [] as string[],
      categorical: [] as string[],
      all: [] as string[]
    };
    
    if (!dataSchema || !dataSchema.fields) return result;
    
    dataSchema.fields.forEach(field => {
      result.all.push(field.name);
      
      if (field.type === 'number') {
        result.numeric.push(field.name);
      } else {
        result.categorical.push(field.name);
      }
    });
    
    return result;
  }, [dataSchema]);
  
  // Set default fields when schema is loaded
  useMemo(() => {
    if (fields.numeric.length > 0 && fields.all.length > 0) {
      // For bar and line charts
      if (!yField) setYField(fields.numeric[0]);
      if (!xField) {
        if (fields.categorical.length > 0) {
          setXField(fields.categorical[0]);
        } else {
          setXField(fields.all[0]);
        }
      }
      
      // For pie chart
      if (!categoryField && fields.categorical.length > 0) {
        setCategoryField(fields.categorical[0]);
      }
    }
  }, [fields, xField, yField, categoryField]);
  
  // Prepare data for visualization based on selected fields
  const visualizationData = useMemo(() => {
    if (!xField || !yField || data.length === 0) return [];
    
    // For bar and line charts - aggregate data by xField
    if (activeTab === 'bar' || activeTab === 'line') {
      const aggregated = new Map();
      
      data.forEach(item => {
        const xValue = item[xField] || 'Unknown';
        const yValue = parseFloat(item[yField]) || 0;
        
        if (aggregated.has(xValue)) {
          aggregated.set(xValue, aggregated.get(xValue) + yValue);
        } else {
          aggregated.set(xValue, yValue);
        }
      });
      
      return Array.from(aggregated.entries())
        .map(([x, y]) => ({ 
          [xField]: x, 
          [yField]: y 
        }))
        .sort((a, b) => (b[yField] as number) - (a[yField] as number));
    }
    
    // For pie chart
    if (activeTab === 'pie' && categoryField) {
      const aggregated = new Map();
      
      data.forEach(item => {
        const category = item[categoryField] || 'Unknown';
        
        if (aggregated.has(category)) {
          aggregated.set(category, aggregated.get(category) + 1);
        } else {
          aggregated.set(category, 1);
        }
      });
      
      return Array.from(aggregated.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => (b.value as number) - (a.value as number))
        .slice(0, 10); // Limit to top 10 categories for better visualization
    }
    
    // For scatter plot - use raw data
    if (activeTab === 'scatter') {
      return data.map(item => ({
        [xField]: item[xField] || 0,
        [yField]: item[yField] || 0
      }));
    }
    
    return [];
  }, [data, xField, yField, categoryField, activeTab]);
  
  // Handler for exporting chart as image
  const handleExportChart = () => {
    try {
      const chartContainer = document.querySelector('.chart-container svg');
      if (!chartContainer) {
        console.error('Chart SVG not found');
        return;
      }
      
      const svgData = new XMLSerializer().serializeToString(chartContainer as Node);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }
      
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        
        const imgURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgURL;
        link.download = `chart-${activeTab}-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      img.src = url;
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };
  
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>No data available for visualization</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-60">
          <p className="text-muted-foreground">Please upload a file to generate visualizations</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>Visualize your data with different chart types</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleExportChart}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <TabGroup 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabList className="grid w-full grid-cols-4 lg:max-w-md">
            <Tab value="bar" className="flex items-center justify-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Bar Chart</span>
            </Tab>
            <Tab value="line" className="flex items-center justify-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Line Chart</span>
            </Tab>
            <Tab value="pie" className="flex items-center justify-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Pie Chart</span>
            </Tab>
            <Tab value="scatter" className="flex items-center justify-center gap-2">
              <ScatterChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Scatter Plot</span>
            </Tab>
          </TabList>
          
          <div className="flex flex-wrap gap-4 mb-4">
            {/* X-Axis field selector - for bar, line, scatter */}
            {(activeTab === 'bar' || activeTab === 'line' || activeTab === 'scatter') && (
              <div className="w-full sm:w-auto">
                <label className="text-sm font-medium mb-1 block">X-Axis</label>
                <Select 
                  value={xField} 
                  onValueChange={setXField}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTab === 'scatter' 
                      ? fields.numeric.map(field => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))
                      : fields.all.map(field => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Y-Axis field selector - for bar, line, scatter */}
            {(activeTab === 'bar' || activeTab === 'line' || activeTab === 'scatter') && (
              <div className="w-full sm:w-auto">
                <label className="text-sm font-medium mb-1 block">Y-Axis</label>
                <Select 
                  value={yField} 
                  onValueChange={setYField}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.numeric.map(field => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Category field selector - for pie chart */}
            {activeTab === 'pie' && (
              <div className="w-full sm:w-auto">
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select 
                  value={categoryField} 
                  onValueChange={setCategoryField}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.all.map(field => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <TabPanels>
            {/* Bar Chart */}
            <TabPanel value="bar" className="chart-container">
              <div className="h-[400px] w-full">
                {visualizationData.length > 0 ? (
                  <ChartContainer
                    config={{
                      [yField]: {
                        label: yField,
                        theme: {
                          light: "#3b82f6",
                          dark: "#60a5fa",
                        },
                      },
                    }}
                  >
                    <BarChart data={visualizationData} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={xField} 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        dataKey={yField}
                        radius={[4, 4, 0, 0]}
                        fill={"var(--color-" + yField + ")"}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available for selected fields</p>
                  </div>
                )}
              </div>
            </TabPanel>
            
            {/* Line Chart */}
            <TabPanel value="line" className="chart-container">
              <div className="h-[400px] w-full">
                {visualizationData.length > 0 ? (
                  <ChartContainer
                    config={{
                      [yField]: {
                        label: yField,
                        theme: {
                          light: "#3b82f6",
                          dark: "#60a5fa",
                        },
                      },
                    }}
                  >
                    <LineChart data={visualizationData} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={xField} 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line
                        type="monotone"
                        dataKey={yField}
                        stroke={"var(--color-" + yField + ")"}
                        strokeWidth={2}
                        dot={{ strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available for selected fields</p>
                  </div>
                )}
              </div>
            </TabPanel>
            
            {/* Pie Chart */}
            <TabPanel value="pie" className="chart-container">
              <div className="h-[400px] w-full">
                {visualizationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visualizationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {visualizationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available for selected fields</p>
                  </div>
                )}
              </div>
            </TabPanel>
            
            {/* Scatter Plot */}
            <TabPanel value="scatter" className="chart-container">
              <div className="h-[400px] w-full">
                {visualizationData.length > 0 ? (
                  <ChartContainer
                    config={{
                      data: {
                        label: "Data Points",
                        theme: {
                          light: "#3b82f6",
                          dark: "#60a5fa",
                        },
                      },
                    }}
                  >
                    <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey={xField} 
                        name={xField} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey={yField} 
                        name={yField} 
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                      <Scatter name="Data Points" data={visualizationData} fill={"var(--color-data)"} />
                    </ScatterChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No data available for selected fields</p>
                  </div>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </CardContent>
    </Card>
  );
};
