import { Routes } from '@angular/router';

export enum RouteNames {
  DASHBOARD = 'dashboard',
  VEHICLES = 'vehicles',
}

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => '/dashboard',
  },
  {
    path: RouteNames.DASHBOARD,
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: RouteNames.VEHICLES,
    loadComponent: () =>
      import('./features/vehicles/vehicles.component').then((m) => m.VehiclesComponent),
  },
];
