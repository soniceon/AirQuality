interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0
  };

  private constructor() {
    this.initObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initObservers() {
    // 观察 FCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        this.metrics.fcp = entries[0].startTime;
        this.logMetric('FCP', this.metrics.fcp);
      }
    }).observe({ entryTypes: ['paint'] });

    // 观察 LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.logMetric('LCP', this.metrics.lcp);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // 观察 FID
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        this.metrics.fid = entries[0].duration;
        this.logMetric('FID', this.metrics.fid);
      }
    }).observe({ entryTypes: ['first-input'] });

    // 观察 CLS
    new PerformanceObserver((entryList) => {
      let clsValue = 0;
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      this.metrics.cls = clsValue;
      this.logMetric('CLS', this.metrics.cls);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private logMetric(name: string, value: number) {
    console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    // 这里可以添加数据上报逻辑
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public logError(error: Error) {
    console.error('Performance Error:', error);
    // 这里可以添加错误上报逻辑
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance(); 