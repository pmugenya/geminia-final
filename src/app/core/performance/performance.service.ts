import { Injectable } from '@angular/core';
import { ConfigService } from '../services/config.service';

export interface PerformanceMetric {
    name: string;
    value: number;
    timestamp: number;
    type: 'navigation' | 'resource' | 'measure' | 'mark';
}

export interface PageLoadMetrics {
    dns: number;
    tcp: number;
    request: number;
    response: number;
    dom: number;
    load: number;
    total: number;
}

/**
 * Performance monitoring service
 * Tracks and reports application performance metrics
 */
@Injectable({
    providedIn: 'root'
})
export class PerformanceService {
    private metrics: PerformanceMetric[] = [];
    private readonly maxMetrics = 100;

    constructor(private configService: ConfigService) {
        this.initializePerformanceObserver();
    }

    /**
     * Initialize Performance Observer API
     */
    private initializePerformanceObserver(): void {
        if (!this.isPerformanceSupported()) {
            return;
        }

        try {
            // Observe navigation timing
            const navObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric({
                        name: entry.name,
                        value: entry.duration,
                        timestamp: entry.startTime,
                        type: 'navigation'
                    });
                }
            });
            navObserver.observe({ entryTypes: ['navigation'] });

            // Observe resource timing
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric({
                        name: entry.name,
                        value: entry.duration,
                        timestamp: entry.startTime,
                        type: 'resource'
                    });
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });

            // Observe custom measures
            const measureObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric({
                        name: entry.name,
                        value: entry.duration,
                        timestamp: entry.startTime,
                        type: 'measure'
                    });
                }
            });
            measureObserver.observe({ entryTypes: ['measure'] });
        } catch (error) {
            console.error('Failed to initialize Performance Observer:', error);
        }
    }

    /**
     * Check if Performance API is supported
     */
    private isPerformanceSupported(): boolean {
        return typeof window !== 'undefined' && 
               'performance' in window && 
               'PerformanceObserver' in window;
    }

    /**
     * Record a performance metric
     */
    private recordMetric(metric: PerformanceMetric): void {
        this.metrics.push(metric);
        
        // Keep only the last N metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }

        // Log in development mode
        if (this.configService.isDebugEnabled()) {
            console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms`);
        }
    }

    /**
     * Measure page load performance
     */
    measurePageLoad(): PageLoadMetrics | null {
        if (!this.isPerformanceSupported()) {
            return null;
        }

        const perfData = performance.timing;
        const navigationStart = perfData.navigationStart;

        return {
            dns: perfData.domainLookupEnd - perfData.domainLookupStart,
            tcp: perfData.connectEnd - perfData.connectStart,
            request: perfData.responseStart - perfData.requestStart,
            response: perfData.responseEnd - perfData.responseStart,
            dom: perfData.domComplete - perfData.domLoading,
            load: perfData.loadEventEnd - perfData.loadEventStart,
            total: perfData.loadEventEnd - navigationStart
        };
    }

    /**
     * Start measuring a custom operation
     */
    startMeasure(name: string): void {
        if (!this.isPerformanceSupported()) {
            return;
        }

        performance.mark(`${name}-start`);
    }

    /**
     * End measuring a custom operation
     */
    endMeasure(name: string): number | null {
        if (!this.isPerformanceSupported()) {
            return null;
        }

        try {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
            
            const measures = performance.getEntriesByName(name, 'measure');
            if (measures.length > 0) {
                const duration = measures[measures.length - 1].duration;
                
                // Clean up marks
                performance.clearMarks(`${name}-start`);
                performance.clearMarks(`${name}-end`);
                performance.clearMeasures(name);
                
                return duration;
            }
        } catch (error) {
            console.error(`Failed to measure ${name}:`, error);
        }

        return null;
    }

    /**
     * Measure component render time
     */
    measureComponentRender(componentName: string, callback: () => void): void {
        this.startMeasure(`${componentName}-render`);
        callback();
        const duration = this.endMeasure(`${componentName}-render`);
        
        if (duration !== null && this.configService.isDebugEnabled()) {
            console.log(`[Component Render] ${componentName}: ${duration.toFixed(2)}ms`);
        }
    }

    /**
     * Measure API call performance
     */
    async measureApiCall<T>(name: string, apiCall: Promise<T>): Promise<T> {
        this.startMeasure(`api-${name}`);
        try {
            const result = await apiCall;
            const duration = this.endMeasure(`api-${name}`);
            
            if (duration !== null && this.configService.isDebugEnabled()) {
                console.log(`[API Call] ${name}: ${duration.toFixed(2)}ms`);
            }
            
            return result;
        } catch (error) {
            this.endMeasure(`api-${name}`);
            throw error;
        }
    }

    /**
     * Get all recorded metrics
     */
    getMetrics(): PerformanceMetric[] {
        return [...this.metrics];
    }

    /**
     * Get metrics by type
     */
    getMetricsByType(type: PerformanceMetric['type']): PerformanceMetric[] {
        return this.metrics.filter(m => m.type === type);
    }

    /**
     * Get average metric value by name
     */
    getAverageMetric(name: string): number | null {
        const filtered = this.metrics.filter(m => m.name === name);
        if (filtered.length === 0) {
            return null;
        }
        
        const sum = filtered.reduce((acc, m) => acc + m.value, 0);
        return sum / filtered.length;
    }

    /**
     * Clear all metrics
     */
    clearMetrics(): void {
        this.metrics = [];
        if (this.isPerformanceSupported()) {
            performance.clearMarks();
            performance.clearMeasures();
        }
    }

    /**
     * Get First Contentful Paint (FCP)
     */
    getFirstContentfulPaint(): number | null {
        if (!this.isPerformanceSupported()) {
            return null;
        }

        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    /**
     * Get Largest Contentful Paint (LCP)
     */
    getLargestContentfulPaint(): Promise<number | null> {
        return new Promise((resolve) => {
            if (!this.isPerformanceSupported()) {
                resolve(null);
                return;
            }

            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.startTime);
                    observer.disconnect();
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });

                // Timeout after 10 seconds
                setTimeout(() => {
                    observer.disconnect();
                    resolve(null);
                }, 10000);
            } catch {
                resolve(null);
            }
        });
    }

    /**
     * Get Time to Interactive (TTI) estimate
     */
    getTimeToInteractive(): number | null {
        if (!this.isPerformanceSupported()) {
            return null;
        }

        const perfData = performance.timing;
        return perfData.domInteractive - perfData.navigationStart;
    }

    /**
     * Get memory usage (if available)
     */
    getMemoryUsage(): { used: number; total: number; limit: number } | null {
        if ('memory' in performance) {
            const memory = (performance as any).memory;
            return {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    /**
     * Generate performance report
     */
    generateReport(): {
        pageLoad: PageLoadMetrics | null;
        fcp: number | null;
        tti: number | null;
        memory: { used: number; total: number; limit: number } | null;
        metrics: PerformanceMetric[];
    } {
        return {
            pageLoad: this.measurePageLoad(),
            fcp: this.getFirstContentfulPaint(),
            tti: this.getTimeToInteractive(),
            memory: this.getMemoryUsage(),
            metrics: this.getMetrics()
        };
    }

    /**
     * Log performance report to console
     */
    logReport(): void {
        const report = this.generateReport();
        
        console.group('📊 Performance Report');
        
        if (report.pageLoad) {
            console.group('Page Load Metrics');
            console.log(`DNS: ${report.pageLoad.dns}ms`);
            console.log(`TCP: ${report.pageLoad.tcp}ms`);
            console.log(`Request: ${report.pageLoad.request}ms`);
            console.log(`Response: ${report.pageLoad.response}ms`);
            console.log(`DOM: ${report.pageLoad.dom}ms`);
            console.log(`Load: ${report.pageLoad.load}ms`);
            console.log(`Total: ${report.pageLoad.total}ms`);
            console.groupEnd();
        }
        
        if (report.fcp) {
            console.log(`First Contentful Paint: ${report.fcp.toFixed(2)}ms`);
        }
        
        if (report.tti) {
            console.log(`Time to Interactive: ${report.tti.toFixed(2)}ms`);
        }
        
        if (report.memory) {
            console.group('Memory Usage');
            console.log(`Used: ${(report.memory.used / 1048576).toFixed(2)} MB`);
            console.log(`Total: ${(report.memory.total / 1048576).toFixed(2)} MB`);
            console.log(`Limit: ${(report.memory.limit / 1048576).toFixed(2)} MB`);
            console.groupEnd();
        }
        
        console.groupEnd();
    }
}
