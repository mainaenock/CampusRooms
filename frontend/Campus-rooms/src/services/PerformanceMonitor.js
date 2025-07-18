class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: [],
      apiCalls: [],
      errors: [],
      userInteractions: []
    };
    this.isEnabled = this.checkAnalyticsConsent();
    this.init();
  }

  init() {
    if (!this.isEnabled) return;

    // Monitor page load performance
    this.monitorPageLoads();
    
    // Monitor API calls
    this.monitorApiCalls();
    
    // Monitor errors
    this.monitorErrors();
    
    // Monitor user interactions
    this.monitorUserInteractions();
    
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
  }

  checkAnalyticsConsent() {
    try {
      const consent = localStorage.getItem('cookieConsent');
      if (consent) {
        const preferences = JSON.parse(consent);
        return preferences.analytics === true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  monitorPageLoads() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          const metrics = {
            timestamp: Date.now(),
            url: window.location.href,
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
            firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
              effectiveType: navigator.connection.effectiveType,
              downlink: navigator.connection.downlink,
              rtt: navigator.connection.rtt
            } : null
          };

          this.metrics.pageLoads.push(metrics);
          this.sendMetrics('pageLoad', metrics);
        }, 0);
      });
    }
  }

  monitorApiCalls() {
    // Intercept fetch calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        const metric = {
          timestamp: Date.now(),
          url: typeof url === 'string' ? url : url.url,
          method: args[1]?.method || 'GET',
          duration: endTime - startTime,
          status: response.status,
          statusText: response.statusText
        };

        this.metrics.apiCalls.push(metric);
        this.sendMetrics('apiCall', metric);
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        
        const metric = {
          timestamp: Date.now(),
          url: typeof url === 'string' ? url : url.url,
          method: args[1]?.method || 'GET',
          duration: endTime - startTime,
          error: error.message
        };

        this.metrics.apiCalls.push(metric);
        this.sendMetrics('apiCall', metric);
        
        throw error;
      }
    };
  }

  monitorErrors() {
    // Monitor JavaScript errors
    window.addEventListener('error', (event) => {
      const metric = {
        timestamp: Date.now(),
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
        url: window.location.href
      };

      this.metrics.errors.push(metric);
      this.sendMetrics('error', metric);
    });

    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const metric = {
        timestamp: Date.now(),
        reason: event.reason,
        url: window.location.href
      };

      this.metrics.errors.push(metric);
      this.sendMetrics('error', metric);
    });
  }

  monitorUserInteractions() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const metric = {
        timestamp: Date.now(),
        type: 'click',
        target: event.target.tagName,
        className: event.target.className,
        id: event.target.id,
        url: window.location.href
      };

      this.metrics.userInteractions.push(metric);
      this.sendMetrics('interaction', metric);
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const metric = {
        timestamp: Date.now(),
        type: 'form_submit',
        formId: event.target.id,
        formAction: event.target.action,
        url: window.location.href
      };

      this.metrics.userInteractions.push(metric);
      this.sendMetrics('interaction', metric);
    });
  }

  monitorCoreWebVitals() {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        const metric = {
          timestamp: Date.now(),
          type: 'LCP',
          value: lastEntry.startTime,
          url: window.location.href
        };

        this.sendMetrics('webVital', metric);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const metric = {
            timestamp: Date.now(),
            type: 'FID',
            value: entry.processingStart - entry.startTime,
            url: window.location.href
          };

          this.sendMetrics('webVital', metric);
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        const metric = {
          timestamp: Date.now(),
          type: 'CLS',
          value: clsValue,
          url: window.location.href
        };

        this.sendMetrics('webVital', metric);
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  trackEvent(eventName, data = {}) {
    if (!this.isEnabled) return;

    const event = {
      timestamp: Date.now(),
      event: eventName,
      data,
      url: window.location.href
    };

    this.sendMetrics('customEvent', event);
  }

  trackPageView(pageName) {
    this.trackEvent('page_view', { page: pageName });
  }

  trackUserAction(action, details = {}) {
    this.trackEvent('user_action', { action, ...details });
  }

  async sendMetrics(type, data) {
    try {
      // Store metrics locally first
      this.storeMetric(type, data);

      // Send to server if online
      if (navigator.onLine) {
        await this.sendToServer(type, data);
      }
    } catch (error) {
      console.error('Error sending metrics:', error);
    }
  }

  storeMetric(type, data) {
    try {
      const stored = localStorage.getItem('performanceMetrics') || '[]';
      const metrics = JSON.parse(stored);
      metrics.push({ type, data, timestamp: Date.now() });
      
      // Keep only last 1000 metrics
      if (metrics.length > 1000) {
        metrics.splice(0, metrics.length - 1000);
      }
      
      localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
    } catch (error) {
      console.error('Error storing metric:', error);
    }
  }

  async sendToServer(type, data) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/analytics/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ type, data })
      });

      if (response.ok) {
        // Clear sent metrics from local storage
        this.clearSentMetrics();
      }
    } catch (error) {
      console.error('Error sending metrics to server:', error);
    }
  }

  clearSentMetrics() {
    try {
      localStorage.removeItem('performanceMetrics');
    } catch (error) {
      console.error('Error clearing metrics:', error);
    }
  }

  getMetrics() {
    return this.metrics;
  }

  enable() {
    this.isEnabled = true;
    localStorage.setItem('analyticsEnabled', 'true');
  }

  disable() {
    this.isEnabled = false;
    localStorage.setItem('analyticsEnabled', 'false');
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor; 