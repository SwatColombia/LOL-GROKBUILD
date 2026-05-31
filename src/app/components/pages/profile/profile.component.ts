import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  selectedRegion: any = null;
  editingUsername: boolean = false;
  newUsername: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.newUsername = this.user.username;
    this.selectedRegion = this.authService.getSelectedRegion();
  }

  startEditingUsername(): void {
    this.editingUsername = true;
  }

  saveUsername(): void {
    if (!this.user || !this.newUsername.trim()) return;

    const result = this.authService.updateUser({
      username: this.newUsername.trim()
    });

    if (result.success && result.user) {
      this.user = result.user;
      this.editingUsername = false;
    }
  }

  cancelEditingUsername(): void {
    if (this.user) {
      this.newUsername = this.user.username;
    }
    this.editingUsername = false;
  }

  goToRegions(): void {
    this.router.navigate(['/regions']);
  }

  changeRegion(): void {
    this.router.navigate(['/regions']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
