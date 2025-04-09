
import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeDataSchema } from '@/utils/fileParsingUtils';
import { DateRangeSelector } from './DateRangeSelector';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface TimeSeriesChartProps {
  data: any[];
}

export const TimeSeriesChart = ({ data }: TimeSeriesChartProps) => {
  const [selectedDateField, setSelectedDateField] = useState<string>('');
  const [selectedValueField, setSelectedValueField] = useState<string>('');
  const [interval, setInterval] = useState<'day' | 'month' | 'year'>('month');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  
  // Analyze data to find date fields and numeric fields
  const schema = useMemo(() => analyzeDataSchema(data), [data]);
  
  // Set default values when schema is loaded
  useMemo(() => {
    if (schema.possibleDateFields && schema.possibleDateFields.length > 0) {
      setSelectedDateField(schema.possibleDateFields[0]);
    }
    
    if (schema.numericFields && schema.numericFields.length > 0) {
      setSelectedValueField(schema.numericFields[0]);
    }
  }, [schema]);
  
  // Process data for the time series
  const timeSeriesData = useMemo(() => {
    if (!selectedDateField || !selectedValueField || !data.length) return [];
    
    // Parse dates and filter based on date range
    const dateFiltered = data.filter(item => {
      const itemDate = new Date(item[selectedDateField]);
      
      if (isNaN(itemDate.getTime())) return false;
      
      if (dateRange.from && dateRange.to) {
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      }
      
      return true;
    });
    
    // Group by time interval and aggregate values
    const groupedData = new Map();
    
    dateFiltered.forEach(item => {
      const itemDate = new Date(item[selectedDateField]);
      const itemValue = parseFloat(item[selectedValueField]) || 0;
      
      let timeKey: string;
      
      if (interval === 'day') {
        timeKey = itemDate.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (interval === 'month') {
        timeKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      } else {
        timeKey = `${itemDate.getFullYear()}`; // YYYY
      }
      
      if (!groupedData.has(timeKey)) {
        groupedData.set(timeKey, {
          timeKey,
          date: itemDate,
          total: 0,
          count: 0
        });
      }
      
      const group = groupedData.get(timeKey);
      group.total += itemValue;
      group.count += 1;
    });
    
    // Calculate averages and format for chart
    return Array.from(groupedData.values())
      .map(group => ({
        timeKey: group.timeKey,
        [selectedValueField]: group.total,
        average: group.total / group.count,
        formattedDate: formatDateByInterval(group.date, interval)
      }))
      .sort((a, b) => a.timeKey.localeCompare(b.timeKey));
  }, [data, selectedDateField, selectedValueField, interval, dateRange]);
  
  if (!data.length) {
    return null;
  }
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Time Series Analysis</CardTitle>
        <CardDescription>Analyze trends over time from your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-1/3">
              <label className="text-sm font-medium mb-1 block">Date Field</label>
              <Select value={selectedDateField} onValueChange={setSelectedDateField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date field" />
                </SelectTrigger>
                <SelectContent>
                  {schema.possibleDateFields?.map(field => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:w-1/3">
              <label className="text-sm font-medium mb-1 block">Value Field</label>
              <Select value={selectedValueField} onValueChange={setSelectedValueField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select value field" />
                </SelectTrigger>
                <SelectContent>
                  {schema.numericFields?.map(field => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:w-1/3">
              <label className="text-sm font-medium mb-1 block">Time Interval</label>
              <Select value={interval} onValueChange={(value) => setInterval(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DateRangeSelector onRangeChange={setDateRange} />
          
          <div className="h-[400px] mt-6">
            {timeSeriesData.length > 0 ? (
              <ChartContainer
                config={{
                  [selectedValueField]: {
                    label: selectedValueField,
                    theme: {
                      light: "#3b82f6",
                      dark: "#60a5fa",
                    },
                  },
                  average: {
                    label: "Average",
                    theme: {
                      light: "#10b981",
                      dark: "#34d399",
                    },
                  }
                }}
              >
                <LineChart
                  data={timeSeriesData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="formattedDate" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={selectedValueField}
                    name={selectedValueField}
                    stroke={"var(--color-" + selectedValueField + ")"}
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    name="Average"
                    stroke={"var(--color-average)"}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  {schema.possibleDateFields?.length
                    ? "Select fields to visualize time series data"
                    : "No date fields detected in your data"}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format dates based on selected interval
function formatDateByInterval(date: Date, interval: 'day' | 'month' | 'year'): string {
  if (interval === 'day') {
    return date.toLocaleDateString();
  } else if (interval === 'month') {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  } else {
    return date.getFullYear().toString();
  }
}
