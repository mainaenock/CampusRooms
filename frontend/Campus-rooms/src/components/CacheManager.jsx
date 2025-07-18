import React, { useState, useEffect } from 'react';
import smartCache from '../services/SmartCache.js';
import performanceMonitor from '../services/PerformanceMonitor.js';

const CacheManager = () => {
  const [cacheStats, setCacheStats] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStats = () => {
    setCacheStats(smartCache.getStats());
    setPerformanceMetrics(performanceMonitor.getMetrics());
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear all cached data? This will temporarily slow down the application.')) {
      setIsRefreshing(true);
      smartCache.clear();
      setTimeout(() => {
        updateStats();
        setIsRefreshing(false);
      }, 1000);
    }
  };

  const handlePreloadData = async () => {
    setIsRefreshing(true);
    try {
      await smartCache.preloadData();
      updateStats();
    } catch (error) {
      console.error('Error preloading data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInvalidateListings = () => {
    smartCache.invalidateListingsCache();
    updateStats();
  };

  if (!cacheStats) {
    return <div className="text-center py-4">Loading cache statistics...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Cache & Performance Management</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePreloadData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Cache'}
          </button>
          <button
            onClick={handleClearCache}
            disabled={isRefreshing}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
          >
            Clear All Cache
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cache Statistics */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Cache Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cached Items:</span>
              <span className="font-semibold">{cacheStats.totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expired Items:</span>
              <span className="font-semibold text-orange-600">{cacheStats.expiredItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Access Count:</span>
              <span className="font-semibold">{cacheStats.averageAccessCount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Cache Size:</span>
              <span className="font-semibold">{cacheStats.maxSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cache Utilization:</span>
              <span className="font-semibold">
                {((cacheStats.totalItems / cacheStats.maxSize) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h4>
          {performanceMetrics && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Page Loads:</span>
                <span className="font-semibold">{performanceMetrics.pageLoads.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">API Calls:</span>
                <span className="font-semibold">{performanceMetrics.apiCalls.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Errors:</span>
                <span className="font-semibold text-red-600">{performanceMetrics.errors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User Interactions:</span>
                <span className="font-semibold">{performanceMetrics.userInteractions.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cache Actions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Cache Actions</h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleInvalidateListings}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            Invalidate Listings Cache
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('smartCache');
              updateStats();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Clear Local Storage
          </button>
          <button
            onClick={() => {
              performanceMonitor.clearSentMetrics();
              updateStats();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Clear Performance Data
          </button>
        </div>
      </div>

      {/* Cache Health Status */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Cache Health Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${
            cacheStats.totalItems < cacheStats.maxSize * 0.8 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-red-100 border border-red-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cache Size</span>
              <span className={`text-sm font-bold ${
                cacheStats.totalItems < cacheStats.maxSize * 0.8 ? 'text-green-800' : 'text-red-800'
              }`}>
                {cacheStats.totalItems < cacheStats.maxSize * 0.8 ? 'Healthy' : 'Full'}
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            cacheStats.expiredItems < cacheStats.totalItems * 0.1 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-yellow-100 border border-yellow-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expired Items</span>
              <span className={`text-sm font-bold ${
                cacheStats.expiredItems < cacheStats.totalItems * 0.1 ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {cacheStats.expiredItems < cacheStats.totalItems * 0.1 ? 'Good' : 'Needs Cleanup'}
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            cacheStats.averageAccessCount > 2 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-blue-100 border border-blue-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cache Efficiency</span>
              <span className={`text-sm font-bold ${
                cacheStats.averageAccessCount > 2 ? 'text-green-800' : 'text-blue-800'
              }`}>
                {cacheStats.averageAccessCount > 2 ? 'High' : 'Normal'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheManager; 