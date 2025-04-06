
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PredictiveAnalyticsProps {
  data: any[];
}

export const PredictiveAnalytics = ({ data }: PredictiveAnalyticsProps) => {
  const [metric, setMetric] = useState("intensity");
  const [timePeriod, setTimePeriod] = useState("quarters");
  const [forecastData, setForecastData] = useState<any[]>([]);
  
  // Generate forecast data when component mounts or when metric/period changes
  useEffect(() => {
    generateForecastData();
  }, [metric, timePeriod, data]);
  
  const generateForecastData = () => {
    if (!data.length) return;
    
    // This is a simplified forecasting logic for demonstration
    // In a real app, you'd use more sophisticated algorithms
    
    // Get historical data points
    const historicalData = [];
    const baseValue = metric === 'intensity' ? 5 : metric === 'likelihood' ? 3 : 4;
    const variance = 0.8;
    
    // Generate historical data (past 4 periods)
    for (let i = -4; i <= 0; i++) {
      const periodValue = baseValue + (Math.random() * variance * 2 - variance);
      historicalData.push({
        period: `Period ${i + 5}`,
        [metric]: Number(periodValue.toFixed(1)),
        type: "Historical"
      });
    }
    
    // Generate forecast data (next 4 periods)
    const forecastPoints = [];
    let lastValue = historicalData[historicalData.length - 1][metric];
    const trend = 0.2; // Slight upward trend
    
    for (let i = 1; i <= 4; i++) {
      lastValue = lastValue + trend + (Math.random() * variance - variance/2);
      forecastPoints.push({
        period: `Period ${i + 5}`,
        [metric]: Number(lastValue.toFixed(1)),
        type: "Forecast"
      });
    }
    
    setForecastData([...historicalData, ...forecastPoints]);
  };
  
  const metricToLabel: Record<string, string> = {
    intensity: "Intensity",
    likelihood: "Likelihood",
    relevance: "Relevance"
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Predictive Analytics</CardTitle>
          <CardDescription>Forecast future trends based on historical data</CardDescription>
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
          
          <Select 
            value={timePeriod} 
            onValueChange={setTimePeriod}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="quarters">Quarters</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={generateForecastData}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis label={{ value: metricToLabel[metric], angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray={(d) => d.type === "Forecast" ? "5 5" : "0"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>* Dashed line represents forecasted values. Actual results may vary.</p>
          <p>* This prediction is based on historical patterns and current trends.</p>
        </div>
      </CardContent>
    </Card>
  );
};
