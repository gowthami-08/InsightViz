
import { useState, useMemo } from 'react';
import { 
  DataItem, 
  getFilteredData, 
  getUniqueValues,
  getAverageIntensityBySector,
  getAverageLikelihoodByRegion,
  getAverageRelevanceByTopic,
  getDataByYear,
  getTopInsightsByIntensity,
  countByField
} from '@/utils/dataUtils';

interface Filters {
  sector: string | null;
  topic: string | null;
  region: string | null;
  end_year: number | null;
  pestle: string | null;
  source: string | null;
  country: string | null;
}

export interface DashboardData {
  totalItems: number;
  averageIntensity: number;
  averageLikelihood: number;
  averageRelevance: number;
  intensityBySector: { sector: string; value: number }[];
  likelihoodByRegion: { region: string; value: number }[];
  relevanceByTopic: { topic: string; value: number }[];
  dataByYear: { year: number; count: number }[];
  topInsights: { title: string; intensity: number; sector: string; topic: string }[];
  sectorDistribution: { name: string; value: number }[];
  pestleDistribution: { name: string; value: number }[];
  regionDistribution: { name: string; value: number }[];
}

export const useDashboardData = () => {
  const [filters, setFilters] = useState<Filters>({
    sector: null,
    topic: null,
    region: null,
    end_year: null,
    pestle: null,
    source: null,
    country: null
  });
  
  // Get unique values for filter options
  const filterOptions = useMemo(() => ({
    sectors: getUniqueValues('sector'),
    topics: getUniqueValues('topic'),
    regions: getUniqueValues('region'),
    endYears: getUniqueValues('end_year'),
    pestles: getUniqueValues('pestle'),
    sources: getUniqueValues('source'),
    countries: getUniqueValues('country')
  }), []);
  
  // Get filtered data based on current filters
  const filteredData = useMemo(() => {
    return getFilteredData(filters);
  }, [filters]);
  
  // Calculate various metrics based on filtered data
  const dashboardData = useMemo((): DashboardData | null => {
    // Only calculate these if we have filtered data
    if (!filteredData.length) return null;
    
    return {
      totalItems: filteredData.length,
      averageIntensity: filteredData.reduce((sum, item) => sum + item.intensity, 0) / filteredData.length,
      averageLikelihood: filteredData.reduce((sum, item) => sum + item.likelihood, 0) / filteredData.length,
      averageRelevance: filteredData.reduce((sum, item) => sum + item.relevance, 0) / filteredData.length,
      intensityBySector: getAverageIntensityBySector(),
      likelihoodByRegion: getAverageLikelihoodByRegion(),
      relevanceByTopic: getAverageRelevanceByTopic(),
      dataByYear: getDataByYear(),
      topInsights: getTopInsightsByIntensity(5),
      sectorDistribution: countByField('sector'),
      pestleDistribution: countByField('pestle'),
      regionDistribution: countByField('region')
    };
  }, [filteredData]);
  
  // Function to update a single filter
  const updateFilter = (field: keyof Filters, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Function to reset all filters
  const resetFilters = () => {
    setFilters({
      sector: null,
      topic: null,
      region: null,
      end_year: null,
      pestle: null,
      source: null,
      country: null
    });
  };
  
  return {
    filters,
    filterOptions,
    filteredData,
    dashboardData,
    updateFilter,
    resetFilters
  };
};
