import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/layout.component';

console.log('🔓 Public Admin Routes Loaded - No Authentication Required');

export const publicAdminRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
            },
            {
                path: 'users',
                loadChildren: () => import('./pages/users/users.routes').then(m => m.usersRoutes)
            },
            {
                path: 'transactions',
                loadChildren: () => import('./pages/transactions/transactions.routes').then(m => m.transactionsRoutes)
            },
            {
                path: 'shipments',
                loadChildren: () => import('./pages/shipments/shipments.routes').then(m => m.shipmentsRoutes)
            },
            {
                path: 'quote-users',
                loadChildren: () => import('./pages/quote-users/quote-users.routes').then(m => m.quoteUsersRoutes)
            },
            {
                path: 'premium-buyers',
                loadChildren: () => import('./pages/premium-buyers/premium-buyers.routes').then(m => m.premiumBuyersRoutes)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
