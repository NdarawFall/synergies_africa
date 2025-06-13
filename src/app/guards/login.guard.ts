// src/app/guards/login.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    // 1. On regarde si l'utilisateur est connecté
    map((user) => !!user),
    tap((isLoggedIn) => {
      // 2. Si l'utilisateur EST DÉJÀ connecté...
      if (isLoggedIn) {
        console.log(
          'Accès à la page de connexion refusé - déjà connecté. Redirection vers le tableau de bord.'
        );
        // ... on le redirige vers le tableau de bord.
        router.navigate(['/board']);
      }
    }),
    // 3. On inverse la logique pour le CanActivate
    // Le guard doit retourner 'true' (autoriser l'accès) si l'utilisateur N'EST PAS connecté.
    map((isLoggedIn) => !isLoggedIn)
  );
};
