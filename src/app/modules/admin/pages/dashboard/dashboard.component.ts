import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { ChartComponent } from '../../components/chart/chart.component';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [CommonModule, ChartComponent]
})
export class DashboardComponent implements OnInit {
    metrics = {
        totalUsers: 0,
        totalQuotes: 0,
        totalPremiums: 0,
        totalTransactions: 0,
        activeUsers: 0,
        pendingTransactions: 0
    };

    trafficData: any[] = [];
    salesData: any[] = [];
    productData: any[] = [];
    recentTransactions: any[] = [];
    isLoading = true;

    constructor(
        private adminService: AdminService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.isLoading = true;
        
        // Check if this is a local admin session
        if (this.authService.isAdmin()) {
            console.log('🔧 Admin session detected - using mock data for dashboard');
            this.loadMockData();
            this.isLoading = false;
            return;
        }
        
        // Load dashboard metrics for regular authenticated users
        this.adminService.getDashboardMetrics().subscribe({
            next: (data) => {
                this.metrics = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading dashboard metrics:', err);
                this.isLoading = false;
                // Use mock data for demonstration
                this.loadMockData();
            }
        });

        // Load traffic data
        this.adminService.getWebsiteTraffic().subscribe({
            next: (data) => {
                this.trafficData = data;
            },
            error: (err) => {
                console.error('Error loading traffic data:', err);
            }
        });

        // Load sales analytics
        this.adminService.getSalesAnalytics('month').subscribe({
            next: (data) => {
                this.salesData = data;
            },
            error: (err) => {
                console.error('Error loading sales data:', err);
            }
        });

        // Load product analytics
        this.adminService.getProductAnalytics().subscribe({
            next: (data) => {
                this.productData = data;
            },
            error: (err) => {
                console.error('Error loading product data:', err);
            }
        });

        // Load recent transactions
        this.adminService.getAllTransactions(0, 5).subscribe({
            next: (data) => {
                this.recentTransactions = data.pageItems || [];
            },
            error: (err) => {
                console.error('Error loading transactions:', err);
            }
        });
    }

    loadMockData(): void {
        // Enhanced mock data for admin dashboard demonstration
        console.log('📊 Loading mock admin dashboard data...');
        
        this.metrics = {
            totalUsers: 1247,
            totalQuotes: 3856,
            totalPremiums: 12500000,
            totalTransactions: 2341,
            activeUsers: 892,
            pendingTransactions: 45
        };

        this.recentTransactions = [
            { id: 1, user: 'John Doe', amount: 45000, product: 'Marine Cargo', status: 'Completed', date: '2025-10-07' },
            { id: 2, user: 'Jane Smith', amount: 12000, product: 'Travel Insurance', status: 'Pending', date: '2025-10-07' },
            { id: 3, user: 'Bob Johnson', amount: 78000, product: 'Marine Cargo', status: 'Completed', date: '2025-10-06' },
            { id: 4, user: 'Alice Brown', amount: 23000, product: 'Travel Insurance', status: 'Completed', date: '2025-10-06' },
            { id: 5, user: 'Charlie Wilson', amount: 56000, product: 'Marine Cargo', status: 'Failed', date: '2025-10-05' }
        ];

        // Mock traffic data
        this.trafficData = [
            { date: '2025-10-01', visitors: 1200, pageViews: 3400 },
            { date: '2025-10-02', visitors: 1350, pageViews: 3800 },
            { date: '2025-10-03', visitors: 1100, pageViews: 3200 },
            { date: '2025-10-04', visitors: 1450, pageViews: 4100 },
            { date: '2025-10-05', visitors: 1600, pageViews: 4500 }
        ];

        // Mock sales data
        this.salesData = [
            { month: 'Jan', sales: 45000, quotes: 120 },
            { month: 'Feb', sales: 52000, quotes: 145 },
            { month: 'Mar', sales: 48000, quotes: 135 },
            { month: 'Apr', sales: 61000, quotes: 167 },
            { month: 'May', sales: 58000, quotes: 156 }
        ];

        // Mock product data
        this.productData = [
            { name: 'Marine Cargo Insurance', sales: 156000, percentage: 45 },
            { name: 'Travel Insurance', sales: 89000, percentage: 25 },
            { name: 'Motor Insurance', sales: 67000, percentage: 19 },
            { name: 'Property Insurance', sales: 34000, percentage: 11 }
        ];

        console.log('✅ Mock data loaded successfully for admin dashboard');
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
}
