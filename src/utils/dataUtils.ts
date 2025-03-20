
// This file contains utility functions for processing the JSON data

import data from '@/data/jsondata.json';

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

// Function to get all unique values for a specific field
export const getUniqueValues = (field: keyof DataItem): string[] => {
  const values = new Set<string>();
  
  data.forEach(item => {
    if (item[field]) {
      values.add(item[field] as string);
    }
  });
  
  return Array.from(values).sort();
};

// Function to get filtered data based on multiple criteria
export const getFilteredData = (filters: Partial<Record<keyof DataItem, string | number | null>>) => {
  return data.filter(item => {
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
  const sectors = getUniqueValues('sector');
  const result: { sector: string; value: number }[] = [];
  
  sectors.forEach(sector => {
    const sectorData = data.filter(item => item.sector === sector);
    const totalIntensity = sectorData.reduce((sum, item) => sum + item.intensity, 0);
    const averageIntensity = totalIntensity / sectorData.length;
    
    result.push({
      sector,
      value: parseFloat(averageIntensity.toFixed(2))
    });
  });
  
  return result.sort((a, b) => b.value - a.value);
};

// Function to calculate average likelihood by region
export const getAverageLikelihoodByRegion = () => {
  const regions = getUniqueValues('region');
  const result: { region: string; value: number }[] = [];
  
  regions.forEach(region => {
    const regionData = data.filter(item => item.region === region);
    const totalLikelihood = regionData.reduce((sum, item) => sum + item.likelihood, 0);
    const averageLikelihood = totalLikelihood / regionData.length;
    
    result.push({
      region,
      value: parseFloat(averageLikelihood.toFixed(2))
    });
  });
  
  return result.sort((a, b) => b.value - a.value);
};

// Function to calculate average relevance by topic
export const getAverageRelevanceByTopic = () => {
  const topics = getUniqueValues('topic');
  const result: { topic: string; value: number }[] = [];
  
  topics.forEach(topic => {
    const topicData = data.filter(item => item.topic === topic);
    const totalRelevance = topicData.reduce((sum, item) => sum + item.relevance, 0);
    const averageRelevance = totalRelevance / topicData.length;
    
    result.push({
      topic,
      value: parseFloat(averageRelevance.toFixed(2))
    });
  });
  
  return result.sort((a, b) => b.value - a.value);
};

// Function to get data distribution by year
export const getDataByYear = () => {
  const years = new Set<number>();
  
  data.forEach(item => {
    if (item.start_year) years.add(item.start_year);
    if (item.end_year) years.add(item.end_year);
  });
  
  const yearArray = Array.from(years).sort();
  const result = yearArray.map(year => {
    const yearData = data.filter(item => 
      (item.start_year && item.start_year <= year) && 
      (item.end_year && item.end_year >= year)
    );
    
    return {
      year,
      count: yearData.length
    };
  });
  
  return result;
};

// Function to get top insights by intensity
export const getTopInsightsByIntensity = (limit: number = 10) => {
  return [...data]
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, limit)
    .map(item => ({
      title: item.title,
      intensity: item.intensity,
      sector: item.sector,
      topic: item.topic
    }));
};

// Function to count data points by a specific field
export const countByField = (field: keyof DataItem) => {
  const counts: Record<string, number> = {};
  
  data.forEach(item => {
    const value = item[field] as string;
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  
  return Object.entries(counts)
    .map(([key, value]) => ({ name: key, value }))
    .sort((a, b) => b.value - a.value);
};
