const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// In-memory storage for analytics (in production, use a database)
let analyticsData = {
  metrics: [],
  pageViews: [],
  userActions: [],
  errors: [],
  performance: []
};

// Store metrics
router.post('/metrics', auth, async (req, res) => {
  try {
    const { type, data } = req.body;
    const userId = req.user._id;
    
    const metric = {
      id: Date.now().toString(),
      type,
      data,
      userId,
      timestamp: new Date(),
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };

    // Store based on type
    switch (type) {
      case 'pageLoad':
        analyticsData.performance.push(metric);
        break;
      case 'apiCall':
        analyticsData.metrics.push(metric);
        break;
      case 'error':
        analyticsData.errors.push(metric);
        break;
      case 'user_action':
      case 'customEvent':
        analyticsData.userActions.push(metric);
        break;
      case 'webVital':
        analyticsData.performance.push(metric);
        break;
      default:
        analyticsData.metrics.push(metric);
    }

    // Keep only last 10000 entries to prevent memory issues
    const maxEntries = 10000;
    Object.keys(analyticsData).forEach(key => {
      if (analyticsData[key].length > maxEntries) {
        analyticsData[key] = analyticsData[key].slice(-maxEntries);
      }
    });

    res.status(200).json({ message: 'Metric stored successfully' });
  } catch (error) {
    console.error('Error storing metric:', error);
    res.status(500).json({ message: 'Error storing metric' });
  }
});

// Get analytics dashboard data (admin only)
router.get('/dashboard', auth, isAdmin, async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter data by time periods
    const recentMetrics = analyticsData.metrics.filter(m => m.timestamp > last24Hours);
    const recentErrors = analyticsData.errors.filter(e => e.timestamp > last24Hours);
    const recentPerformance = analyticsData.performance.filter(p => p.timestamp > last24Hours);
    const recentUserActions = analyticsData.userActions.filter(u => u.timestamp > last24Hours);

    // Calculate statistics
    const stats = {
      totalMetrics: analyticsData.metrics.length,
      totalErrors: analyticsData.errors.length,
      totalUserActions: analyticsData.userActions.length,
      totalPerformance: analyticsData.performance.length,
      
      // Last 24 hours
      metrics24h: recentMetrics.length,
      errors24h: recentErrors.length,
      performance24h: recentPerformance.length,
      userActions24h: recentUserActions.length,

      // Performance metrics
      averageLoadTime: calculateAverageLoadTime(recentPerformance),
      errorRate: calculateErrorRate(recentMetrics, recentErrors),
      topUserActions: getTopUserActions(recentUserActions),
      topErrors: getTopErrors(recentErrors)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting analytics dashboard:', error);
    res.status(500).json({ message: 'Error getting analytics data' });
  }
});

// Get detailed metrics (admin only)
router.get('/metrics', auth, isAdmin, async (req, res) => {
  try {
    const { type, limit = 100, offset = 0 } = req.query;
    
    let data = analyticsData.metrics;
    if (type) {
      data = analyticsData.metrics.filter(m => m.type === type);
    }

    const paginatedData = data.slice(offset, offset + parseInt(limit));
    
    res.json({
      data: paginatedData,
      total: data.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error getting metrics:', error);
    res.status(500).json({ message: 'Error getting metrics' });
  }
});

// Get performance data (admin only)
router.get('/performance', auth, isAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const performanceData = analyticsData.performance.filter(p => p.timestamp > cutoffDate);
    
    // Group by date
    const groupedData = performanceData.reduce((acc, metric) => {
      const date = metric.timestamp.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { LCP: [], FID: [], CLS: [], pageLoads: [] };
      }
      
      if (metric.data.type === 'LCP') acc[date].LCP.push(metric.data.value);
      else if (metric.data.type === 'FID') acc[date].FID.push(metric.data.value);
      else if (metric.data.type === 'CLS') acc[date].CLS.push(metric.data.value);
      else if (metric.type === 'pageLoad') acc[date].pageLoads.push(metric.data.loadTime);
      
      return acc;
    }, {});

    // Calculate averages
    const averagedData = Object.keys(groupedData).map(date => ({
      date,
      avgLCP: groupedData[date].LCP.length > 0 ? 
        groupedData[date].LCP.reduce((a, b) => a + b, 0) / groupedData[date].LCP.length : 0,
      avgFID: groupedData[date].FID.length > 0 ? 
        groupedData[date].FID.reduce((a, b) => a + b, 0) / groupedData[date].FID.length : 0,
      avgCLS: groupedData[date].CLS.length > 0 ? 
        groupedData[date].CLS.reduce((a, b) => a + b, 0) / groupedData[date].CLS.length : 0,
      avgLoadTime: groupedData[date].pageLoads.length > 0 ? 
        groupedData[date].pageLoads.reduce((a, b) => a + b, 0) / groupedData[date].pageLoads.length : 0,
      totalPageViews: groupedData[date].pageLoads.length
    }));

    res.json(averagedData);
  } catch (error) {
    console.error('Error getting performance data:', error);
    res.status(500).json({ message: 'Error getting performance data' });
  }
});

// Get error analytics (admin only)
router.get('/errors', auth, isAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const recentErrors = analyticsData.errors.filter(e => e.timestamp > cutoffDate);
    
    // Group errors by type
    const errorGroups = recentErrors.reduce((acc, error) => {
      const errorType = error.data.message || 'Unknown Error';
      if (!acc[errorType]) {
        acc[errorType] = [];
      }
      acc[errorType].push(error);
      return acc;
    }, {});

    const errorStats = Object.keys(errorGroups).map(errorType => ({
      errorType,
      count: errorGroups[errorType].length,
      lastOccurrence: errorGroups[errorType][errorGroups[errorType].length - 1].timestamp,
      examples: errorGroups[errorType].slice(0, 3) // First 3 examples
    }));

    res.json(errorStats);
  } catch (error) {
    console.error('Error getting error analytics:', error);
    res.status(500).json({ message: 'Error getting error analytics' });
  }
});

// Clear analytics data (admin only)
router.delete('/clear', auth, isAdmin, async (req, res) => {
  try {
    analyticsData = {
      metrics: [],
      pageViews: [],
      userActions: [],
      errors: [],
      performance: []
    };
    
    res.json({ message: 'Analytics data cleared successfully' });
  } catch (error) {
    console.error('Error clearing analytics data:', error);
    res.status(500).json({ message: 'Error clearing analytics data' });
  }
});

// Helper functions
function calculateAverageLoadTime(performanceData) {
  const loadTimes = performanceData
    .filter(p => p.type === 'pageLoad')
    .map(p => p.data.loadTime);
  
  if (loadTimes.length === 0) return 0;
  return loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
}

function calculateErrorRate(metrics, errors) {
  const totalRequests = metrics.length;
  const totalErrors = errors.length;
  
  if (totalRequests === 0) return 0;
  return (totalErrors / totalRequests) * 100;
}

function getTopUserActions(userActions) {
  const actionCounts = userActions.reduce((acc, action) => {
    const actionType = action.data.action || 'unknown';
    acc[actionType] = (acc[actionType] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getTopErrors(errors) {
  const errorCounts = errors.reduce((acc, error) => {
    const errorType = error.data.message || 'Unknown Error';
    acc[errorType] = (acc[errorType] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(errorCounts)
    .map(([error, count]) => ({ error, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

module.exports = router; 