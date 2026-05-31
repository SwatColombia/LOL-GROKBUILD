import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone: string = '';

  verificationMethod: 'email' | 'whatsapp' = 'email';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';

    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Por favor completa los campos obligatorios';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;

    setTimeout(() => {
      const result = this.authService.register(
        this.username,
        this.email,
        this.password,
        this.phone
      );

      if (result.success) {
        // Redirigir a verificación
        this.router.navigate(['/verify']);
      } else {
        this.errorMessage = result.message;
      }

      this.loading = false;
    }, 900);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
