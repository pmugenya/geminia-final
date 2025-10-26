import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from 'app/core/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './layout.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent]
})
export class AdminLayoutComponent implements OnInit {
    adminUser: any = null;
    isSidebarOpen = false;
    currentPageTitle = 'Admin Dashboard';

    private pageTitles: { [key: string]: string } = {
        '/admin/dashboard': 'Admin Dashboard',
        '/admin/users': 'User Management',
        '/admin/quote-users': 'Quote Users',
        '/admin/premium-buyers': 'Premium Buyers',
        '/admin/transactions': 'Transactions',
        '/admin/shipments': 'Shipment Management'
    };

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Get current admin user data
        this.adminUser = this.authService.getAdminUser();
        
        // Update page title based on current route
        this.updatePageTitle(this.router.url);
        
        // Listen for route changes
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.updatePageTitle(event.url);
        });
    }

    private updatePageTitle(url: string): void {
        this.currentPageTitle = this.pageTitles[url] || 'Admin Dashboard';
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout(): void {
        console.log('🚪 Admin logout initiated');
        this.authService.signOut();
        this.router.navigate(['/sign-in'], { replaceUrl: true });
    }
}
