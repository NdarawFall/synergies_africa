import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-callback',
  template: '<p>Connexion en cours...</p>'
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}

ngOnInit() {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');

  if (accessToken) {
    localStorage.setItem('access_token', accessToken);

    // Force la mise à jour de l'utilisateur dans le service
    this.authService.currentUser$.subscribe(() => {
      this.router.navigate(['/board']);
    });
  } else {
    this.router.navigate(['/connexion']);
  }
}
}