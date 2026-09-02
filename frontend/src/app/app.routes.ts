import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'rooms', component: RoomsComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
