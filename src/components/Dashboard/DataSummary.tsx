
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeDataSchema } from '@/utils/fileParsingUtils';
import { BarChart, PieChart, Activity, TrendingUp } from 'lucide-react';

interface DataSummaryProps {
  data: any[];
}

export const DataSummary = ({ data }: DataSummaryProps) => {
  const schema = useMemo(() => analyzeDataSchema(data), [data]);
  
  // Calculate key metrics
  const metrics = useMemo(() => {
    if (!data.length) return null;
    
    // Find numeric fields for calculations
    const numericFields = schema.numericFields;
    const results: Record<string, { avg: number; min: number; max: number; sum: number }> = {};
    
    // Calculate stats for each numeric field
    numericFields.forEach(field => {
      const values = data
        .map(item => parseFloat(item[field]))
        .filter(val => !isNaN(val));
      
      if (values.length) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        results[field] = {
          avg: sum / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          sum: sum
        };
      }
    });
    
    return results;
  }, [data, schema]);
  
  // Determine if we have date fields for time analysis
  const dateFields = useMemo(() => schema.possibleDateFields || [], [schema]);
  
  if (!data.length) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Data Summary</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{data.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <BarChart className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{schema.fields.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {schema.numericFields.length} numeric, {schema.categoricalFields.length} categorical
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Data Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <PieChart className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">
                {Math.round(calculateCompleteness(data) * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Data completeness score
            </p>
          </CardContent>
        </Card>
        
        {dateFields.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-lg font-medium truncate">
                  {calculateDateRange(data, dateFields[0])}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Numeric Field Summaries */}
      {metrics && Object.keys(metrics).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mt-6">Numeric Field Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics).map(([field, stats]) => (
              <Card key={field}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{field}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Average</dt>
                      <dd className="font-medium">{formatNumber(stats.avg)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Sum</dt>
                      <dd className="font-medium">{formatNumber(stats.sum)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Min</dt>
                      <dd className="font-medium">{formatNumber(stats.min)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Max</dt>
                      <dd className="font-medium">{formatNumber(stats.max)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate data completeness (percentage of non-null values)
function calculateCompleteness(data: any[]): number {
  if (!data.length) return 0;
  
  const fields = Object.keys(data[0]);
  let totalFields = fields.length * data.length;
  let nonNullFields = 0;
  
  data.forEach(item => {
    fields.forEach(field => {
      if (item[field] !== null && item[field] !== undefined && item[field] !== '') {
        nonNullFields++;
      }
    });
  });
  
  return nonNullFields / totalFields;
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else if (Number.isInteger(num)) {
    return num.toString();
  } else {
    return num.toFixed(2);
  }
}

// Helper function to calculate date range from a date field
function calculateDateRange(data: any[], dateField: string): string {
  try {
    const dates = data
      .map(item => new Date(item[dateField]))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (dates.length === 0) return "No valid dates";
    
    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];
    
    return `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
  } catch (error) {
    return "Invalid date format";
  }
}
