import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const result = this.authService.login(this.email, this.password);

      if (result.success && result.user) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = result.message;

        // Si necesita verificación, redirigimos
        if (result.user && !result.user.verified) {
          setTimeout(() => {
            this.router.navigate(['/verify']);
          }, 1500);
        }
      }

      this.loading = false;
    }, 800);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
