import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLoginHelperComponent } from './components/admin-login-helper.component';

@Component({
    selector: 'app-test-admin',
    standalone: true,
    imports: [CommonModule, RouterModule, AdminLoginHelperComponent],
    template: `
        <div class="p-8">
            <h1 class="text-2xl font-bold text-green-600">🎉 Admin Routes Working!</h1>
            <p class="mt-4">Great! The public admin routes are accessible. Now you can test admin authentication.</p>
            
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <h2 class="font-semibold">Available Routes:</h2>
                <ul class="mt-2 space-y-2">
                    <li>✅ <a routerLink="/sign-up/admin-dashboard" class="text-blue-600 hover:underline">Public Admin Dashboard</a> - No auth required</li>
                    <li>🔐 <a routerLink="/admin" class="text-blue-600 hover:underline">Protected Admin Dashboard</a> - Requires login</li>
                    <li>🔑 <a routerLink="/sign-in" class="text-blue-600 hover:underline">Login Page</a> - Use admin credentials below</li>
                </ul>
            </div>

            <!-- Admin Login Helper -->
            <app-admin-login-helper></app-admin-login-helper>
            
            <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h2 class="font-semibold">🔧 How to Test Admin Login:</h2>
                <ol class="mt-2 space-y-1 list-decimal list-inside">
                    <li>Copy any admin credentials from the card above</li>
                    <li>Go to the <a routerLink="/sign-in" class="text-blue-600 hover:underline">Login Page</a></li>
                    <li>Enter the admin email and password</li>
                    <li>You'll be automatically redirected to <code>/admin</code> dashboard</li>
                </ol>
            </div>
        </div>
    `
})
export class TestAdminComponent {}
