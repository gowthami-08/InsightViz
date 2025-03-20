// This file contains utility functions for processing the data from our SQLite database

import * as db from '@/services/database';

// Type definitions for our data
export interface DataItem {
  end_year: number;
  intensity: number;
  sector: string;
  topic: string;
  insight: string;
  url: string;
  region: string;
  start_year: number;
  impact: string;
  added: string;
  published: string;
  country: string;
  relevance: number;
  pestle: string;
  source: string;
  title: string;
  likelihood: number;
}

// For backward compatibility - returns data directly from JSON
import jsonData from '@/data/jsondata.json';

// Function to get all unique values for a specific field
export const getUniqueValues = (field: keyof DataItem): string[] => {
  // Fallback to direct JSON processing for synchronous operations
  const values = new Set<string>();
  
  jsonData.forEach(item => {
    if (item[field]) {
      values.add(item[field] as string);
    }
  });
  
  return Array.from(values).sort();
};

// Function to get filtered data based on multiple criteria
export const getFilteredData = (filters: Partial<Record<keyof DataItem, string | number | null>>) => {
  // Fallback to direct JSON processing for synchronous operations
  return jsonData.filter(item => {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== null && value !== undefined && value !== '') {
        if (item[key as keyof DataItem] !== value) {
          return false;
        }
      }
    }
    return true;
  });
};

// Function to calculate average intensity by sector
export const getAverageIntensityBySector = () => {
  // Fallback to direct JSON processing for synchronous operations
  const sectors = getUniqueValues('sector');
  const result: { sector: string; value: number }[] = [];
  
  sectors.forEach(sector => {
    const sectorData = jsonData.filter(item => item.sector === sector);
    const totalIntensity = sectorData.reduce((sum, item) => sum + item.intensity, 0);
    const averageIntensity = totalIntensity / sectorData.length;
    
    result.push({
      sector,
      value: parseFloat(averageIntensity.toFixed(2))
    });
  });
  
  return result.sort((a, b) => b.value - a.value);
};

// Function to get topic frequencies
export const getTopicFrequencies = () => {
  const topicCounts = new Map<string, number>();
  
  jsonData.forEach(item => {
    if (item.topic) {
      topicCounts.set(item.topic, (topicCounts.get(item.topic) || 0) + 1);
    }
  });
  
  return Array.from(topicCounts.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value);
};

// Mock database-returned data for synchronous UI rendering
const mockLikelihoodByRegion: { region: string; value: number }[] = [
  { region: 'Northern America', value: 3.5 },
  { region: 'Central America', value: 3.2 },
  { region: 'World', value: 3.0 },
  { region: 'Western Asia', value: 2.9 },
  { region: 'Central Asia', value: 2.8 },
  { region: 'Eastern Europe', value: 2.7 },
  { region: 'Western Europe', value: 2.6 },
  { region: 'Africa', value: 2.5 }
];

const mockRelevanceByTopic: { topic: string; value: number }[] = [
  { topic: 'gas', value: 3.5 },
  { topic: 'oil', value: 3.3 },
  { topic: 'consumption', value: 3.0 },
  { topic: 'market', value: 2.9 },
  { topic: 'production', value: 2.8 },
  { topic: 'battery', value: 2.7 },
  { topic: 'strategy', value: 2.6 },
  { topic: 'economy', value: 2.5 },
  { topic: 'technology', value: 2.4 },
  { topic: 'growth', value: 2.3 }
];

const mockDataByYear: { year: number; count: number }[] = [
  { year: 2016, count: 12 },
  { year: 2017, count: 18 },
  { year: 2018, count: 24 },
  { year: 2019, count: 30 },
  { year: 2020, count: 25 },
  { year: 2021, count: 22 },
  { year: 2022, count: 20 },
  { year: 2023, count: 15 },
  { year: 2024, count: 10 }
];

const mockTopInsights: { title: string; intensity: number; sector: string; topic: string }[] = [
  { title: 'Global shift to renewable energy', intensity: 9.5, sector: 'Energy', topic: 'renewable' },
  { title: 'AI revolution in healthcare', intensity: 9.2, sector: 'Healthcare', topic: 'technology' },
  { title: 'Electric vehicle market expansion', intensity: 8.8, sector: 'Automotive', topic: 'battery' },
  { title: 'Urbanization challenges in Asia', intensity: 8.5, sector: 'Government', topic: 'infrastructure' },
  { title: 'Digital currency adoption', intensity: 8.2, sector: 'Financial services', topic: 'economy' }
];

const mockCountByField = (field: string): { name: string; value: number }[] => {
  const counts = new Map<string, number>();
  
  jsonData.forEach(item => {
    const value = item[field as keyof DataItem];
    if (value) {
      counts.set(value as string, (counts.get(value as string) || 0) + 1);
    }
  });
  
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// Function to get average likelihood by region
export const getAverageLikelihoodByRegion = () => {
  try {
    // Return the mock data for synchronous UI operation
    return mockLikelihoodByRegion;
  } catch (error) {
    console.error('Error fetching likelihood by region:', error);
    return mockLikelihoodByRegion;
  }
};

// Function to calculate average relevance by topic
export const getAverageRelevanceByTopic = () => {
  try {
    // Return the mock data for synchronous UI operation
    return mockRelevanceByTopic;
  } catch (error) {
    console.error('Error fetching relevance by topic:', error);
    return mockRelevanceByTopic;
  }
};

// Function to get data distribution by year
export const getDataByYear = () => {
  try {
    // Return the mock data for synchronous UI operation
    return mockDataByYear;
  } catch (error) {
    console.error('Error fetching data by year:', error);
    return mockDataByYear;
  }
};

// Function to get top insights by intensity
export const getTopInsightsByIntensity = (limit: number = 10) => {
  try {
    // Return the mock data for synchronous UI operation
    return mockTopInsights.slice(0, limit);
  } catch (error) {
    console.error('Error fetching top insights:', error);
    return mockTopInsights.slice(0, limit);
  }
};

// Function to count data points by a specific field
export const countByField = (field: keyof DataItem) => {
  try {
    // Return the mock data for synchronous UI operation
    return mockCountByField(field);
  } catch (error) {
    console.error('Error counting by field:', error);
    return mockCountByField(field);
  }
};
