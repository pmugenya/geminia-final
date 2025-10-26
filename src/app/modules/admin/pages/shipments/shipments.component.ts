import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-shipments',
    templateUrl: './shipments.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ShipmentsComponent implements OnInit {
    highRiskShipments: any[] = [];
    exportCoverRequests: any[] = [];
    isLoadingHighRisk = true;
    isLoadingExport = true;
    errorHighRisk: string | null = null;
    errorExport: string | null = null;
    activeTab = 'high-risk';

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.loadHighRiskShipments();
        this.loadExportCoverRequests();
    }

    loadHighRiskShipments(): void {
        this.isLoadingHighRisk = true;
        this.errorHighRisk = null;
        
        // Check if this is an admin session - use mock data for faster loading
        if (this.isAdminSession()) {
            console.log('🔧 Admin session detected - using mock data for high risk shipments');
            setTimeout(() => {
                this.loadMockHighRiskShipments();
                this.isLoadingHighRisk = false;
            }, 300); // Fast loading simulation
            return;
        }
        
        this.adminService.getHighRiskShipments(0, 20).subscribe({
            next: (data) => {
                this.highRiskShipments = data.pageItems || [];
                this.isLoadingHighRisk = false;
                this.errorHighRisk = null;
            },
            error: (err) => {
                console.error('Error loading high risk shipments:', err);
                this.errorHighRisk = 'Failed to load high risk shipments. Please try again.';
                this.isLoadingHighRisk = false;
            }
        });
    }

    loadExportCoverRequests(): void {
        this.isLoadingExport = true;
        this.errorExport = null;
        
        // Check if this is an admin session - use mock data for faster loading
        if (this.isAdminSession()) {
            console.log('🔧 Admin session detected - using mock data for export cover requests');
            setTimeout(() => {
                this.loadMockExportRequests();
                this.isLoadingExport = false;
            }, 300); // Fast loading simulation
            return;
        }
        
        this.adminService.getExportCoverRequests(0, 20).subscribe({
            next: (data) => {
                this.exportCoverRequests = data.pageItems || [];
                this.isLoadingExport = false;
                this.errorExport = null;
            },
            error: (err) => {
                console.error('Error loading export cover requests:', err);
                this.errorExport = 'Failed to load export cover requests. Please try again.';
                this.isLoadingExport = false;
            }
        });
    }

    retryLoadHighRisk(): void {
        this.loadHighRiskShipments();
    }

    retryLoadExport(): void {
        this.loadExportCoverRequests();
    }

    private isAdminSession(): boolean {
        return sessionStorage.getItem('isAdmin') === 'true';
    }

    loadMockHighRiskShipments(): void {
        this.highRiskShipments = [
            { id: 1, refNo: 'HRS-001', user: 'John Doe', origin: 'China', destination: 'Mombasa', cargoType: 'Electronics', value: 5000000, riskLevel: 'High', status: 'Under Review', date: '2025-10-07' },
            { id: 2, refNo: 'HRS-002', user: 'Jane Smith', origin: 'India', destination: 'Nairobi', cargoType: 'Chemicals', value: 3500000, riskLevel: 'Critical', status: 'Pending', date: '2025-10-06' },
            { id: 3, refNo: 'HRS-003', user: 'Bob Johnson', origin: 'UAE', destination: 'Mombasa', cargoType: 'Machinery', value: 8000000, riskLevel: 'High', status: 'Approved', date: '2025-10-05' }
        ];
    }

    loadMockExportRequests(): void {
        this.exportCoverRequests = [
            { id: 1, refNo: 'EXP-001', user: 'Alice Brown', origin: 'Nairobi', destination: 'UK', cargoType: 'Tea', value: 2000000, status: 'Pending', date: '2025-10-07' },
            { id: 2, refNo: 'EXP-002', user: 'Charlie Wilson', origin: 'Mombasa', destination: 'USA', cargoType: 'Coffee', value: 4500000, status: 'Approved', date: '2025-10-06' },
            { id: 3, refNo: 'EXP-003', user: 'David Lee', origin: 'Nairobi', destination: 'Germany', cargoType: 'Flowers', value: 1500000, status: 'Under Review', date: '2025-10-05' }
        ];
    }

    switchTab(tab: string): void {
        this.activeTab = tab;
    }

    getRiskLevelClass(level: string): string {
        switch (level.toLowerCase()) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'under review':
                return 'bg-blue-100 text-blue-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    updateShipmentStatus(shipmentId: number, status: string): void {
        this.adminService.updateShipmentRiskStatus(shipmentId, status).subscribe({
            next: () => {
                this.loadHighRiskShipments();
            },
            error: (err) => {
                console.error('Error updating shipment status:', err);
            }
        });
    }

    updateExportStatus(requestId: number, status: string): void {
        this.adminService.updateExportCoverStatus(requestId, status).subscribe({
            next: () => {
                this.loadExportCoverRequests();
            },
            error: (err) => {
                console.error('Error updating export status:', err);
            }
        });
    }
}
