import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  code: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  resending: boolean = false;

  user: User | null = null;
  verificationMethod: 'email' | 'whatsapp' = 'email';
  contactInfo: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const pendingData = localStorage.getItem('pending_verification');
    
    if (!pendingData) {
      this.router.navigate(['/register']);
      return;
    }

    const { user } = JSON.parse(pendingData);
    this.user = user;

    // Determinar método de verificación
    if (user.phone) {
      this.verificationMethod = 'whatsapp';
      this.contactInfo = user.phone;
    } else {
      this.verificationMethod = 'email';
      this.contactInfo = user.email;
    }
  }

  onVerify(): void {
    if (!this.code || this.code.length < 4) {
      this.errorMessage = 'Ingresa el código de verificación';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const result = this.authService.verifyAccount(this.code);

      if (result.success) {
        this.successMessage = result.message;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1200);
      } else {
        this.errorMessage = result.message;
      }

      this.loading = false;
    }, 700);
  }

  resendCode(): void {
    this.resending = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      const result = this.authService.resendVerificationCode(this.verificationMethod);

      if (result.success) {
        this.successMessage = result.message + ' (Demo: usa el código 123456)';
      } else {
        this.errorMessage = result.message;
      }

      this.resending = false;
    }, 600);
  }

  goBack(): void {
    localStorage.removeItem('pending_verification');
    this.router.navigate(['/register']);
  }

  // Permite solo números en el input
  onCodeInput(event: any): void {
    this.code = event.target.value.replace(/[^0-9]/g, '');
  }
}
