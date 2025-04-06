
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NaturalLanguageInsightsProps {
  data: any[];
}

export const NaturalLanguageInsights = ({ data }: NaturalLanguageInsightsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<{
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
  }[]>([]);
  
  // Generate insights based on data
  useEffect(() => {
    generateInsights();
  }, [data]);
  
  const generateInsights = () => {
    setIsLoading(true);
    
    // In a real application, this would make an API call to a language model
    // Here we'll simulate with predefined insights
    setTimeout(() => {
      const newInsights = [
        {
          title: "Energy Sector Growth",
          description: "The Energy sector shows a 12% increase in intensity compared to last period, suggesting increased importance and activity.",
          type: 'positive' as const
        },
        {
          title: "Regional Focus Shift",
          description: "Western Asia has surpassed Northern America in likelihood metrics, indicating a potential shift in regional importance.",
          type: 'neutral' as const
        },
        {
          title: "Topic Concentration Risk",
          description: "64% of high-intensity insights are concentrated in just 3 topics, suggesting potential vulnerability to disruption in these areas.",
          type: 'negative' as const
        },
        {
          title: "Emerging Trend Detected",
          description: "The renewable energy topic is showing consistently increasing relevance scores over the past 6 months.",
          type: 'positive' as const
        }
      ];
      
      setInsights(newInsights);
      setIsLoading(false);
    }, 1200);
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'positive':
        return <ArrowUpIcon className="text-green-500" />;
      case 'negative':
        return <ArrowDownIcon className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getClassForType = (type: string) => {
    switch (type) {
      case 'positive':
        return "border-l-4 border-green-500 pl-4";
      case 'negative':
        return "border-l-4 border-red-500 pl-4";
      default:
        return "border-l-4 border-gray-300 pl-4";
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>AI-generated analysis of your data</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateInsights}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Analyzing data trends...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-3 bg-card rounded-md ${getClassForType(insight.type)}`}>
                <div className="flex items-center mb-1">
                  {getIconForType(insight.type)}
                  <h3 className="font-medium ml-2">{insight.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
