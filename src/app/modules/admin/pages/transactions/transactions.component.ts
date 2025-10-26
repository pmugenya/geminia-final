import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class TransactionsComponent implements OnInit {
    transactions: any[] = [];
    isLoading = true;
    error: string | null = null;
    filterStatus = '';
    currentPage = 0;
    pageSize = 20;
    totalTransactions = 0;

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.loadTransactions();
    }

    loadTransactions(): void {
        this.isLoading = true;
        this.error = null;
        
        // Check if this is an admin session - use mock data for faster loading
        if (this.isAdminSession()) {
            console.log('🔧 Admin session detected - using mock data for transactions');
            setTimeout(() => {
                this.loadMockTransactions();
                this.isLoading = false;
            }, 300); // Fast loading simulation
            return;
        }
        
        this.adminService.getAllTransactions(this.currentPage * this.pageSize, this.pageSize, this.filterStatus).subscribe({
            next: (data) => {
                this.transactions = data.pageItems || [];
                this.totalTransactions = data.totalElements || 0;
                this.isLoading = false;
                this.error = null;
            },
            error: (err) => {
                console.error('Error loading transactions:', err);
                this.error = 'Failed to load transactions. Please try again.';
                this.isLoading = false;
            }
        });
    }

    retryLoad(): void {
        this.loadTransactions();
    }

    private isAdminSession(): boolean {
        return sessionStorage.getItem('isAdmin') === 'true';
    }

    loadMockTransactions(): void {
        this.transactions = [
            { id: 1, refNo: 'TXN-001', user: 'John Doe', email: 'john@example.com', product: 'Marine Cargo', amount: 45000, status: 'Completed', paymentMethod: 'M-Pesa', date: '2025-10-07 14:30' },
            { id: 2, refNo: 'TXN-002', user: 'Jane Smith', email: 'jane@example.com', product: 'Travel Insurance', amount: 12000, status: 'Pending', paymentMethod: 'M-Pesa', date: '2025-10-07 13:15' },
            { id: 3, refNo: 'TXN-003', user: 'Bob Johnson', email: 'bob@example.com', product: 'Marine Cargo', amount: 78000, status: 'Completed', paymentMethod: 'M-Pesa', date: '2025-10-06 16:45' },
            { id: 4, refNo: 'TXN-004', user: 'Alice Brown', email: 'alice@example.com', product: 'Travel Insurance', amount: 23000, status: 'Completed', paymentMethod: 'M-Pesa', date: '2025-10-06 11:20' },
            { id: 5, refNo: 'TXN-005', user: 'Charlie Wilson', email: 'charlie@example.com', product: 'Marine Cargo', amount: 56000, status: 'Failed', paymentMethod: 'M-Pesa', date: '2025-10-05 09:30' },
            { id: 6, refNo: 'TXN-006', user: 'David Lee', email: 'david@example.com', product: 'Travel Insurance', amount: 18000, status: 'Completed', paymentMethod: 'M-Pesa', date: '2025-10-05 15:10' },
            { id: 7, refNo: 'TXN-007', user: 'Emma Davis', email: 'emma@example.com', product: 'Marine Cargo', amount: 92000, status: 'Pending', paymentMethod: 'M-Pesa', date: '2025-10-04 12:00' },
            { id: 8, refNo: 'TXN-008', user: 'Frank Miller', email: 'frank@example.com', product: 'Travel Insurance', amount: 15000, status: 'Completed', paymentMethod: 'M-Pesa', date: '2025-10-04 10:45' }
        ];
        this.totalTransactions = this.transactions.length;
    }

    onFilterChange(): void {
        this.currentPage = 0;
        this.loadTransactions();
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

    viewTransaction(transactionId: number): void {
        console.log('View transaction:', transactionId);
        // Navigate to transaction details or open modal
    }
}
