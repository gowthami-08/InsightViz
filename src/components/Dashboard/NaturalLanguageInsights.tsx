
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw, BrainCircuit, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/tabs";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  confidence: number;
  category: 'trend' | 'anomaly' | 'recommendation' | 'correlation';
  source?: string;
  timestamp: number;
}

interface NaturalLanguageInsightsProps {
  data: any[];
}

export const NaturalLanguageInsights = ({ data }: NaturalLanguageInsightsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [insights, setInsights] = useState<Insight[]>([]);
  const { toast } = useToast();
  
  // Generate insights based on data
  useEffect(() => {
    if (data.length > 0) {
      generateInsights();
    }
  }, [data]);
  
  const generateInsights = () => {
    setIsLoading(true);
    
    // In a real application, this would make an API call to a language model
    // Here we'll simulate with more sophisticated insights
    setTimeout(() => {
      const newInsights: Insight[] = [
        {
          id: '1',
          title: "Energy Sector Growth Acceleration",
          description: "The Energy sector shows a 12% increase in intensity compared to last period, with a statistically significant acceleration in growth rate (p<0.05). Consider increasing investment allocation in this sector.",
          type: 'positive',
          confidence: 0.92,
          category: 'trend',
          timestamp: Date.now()
        },
        {
          id: '2',
          title: "Regional Focus Shift",
          description: "Western Asia has surpassed Northern America in likelihood metrics by 8.3%, indicating a potential structural shift in regional importance. This pattern has sustained for 3 consecutive quarters.",
          type: 'neutral',
          confidence: 0.86,
          category: 'trend',
          timestamp: Date.now()
        },
        {
          id: '3',
          title: "Topic Concentration Risk",
          description: "64% of high-intensity insights are concentrated in just 3 topics, suggesting potential vulnerability to disruption in these areas. Recommended action: diversify focus across more topics to mitigate risk.",
          type: 'negative',
          confidence: 0.89,
          category: 'correlation',
          timestamp: Date.now()
        },
        {
          id: '4',
          title: "Emerging Trend Detected",
          description: "The renewable energy topic is showing consistently increasing relevance scores over the past 6 months with a clear inflection point in Q2. Correlation with policy announcements is 0.78.",
          type: 'positive',
          confidence: 0.91,
          category: 'trend',
          timestamp: Date.now()
        },
        {
          id: '5',
          title: "Anomaly: Unusual Relevance Spike",
          description: "Detected an abnormal 27% spike in relevance for 'supply chain' topics in the last 14 days. This exceeds 2σ from the historical average and coincides with recent logistics industry disruptions.",
          type: 'negative',
          confidence: 0.84,
          category: 'anomaly',
          timestamp: Date.now()
        },
        {
          id: '6',
          title: "Correlation: Market and Likelihood",
          description: "Strong positive correlation (r=0.81) identified between market performance and likelihood metrics for technology sector. This relationship has strengthened over time, suggesting increased predictive value.",
          type: 'positive',
          confidence: 0.88,
          category: 'correlation',
          timestamp: Date.now()
        },
        {
          id: '7',
          title: "Recommendation: Adjust Sector Weights",
          description: "Based on intensity and relevance trends, consider increasing focus on renewable energy (+15%) and reducing exposure to traditional manufacturing (-10%) for optimal resource allocation.",
          type: 'neutral',
          confidence: 0.85,
          category: 'recommendation',
          timestamp: Date.now()
        }
      ];
      
      setInsights(newInsights);
      setIsLoading(false);
    }, 1200);
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'positive':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
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
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend':
        return <ArrowUpIcon className="h-3 w-3" />;
      case 'anomaly':
        return <HelpCircle className="h-3 w-3" />;
      case 'recommendation':
        return <BrainCircuit className="h-3 w-3" />;
      case 'correlation':
        return <ArrowRight className="h-3 w-3" />;
      default:
        return null;
    }
  };
  
  const getConfidenceBadgeClass = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (confidence >= 0.75) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  };
  
  const handleSaveInsight = (insightId: string) => {
    // In a real app, this would save to user's saved insights
    toast({
      title: "Insight saved",
      description: "This insight has been saved to your collection"
    });
  };
  
  const handleShareInsight = (insightId: string) => {
    // In a real app, this would open a share dialog
    toast({
      title: "Share feature",
      description: "Sharing functionality would open here"
    });
  };
  
  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => {
        if (activeTab === 'positive') return insight.type === 'positive';
        if (activeTab === 'negative') return insight.type === 'negative';
        if (activeTab === 'neutral') return insight.type === 'neutral';
        if (activeTab === 'recommendations') return insight.category === 'recommendation';
        return true;
      });
  
  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              AI-Generated Insights
              <HoverCard>
                <HoverCardTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">About AI Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      These insights are generated using machine learning algorithms that analyze patterns, trends, and anomalies in your data. Confidence scores indicate the AI's certainty in each insight.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardTitle>
            <CardDescription>Automatically identified patterns and recommendations</CardDescription>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateInsights}
          disabled={isLoading}
          className="shrink-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      
      <TabGroup value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabList className="w-full justify-start mb-2">
            <Tab value="all" className="text-xs">All Insights</Tab>
            <Tab value="positive" className="text-xs">Positive</Tab>
            <Tab value="negative" className="text-xs">Negative</Tab>
            <Tab value="recommendations" className="text-xs">Recommendations</Tab>
          </TabList>
          <Separator />
        </div>
        
        <TabPanels>
          <TabPanel value="all" className="animate-fade-in">
            <CardContent className="pt-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Analyzing data patterns...</p>
                    <p className="text-xs text-muted-foreground mt-1">Identifying insights, trends and recommendations</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInsights.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No insights found for the selected filter.</p>
                    </div>
                  ) : (
                    filteredInsights.map((insight) => (
                      <div 
                        key={insight.id} 
                        className={cn(
                          "p-3 bg-card rounded-md shadow-sm border", 
                          getClassForType(insight.type)
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {getIconForType(insight.type)}
                            <h3 className="font-medium ml-2">{insight.title}</h3>
                          </div>
                          <div>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              getConfidenceBadgeClass(insight.confidence)
                            )}>
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <div className="flex items-center text-muted-foreground">
                            <span className="flex items-center mr-2">
                              {getCategoryIcon(insight.category)}
                              <span className="ml-1 capitalize">{insight.category}</span>
                            </span>
                            <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleSaveInsight(insight.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleShareInsight(insight.id)}
                            >
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </TabPanel>
          
          <TabPanel value="positive" className="animate-fade-in">
            <CardContent className="pt-4">
              {/* Same content structure as "all" tab but with filtered data */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInsights.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No positive insights found.</p>
                    </div>
                  ) : (
                    // Same rendering logic as in the "all" tab
                    filteredInsights.map((insight) => (
                      <div 
                        key={insight.id} 
                        className={cn(
                          "p-3 bg-card rounded-md shadow-sm border", 
                          getClassForType(insight.type)
                        )}
                      >
                        {/* Same insight card content as in "all" tab */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {getIconForType(insight.type)}
                            <h3 className="font-medium ml-2">{insight.title}</h3>
                          </div>
                          <div>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              getConfidenceBadgeClass(insight.confidence)
                            )}>
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <div className="flex items-center text-muted-foreground">
                            <span className="flex items-center mr-2">
                              {getCategoryIcon(insight.category)}
                              <span className="ml-1 capitalize">{insight.category}</span>
                            </span>
                            <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleSaveInsight(insight.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleShareInsight(insight.id)}
                            >
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </TabPanel>
          
          <TabPanel value="negative" className="animate-fade-in">
            <CardContent className="pt-4">
              {/* Similar content as other tabs */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInsights.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No negative insights found.</p>
                    </div>
                  ) : (
                    filteredInsights.map((insight) => (
                      <div 
                        key={insight.id} 
                        className={cn(
                          "p-3 bg-card rounded-md shadow-sm border", 
                          getClassForType(insight.type)
                        )}
                      >
                        {/* Same insight card structure */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {getIconForType(insight.type)}
                            <h3 className="font-medium ml-2">{insight.title}</h3>
                          </div>
                          <div>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              getConfidenceBadgeClass(insight.confidence)
                            )}>
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <div className="flex items-center text-muted-foreground">
                            <span className="flex items-center mr-2">
                              {getCategoryIcon(insight.category)}
                              <span className="ml-1 capitalize">{insight.category}</span>
                            </span>
                            <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleSaveInsight(insight.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleShareInsight(insight.id)}
                            >
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </TabPanel>
          
          <TabPanel value="recommendations" className="animate-fade-in">
            <CardContent className="pt-4">
              {/* Similar content as other tabs */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInsights.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No recommendations found.</p>
                    </div>
                  ) : (
                    filteredInsights.map((insight) => (
                      <div 
                        key={insight.id} 
                        className={cn(
                          "p-3 bg-card rounded-md shadow-sm border", 
                          getClassForType(insight.type)
                        )}
                      >
                        {/* Same insight card structure */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {getIconForType(insight.type)}
                            <h3 className="font-medium ml-2">{insight.title}</h3>
                          </div>
                          <div>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              getConfidenceBadgeClass(insight.confidence)
                            )}>
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex items-center justify-between text-xs mt-2">
                          <div className="flex items-center text-muted-foreground">
                            <span className="flex items-center mr-2">
                              {getCategoryIcon(insight.category)}
                              <span className="ml-1 capitalize">{insight.category}</span>
                            </span>
                            <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleSaveInsight(insight.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => handleShareInsight(insight.id)}
                            >
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
};
