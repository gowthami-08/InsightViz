import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { extractAttributes } from '@/utils/fileParsingUtils';

interface TrendingTopicsProps {
  data: any[];
  themeField?: string; // Field to use for topic extraction (if known)
}

export const TrendingTopics = ({ data, themeField }: TrendingTopicsProps) => {
  // Extract trending topics/keywords from the data
  const topics = useMemo(() => {
    if (!data.length) return [];
    
    // Get all potential string fields
    const attributes = extractAttributes(data);
    
    // If a specific theme field is provided, use it
    if (themeField && attributes[themeField]) {
      return attributes[themeField]
        .filter(Boolean)
        .slice(0, 10);
    }
    
    // Otherwise, try to find the most suitable text fields for topic extraction
    const candidateFields = Object.entries(attributes)
      .filter(([_, values]) => {
        // Look for fields that have string values and reasonable variety
        return values.length > 0 && 
               values.length <= 50 && // Not too many unique values
               typeof values[0] === 'string';
      })
      .sort(([_, valuesA], [__, valuesB]) => {
        // Prefer fields with more values but not too many
        return valuesB.length - valuesA.length;
      });
    
    if (candidateFields.length > 0) {
      // Use the best candidate field
      return candidateFields[0][1]
        .filter(Boolean)
        .slice(0, 15);
    }
    
    return [];
  }, [data, themeField]);
  
  // Style topics based on frequency
  const styledTopics = useMemo(() => {
    if (!topics.length) return [];
    
    const topicFrequency = new Map<string, number>();
    
    // Count occurrences of each topic
    data.forEach(item => {
      topics.forEach(topic => {
        // Check if this topic appears in any string field of the item
        Object.values(item).forEach(value => {
          if (typeof value === 'string' && 
              value.toLowerCase().includes(topic.toLowerCase())) {
            topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1);
          }
        });
      });
    });
    
    // Sort by frequency
    return Array.from(topics)
      .map(topic => ({
        text: topic,
        count: topicFrequency.get(topic) || 1,
        size: calculateSize(topicFrequency.get(topic) || 1, data.length)
      }))
      .sort((a, b) => b.count - a.count);
  }, [topics, data]);
  
  if (!data.length || styledTopics.length === 0) {
    return null;
  }
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Trending Topics</CardTitle>
        <CardDescription>Key themes discovered in your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {styledTopics.map((topic, index) => (
            <Badge
              key={index}
              variant={getBadgeVariant(index)}
              className={`text-${topic.size} py-1 px-3 cursor-default hover:scale-105 transition-transform`}
            >
              {topic.text}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper to determine badge variant based on index
function getBadgeVariant(index: number): "default" | "secondary" | "outline" {
  if (index < 3) return "default";
  if (index < 6) return "secondary";
  return "outline";
}

// Helper to calculate size based on count
function calculateSize(count: number, total: number): 'xs' | 'sm' | 'base' | 'lg' {
  const percentage = (count / total) * 100;
  
  if (percentage > 10) return 'lg';
  if (percentage > 5) return 'base';
  if (percentage > 2) return 'sm';
  return 'xs';
}
