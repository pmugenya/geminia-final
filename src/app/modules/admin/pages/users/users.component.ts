import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
    users: any[] = [];
    isLoading = true;
    error: string | null = null;
    searchTerm = '';
    currentPage = 0;
    pageSize = 10;
    totalUsers = 0;
    showCreateModal = false;

    newUser = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'user'
    };

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.isLoading = true;
        this.error = null;
        
        // Check if this is an admin session - use mock data for faster loading
        if (this.isAdminSession()) {
            console.log('🔧 Admin session detected - using mock data for users');
            setTimeout(() => {
                this.loadMockUsers();
                this.isLoading = false;
            }, 300); // Fast loading simulation
            return;
        }
        
        this.adminService.getAllUsers(this.currentPage * this.pageSize, this.pageSize, this.searchTerm).subscribe({
            next: (data) => {
                this.users = data.pageItems || [];
                this.totalUsers = data.totalElements || 0;
                this.isLoading = false;
                this.error = null;
            },
            error: (err) => {
                console.error('Error loading users:', err);
                this.error = 'Failed to load users. Please try again.';
                this.isLoading = false;
            }
        });
    }

    retryLoad(): void {
        this.loadUsers();
    }

    private isAdminSession(): boolean {
        return sessionStorage.getItem('isAdmin') === 'true';
    }

    loadMockUsers(): void {
        this.users = [
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '0712345678', role: 'user', status: 'Active', createdAt: '2025-01-15' },
            { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '0723456789', role: 'user', status: 'Active', createdAt: '2025-02-20' },
            { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '0734567890', role: 'admin', status: 'Active', createdAt: '2025-03-10' },
            { id: 4, firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', phone: '0745678901', role: 'user', status: 'Inactive', createdAt: '2025-04-05' },
            { id: 5, firstName: 'Charlie', lastName: 'Wilson', email: 'charlie@example.com', phone: '0756789012', role: 'user', status: 'Active', createdAt: '2025-05-12' }
        ];
        this.totalUsers = this.users.length;
    }

    onSearch(): void {
        this.currentPage = 0;
        this.loadUsers();
    }

    openCreateModal(): void {
        this.showCreateModal = true;
    }

    closeCreateModal(): void {
        this.showCreateModal = false;
        this.newUser = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'user'
        };
    }

    createUser(): void {
        this.adminService.createUser(this.newUser).subscribe({
            next: () => {
                this.closeCreateModal();
                this.loadUsers();
            },
            error: (err) => {
                console.error('Error creating user:', err);
            }
        });
    }

    deleteUser(userId: number): void {
        if (confirm('Are you sure you want to delete this user?')) {
            this.adminService.deleteUser(userId).subscribe({
                next: () => {
                    this.loadUsers();
                },
                error: (err) => {
                    console.error('Error deleting user:', err);
                }
            });
        }
    }

    getStatusClass(status: string): string {
        return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }

    getRoleClass(role: string): string {
        return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    }
}
