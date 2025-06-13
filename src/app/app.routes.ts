import { Routes } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { ReportagePageComponent } from './pages/reportage-page/reportage-page.component';
import { loginGuard } from './guards/login.guard';
import { AgroEchoPagesComponent } from './pages/agro-echo-pages/agro-echo-pages.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardPagesComponent } from './pages/dashboard-pages/dashboard-pages.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './guards/auth.guard';
import { CreatePublicationPagesComponent } from './pages/create-publication-pages/create-publication-pages.component';
import { CallbackComponent } from './callback/callback.component';
import { PublicationDetailComponent } from './pages/publication-details/publication-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HeroComponent,
  },
  {
    path: 'reportages',
    component: ReportagePageComponent,
  },
  {
    path: 'agro-echos',
    component: AgroEchoPagesComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'board',
    component: DashboardPagesComponent,
    canActivate: [authGuard], // Protégé : Seuls les connectés y accèdent
  },
  {
    path: 'create-publication',
    component: CreatePublicationPagesComponent,
    canActivate: [authGuard], // Protégé : Seuls les connectés y accèdent
  },
  {
    path: 'connexion',
    component: LoginPageComponent,
    canActivate: [loginGuard], // NOUVEAU : Protégé par le loginGuard
  },
  {
    path: 'apercu-publication',
    component: PublicationDetailComponent,
    canActivate: [authGuard], // Important: seul un utilisateur connecté peut prévisualiser
  },
  {
    path: 'auth/callback',
    component: CallbackComponent,
  },
  { path: 'reportages/:id', component: PublicationDetailComponent },
  { path: 'agro-echos/:id', component: PublicationDetailComponent },
];
