import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-quote-users',
    templateUrl: './quote-users.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class QuoteUsersComponent implements OnInit {
    quoteUsers: any[] = [];
    isLoading = true;
    error: string | null = null;
    currentPage = 0;
    pageSize = 20;

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.loadQuoteUsers();
    }

    loadQuoteUsers(): void {
        this.isLoading = true;
        this.error = null;
        
        // Check if this is an admin session - use mock data for faster loading
        if (this.isAdminSession()) {
            console.log('🔧 Admin session detected - using mock data for quote users');
            setTimeout(() => {
                this.loadMockQuoteUsers();
                this.isLoading = false;
            }, 300); // Fast loading simulation
            return;
        }
        
        this.adminService.getQuoteUsers(this.currentPage * this.pageSize, this.pageSize).subscribe({
            next: (data) => {
                this.quoteUsers = data.pageItems || [];
                this.isLoading = false;
                this.error = null;
            },
            error: (err) => {
                console.error('Error loading quote users:', err);
                this.error = 'Failed to load quote users. Please try again.';
                this.isLoading = false;
            }
        });
    }

    retryLoad(): void {
        this.loadQuoteUsers();
    }

    private isAdminSession(): boolean {
        return sessionStorage.getItem('isAdmin') === 'true';
    }

    loadMockQuoteUsers(): void {
        this.quoteUsers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', phone: '0712345678', quoteType: 'Marine Cargo', quoteRef: 'QT-001', sumInsured: 5000000, status: 'Draft', createdAt: '2025-10-07 14:30' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0723456789', quoteType: 'Travel Insurance', quoteRef: 'QT-002', sumInsured: 150000, status: 'Submitted', createdAt: '2025-10-07 13:15' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '0734567890', quoteType: 'Marine Cargo', quoteRef: 'QT-003', sumInsured: 8000000, status: 'Paid', createdAt: '2025-10-06 16:45' },
            { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '0745678901', quoteType: 'Travel Insurance', quoteRef: 'QT-004', sumInsured: 200000, status: 'Draft', createdAt: '2025-10-06 11:20' },
            { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '0756789012', quoteType: 'Marine Cargo', quoteRef: 'QT-005', sumInsured: 3500000, status: 'Submitted', createdAt: '2025-10-05 09:30' }
        ];
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    viewCredentials(userId: number): void {
        this.adminService.getUserCredentials(userId).subscribe({
            next: (credentials) => {
                console.log('User credentials:', credentials);
                // Show credentials in modal or alert
                alert(`User Credentials:\n${JSON.stringify(credentials, null, 2)}`);
            },
            error: (err) => {
                console.error('Error fetching credentials:', err);
            }
        });
    }
}
