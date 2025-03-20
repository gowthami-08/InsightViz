
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

// Function to calculate average likelihood by region
export const getAverageLikelihoodByRegion = () => {
  return db.getAverageLikelihoodByRegion();
};

// Function to calculate average relevance by topic
export const getAverageRelevanceByTopic = () => {
  return db.getAverageRelevanceByTopic();
};

// Function to get data distribution by year
export const getDataByYear = () => {
  return db.getDataByYear();
};

// Function to get top insights by intensity
export const getTopInsightsByIntensity = (limit: number = 10) => {
  return db.getTopInsightsByIntensity(limit);
};

// Function to count data points by a specific field
export const countByField = (field: keyof DataItem) => {
  return db.countByField(field);
};
