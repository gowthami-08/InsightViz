
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, BrainCircuit, Zap, Lightbulb } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface InsightSummary {
  id: string;
  title: string;
  preview: string;
  type: 'positive' | 'negative' | 'neutral';
  category: string;
  timestamp: number;
}

export const InsightsSummary = () => {
  const [insights, setInsights] = useState<InsightSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading insights
    const loadInsights = () => {
      setIsLoading(true);
      
      // This would be an API call in a real app
      setTimeout(() => {
        const mockInsights: InsightSummary[] = [
          {
            id: '1',
            title: "Energy sector growth accelerating",
            preview: "12% increase in intensity metrics",
            type: 'positive',
            category: 'trend',
            timestamp: Date.now() - 3600000 // 1 hour ago
          },
          {
            id: '2',
            title: "Supply chain anomaly detected",
            preview: "Unusual spike in relevance scores",
            type: 'negative',
            category: 'anomaly',
            timestamp: Date.now() - 7200000 // 2 hours ago
          },
          {
            id: '3',
            title: "Regional focus shifting to Asia",
            preview: "Western Asia surpassing North America",
            type: 'neutral',
            category: 'trend',
            timestamp: Date.now() - 86400000 // 1 day ago
          }
        ];
        
        setInsights(mockInsights);
        setIsLoading(false);
      }, 800);
    };
    
    loadInsights();
  }, []);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  const viewAllInsights = () => {
    navigate('/dashboard');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Top Insights</CardTitle>
            <CardDescription>Recent AI-generated findings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <BrainCircuit className="h-8 w-8 animate-pulse text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
                  <div className="mt-0.5">{getTypeIcon(insight.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{insight.preview}</p>
                    <div className="flex items-center mt-1 gap-2">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-auto">
                        {insight.category}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {getTimeAgo(insight.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4 text-primary"
              onClick={viewAllInsights}
            >
              View all insights in Dashboard
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
