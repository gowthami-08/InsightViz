
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getMostFrequentTopics } from '@/services/database';

interface TopicData {
  topic: string;
  count: number;
}

const TopicsWordCloud = () => {
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Use mock data first for quick rendering
        const mockTopics = [
          { topic: 'energy', count: 15 },
          { topic: 'oil', count: 12 },
          { topic: 'gas', count: 10 },
          { topic: 'production', count: 9 },
          { topic: 'growth', count: 9 },
          { topic: 'market', count: 8 },
          { topic: 'economy', count: 8 },
          { topic: 'economic', count: 7 },
          { topic: 'export', count: 7 },
          { topic: 'technology', count: 6 },
          { topic: 'vehicle', count: 6 },
          { topic: 'climate', count: 5 },
          { topic: 'power', count: 5 },
          { topic: 'policy', count: 4 },
          { topic: 'food', count: 4 }
        ];
        
        setTopics(mockTopics);
        setIsLoading(false);
        
        // Then try to get actual data from the database
        try {
          const dbTopics = await getMostFrequentTopics(50);
          if (dbTopics && dbTopics.length > 0) {
            setTopics(dbTopics);
          }
        } catch (dbError) {
          console.error('Could not load topics from database, using mock data:', dbError);
        }
      } catch (error) {
        console.error('Error loading topics:', error);
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Calculate font size based on count (frequency)
  const calculateFontSize = (count: number): number => {
    const minFontSize = 14;
    const maxFontSize = 60;
    const maxCount = Math.max(...topics.map(t => t.count));
    const minCount = Math.min(...topics.map(t => t.count));
    
    if (maxCount === minCount) return 24;
    
    // Linear scale for font size
    return minFontSize + ((count - minCount) / (maxCount - minCount)) * (maxFontSize - minFontSize);
  };

  // Function to get a consistent color for a topic
  const getTopicColor = (topic: string): string => {
    const colors = [
      'text-blue-600', 'text-green-500', 'text-teal-500', 
      'text-indigo-600', 'text-purple-600', 'text-yellow-600',
      'text-red-500', 'text-pink-500', 'text-cyan-600'
    ];
    
    // Use the string's chars to determine a consistent color
    const charSum = topic.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <Card className="col-span-12 h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Most Frequent Topics</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-4 p-6 h-[400px]">
            {Array(15).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-md" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 p-6 h-[400px] overflow-hidden">
            {topics.map((topic) => (
              <div
                key={topic.topic}
                className={`${getTopicColor(topic.topic)} font-medium hover:opacity-80 transition-opacity cursor-default`}
                style={{
                  fontSize: `${calculateFontSize(topic.count)}px`,
                  padding: '0.1em 0.2em',
                  display: 'inline-block',
                  transform: Math.random() > 0.5 ? 'rotate(0deg)' : 'rotate(0deg)',
                }}
                title={`${topic.topic}: ${topic.count} occurrences`}
              >
                {topic.topic}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicsWordCloud;
