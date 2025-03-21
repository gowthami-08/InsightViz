
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getUniqueValues } from '@/utils/dataUtils';

type WordCloudItem = {
  text: string;
  value: number;
};

const colors = [
  "text-blue-500", "text-indigo-500", "text-purple-500", 
  "text-pink-500", "text-red-500", "text-orange-500", 
  "text-yellow-500", "text-green-500", "text-teal-500", "text-cyan-500"
];

export const TopicsWordCloud = () => {
  const [topics, setTopics] = useState<WordCloudItem[]>([
    // Default topics from JSON data with frequencies
    { text: "gas", value: 42 },
    { text: "oil", value: 38 },
    { text: "consumption", value: 35 },
    { text: "market", value: 32 },
    { text: "war", value: 29 },
    { text: "production", value: 28 },
    { text: "export", value: 25 },
    { text: "gdp", value: 23 },
    { text: "battery", value: 21 },
    { text: "energy", value: 20 },
    { text: "growth", value: 18 },
    { text: "economic", value: 17 },
    { text: "economy", value: 16 },
    { text: "policy", value: 14 },
    { text: "administration", value: 13 },
    { text: "strategy", value: 12 },
    { text: "unemployment", value: 10 },
    { text: "robot", value: 9 },
    { text: "food", value: 8 }
  ]);

  // Normalize sizes for visual representation
  const minFontSize = 0.8;  // rem
  const maxFontSize = 2.5;  // rem
  
  const minValue = Math.min(...topics.map(topic => topic.value));
  const maxValue = Math.max(...topics.map(topic => topic.value));
  
  const getSizeForValue = (value: number) => {
    // Linear interpolation between min and max font sizes
    if (maxValue === minValue) return (minFontSize + maxFontSize) / 2;
    return minFontSize + (value - minValue) * (maxFontSize - minFontSize) / (maxValue - minValue);
  };

  // Sort topics by frequency for better visualization
  const sortedTopics = [...topics].sort((a, b) => b.value - a.value);

  return (
    <Card className="hover:shadow-medium transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Frequent Topics</CardTitle>
        <CardDescription>Common topics in the dataset sized by frequency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-3 py-4">
          {sortedTopics.map((topic, index) => (
            <div 
              key={topic.text} 
              className={`${colors[index % colors.length]} hover:opacity-80 transition-opacity cursor-default animate-fade-in`}
              style={{ 
                fontSize: `${getSizeForValue(topic.value)}rem`,
                padding: '0.25rem 0.5rem',
                borderRadius: '0.5rem',
                background: `rgba(${index % 3 * 20}, ${index % 5 * 10}, ${index % 7 * 15}, 0.1)`,
                fontWeight: topic.value > (minValue + maxValue) / 2 ? 'bold' : 'normal',
                animationDelay: `${index * 100}ms`,
              }}
            >
              {topic.text}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
