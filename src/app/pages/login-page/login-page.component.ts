import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  constructor(private router: Router) {}

  // Redirige simplement vers Supabase OAuth
  loginWithGoogle(): void {
    const supabaseUrl = 'https://gxtymvfvcbvatlfyflow.supabase.co/auth/v1/authorize?provider=google';
    window.location.href = supabaseUrl;
  }
}