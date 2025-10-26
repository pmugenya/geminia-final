import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    // Dashboard Metrics
    getDashboardMetrics(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/admin/dashboard/metrics`);
    }

    getWebsiteTraffic(startDate?: string, endDate?: string): Observable<any> {
        let params = new HttpParams();
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);
        return this.http.get<any>(`${this.baseUrl}/admin/traffic`, { params });
    }

    // User Management
    getAllUsers(offset: number, limit: number, search?: string): Observable<any> {
        let params = new HttpParams()
            .set('offset', offset.toString())
            .set('limit', limit.toString());
        if (search) params = params.set('search', search);
        return this.http.get<any>(`${this.baseUrl}/admin/users`, { params });
    }

    createUser(userData: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/admin/users`, userData);
    }

    updateUser(userId: number, userData: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/admin/users/${userId}`, userData);
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/admin/users/${userId}`);
    }

    getUserCredentials(userId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/admin/users/${userId}/credentials`);
    }

    // Quote Users
    getQuoteUsers(offset: number, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('offset', offset.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(`${this.baseUrl}/admin/quote-users`, { params });
    }

    // Premium Buyers
    getPremiumBuyers(offset: number, limit: number, productType?: string): Observable<any> {
        let params = new HttpParams()
            .set('offset', offset.toString())
            .set('limit', limit.toString());
        if (productType) params = params.set('productType', productType);
        return this.http.get<any>(`${this.baseUrl}/admin/premium-buyers`, { params });
    }

    // Transactions
    getAllTransactions(offset: number, limit: number, status?: string): Observable<any> {
        let params = new HttpParams()
            .set('offset', offset.toString())
            .set('limit', limit.toString());
        if (status) params = params.set('status', status);
        return this.http.get<any>(`${this.baseUrl}/admin/transactions`, { params });
    }

    getTransactionDetails(transactionId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/admin/transactions/${transactionId}`);
    }

    // High Risk Shipments
    getHighRiskShipments(offset: number, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('offset', offset.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(`${this.baseUrl}/admin/high-risk-shipments`, { params });
    }

    updateShipmentRiskStatus(shipmentId: number, status: string, notes?: string): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/admin/high-risk-shipments/${shipmentId}`, { status, notes });
    }

    // Export Shipment Cover Requests
    getExportCoverRequests(offset: number, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('offset', offset.toString())
            .set('limit', limit.toString());
        return this.http.get<any>(`${this.baseUrl}/admin/export-cover-requests`, { params });
    }

    updateExportCoverStatus(requestId: number, status: string, notes?: string): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/admin/export-cover-requests/${requestId}`, { status, notes });
    }

    // Analytics
    getSalesAnalytics(period: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/admin/analytics/sales?period=${period}`);
    }

    getProductAnalytics(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/admin/analytics/products`);
    }
}
