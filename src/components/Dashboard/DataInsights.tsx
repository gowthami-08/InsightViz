
import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { analyzeDataSchema } from '@/utils/fileParsingUtils';
import { Info, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

interface DataInsightsProps {
  data: any[];
}

export const DataInsights = ({ data }: DataInsightsProps) => {
  // Generate insights based on data
  const insights = useMemo(() => {
    if (!data.length) return [];
    
    const schema = analyzeDataSchema(data);
    const insights: Array<{
      type: 'info' | 'trend' | 'insight' | 'warning';
      title: string;
      description: string;
      icon: React.ReactNode;
    }> = [];
    
    // Add data overview insight
    insights.push({
      type: 'info',
      title: 'Data Overview',
      description: `This dataset contains ${data.length} records with ${schema.fields.length} fields (${schema.numericFields.length} numeric, ${schema.categoricalFields.length} categorical).`,
      icon: <Info className="h-5 w-5" />
    });
    
    // Add numeric field analysis
    if (schema.numericFields.length > 0) {
      const numericInsights: Array<{ field: string; avg: number; min: number; max: number; range: number }> = [];
      
      schema.numericFields.forEach(field => {
        const values = data
          .map(item => parseFloat(item[field]))
          .filter(val => !isNaN(val));
        
        if (values.length) {
          const sum = values.reduce((acc, val) => acc + val, 0);
          const avg = sum / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = max - min;
          
          numericInsights.push({ field, avg, min, max, range });
        }
      });
      
      // Find fields with the largest range (potential outliers)
      numericInsights.sort((a, b) => b.range - a.range);
      
      if (numericInsights.length > 0) {
        const field = numericInsights[0].field;
        insights.push({
          type: 'insight',
          title: `${field} has the widest range`,
          description: `Values range from ${numericInsights[0].min} to ${numericInsights[0].max}, which may indicate outliers or diverse data points.`,
          icon: <Lightbulb className="h-5 w-5" />
        });
      }
      
      // Look for trends in numeric fields
      const trendFields = numericInsights.slice(0, 2);
      trendFields.forEach(fieldInfo => {
        insights.push({
          type: 'trend',
          title: `${fieldInfo.field} Analysis`,
          description: `Average value is ${fieldInfo.avg.toFixed(2)} with a range of ${fieldInfo.range.toFixed(2)}.`,
          icon: <TrendingUp className="h-5 w-5" />
        });
      });
    }
    
    // Add categorical field analysis
    if (schema.categoricalFields.length > 0) {
      const categoryInsights: Array<{ field: string; dominantValue: string; dominantCount: number; totalDistinct: number }> = [];
      
      schema.categoricalFields.forEach(field => {
        const valueCounts = new Map<string, number>();
        let totalValues = 0;
        
        data.forEach(item => {
          if (item[field] !== null && item[field] !== undefined && item[field] !== '') {
            const value = String(item[field]);
            valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
            totalValues++;
          }
        });
        
        if (valueCounts.size > 0 && totalValues > 0) {
          let dominantValue = '';
          let dominantCount = 0;
          
          valueCounts.forEach((count, value) => {
            if (count > dominantCount) {
              dominantValue = value;
              dominantCount = count;
            }
          });
          
          categoryInsights.push({
            field,
            dominantValue,
            dominantCount,
            totalDistinct: valueCounts.size
          });
        }
      });
      
      // Add insights about category distribution
      categoryInsights.forEach(catInfo => {
        const percentage = ((catInfo.dominantCount / data.length) * 100).toFixed(1);
        
        if (catInfo.totalDistinct <= 5 && parseFloat(percentage) > 50) {
          insights.push({
            type: 'insight',
            title: `Dominant ${catInfo.field}`,
            description: `"${catInfo.dominantValue}" represents ${percentage}% of all values for ${catInfo.field}.`,
            icon: <Lightbulb className="h-5 w-5" />
          });
        }
      });
    }
    
    // Check for data quality issues
    const missingValueFields: Array<{ field: string; missingCount: number; percentage: number }> = [];
    
    if (schema.fields.length > 0) {
      schema.fields.forEach(field => {
        const missingCount = data.filter(item => 
          item[field.name] === null || 
          item[field.name] === undefined || 
          item[field.name] === ''
        ).length;
        
        const percentage = (missingCount / data.length) * 100;
        
        if (percentage > 10) {
          missingValueFields.push({
            field: field.name,
            missingCount,
            percentage
          });
        }
      });
      
      if (missingValueFields.length > 0) {
        // Sort by percentage descending
        missingValueFields.sort((a, b) => b.percentage - a.percentage);
        
        const worstField = missingValueFields[0];
        insights.push({
          type: 'warning',
          title: 'Data Quality Issue',
          description: `Field "${worstField.field}" is missing ${worstField.percentage.toFixed(1)}% of values.`,
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    }
    
    return insights;
  }, [data]);
  
  if (!data.length) {
    return null;
  }
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>Automatic analysis of your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className={`shrink-0 mr-3 rounded-full p-2 
                  ${insight.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                  ${insight.type === 'trend' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : ''}
                  ${insight.type === 'insight' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : ''}
                  ${insight.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : ''}
                `}>
                  {insight.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No insights available for this dataset</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
