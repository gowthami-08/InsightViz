
import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { MetricsOverview } from './MetricsOverview';
import { FilterBar } from './FilterBar';
import { DataTable } from './DataTable';
import TopicsWordCloud from './TopicsWordCloud';

export const Dashboard = () => {
  const { 
    filters, 
    filterOptions, 
    filteredData, 
    dashboardData,
    updateFilter, 
    resetFilters 
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterBar 
        filterOptions={filterOptions}
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Data Insights Dashboard</h1>
        
        {dashboardData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
              <MetricsOverview data={dashboardData} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
              <TopicsWordCloud />
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Raw Data</h2>
              <DataTable data={filteredData} />
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No data available based on the current filters.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
