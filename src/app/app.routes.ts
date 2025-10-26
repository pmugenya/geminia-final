// src/app/app.routes.ts

import { Route } from "@angular/router";
import { initialDataResolver } from "app/app.resolvers";
import { AuthGuard } from "app/core/auth/guards/auth.guard";
import { NoAuthGuard } from "app/core/auth/guards/noAuth.guard";
import { LayoutComponent } from "app/layout/layout.component";

export const appRoutes: Route[] = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: "home"
	},
	{ path: "signed-in-redirect", pathMatch: "full", redirectTo: "dashboard" },

	// --- Public Admin Routes (No Auth Required) ---
	{
		path: "sign-up",
		component: LayoutComponent,
		data: {
			layout: "empty",
		},
		children: [
			// Dashboard route added here to match 'sign-up/dashboard'
			{
				path: 'dashboard',
				loadChildren: () => import('app/modules/auth/dashboard/dashboard.routes'),
			},
			{
				path: 'travel-quote',
				loadChildren: () => import('app/modules/auth/travel-quote/travel-quote.routes'),
			},
			{
				path: 'marine-quote',
				loadChildren: () => import('app/modules/auth/marine-cargo-quotation/marine-cargo-quotation.routes'),
			},
			{
				path: 'admin-test',
				loadComponent: () => import('app/test-admin.component').then(m => m.TestAdminComponent),
			},
			{
				path: 'admin-dashboard',
				loadChildren: () => import('app/modules/admin/public-admin.routes').then(m => m.publicAdminRoutes),
			},
		]
	},

	// --- Auth routes for GUESTS ---
	{
		path: "",
		canActivate: [NoAuthGuard],
		canActivateChild: [NoAuthGuard],
		component: LayoutComponent,
		data: {
			layout: "empty",
		},
		children: [
			{
				path: "confirmation-required",
				loadChildren: () => import("app/modules/auth/confirmation-required/confirmation-required.routes"),
			},
			{
				path: "forgot-password",
				loadChildren: () => import("app/modules/auth/forgot-password/forgot-password.routes"),
			},
			{
				path: "reset-password",
				loadChildren: () => import("app/modules/auth/reset-password/reset-password.routes"),
			},
			{
				path: "home",
				loadChildren: () => import("app/modules/auth/sign-in/sign-in.routes"),
			},
			{
				path: "sign-in",
				loadChildren: () => import("app/modules/auth/sign-in/sign-in.routes"),
			},
		],
	},

	// --- Routes for AUTHENTICATED USERS ---
	{
		path: "",
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		component: LayoutComponent,
		data: {
			layout: "empty",
		},
		children: [
            {
                path: 'dashboard',
                loadChildren: () => import('app/modules/auth/dashboard/dashboard.routes'),
            },
			{
				path: "sign-out",
				loadChildren: () => import("app/modules/auth/sign-out/sign-out.routes"),
			},
			{
				path: "unlock-session",
				loadChildren: () => import("app/modules/auth/unlock-session/unlock-session.routes"),
			},
            {
                path: 'travel-quote',
                loadChildren: () => import('app/modules/auth/travel-quote/travel-quote.routes'),
            },
            {
                path: 'marine-quote', // This will correctly match '/sign-up/marine-quote'
                loadChildren: () => import('app/modules/auth/marine-cargo-quotation/marine-cargo-quotation.routes'),
            },
		],
	},

	// --- Admin routes ---
	{
		path: "admin",
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		resolve: {
			initialData: initialDataResolver,
		},
		loadChildren: () => import("app/modules/admin/admin.routes").then(m => m.adminRoutes),
	},
];
