import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private readonly USER_KEY = 'lol_user';
  private readonly TOKEN_KEY = 'lol_token';

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
    }
  }

  // Simula registro
  register(username: string, email: string, password: string, phone?: string): { success: boolean; message: string; user?: User } {
    // Validación básica
    if (!username || !email || !password) {
      return { success: false, message: 'Todos los campos son obligatorios' };
    }

    // Simulamos que el email ya existe
    const existingUsers = this.getStoredUsers();
    if (existingUsers.find(u => u.email === email)) {
      return { success: false, message: 'Este correo ya está registrado' };
    }

    const newUser: User = {
      id: this.generateId(),
      username,
      email,
      phone: phone || undefined,
      verified: false,
      createdAt: new Date().toISOString()
    };

    // Guardamos el usuario (sin contraseña real por seguridad en demo)
    existingUsers.push(newUser);
    localStorage.setItem('lol_users', JSON.stringify(existingUsers));

    // Guardamos temporalmente los datos para verificación
    localStorage.setItem('pending_verification', JSON.stringify({
      user: newUser,
      password // En real nunca haríamos esto
    }));

    return {
      success: true,
      message: 'Registro exitoso. Por favor verifica tu cuenta.',
      user: newUser
    };
  }

  // Simula login
  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (!user.verified) {
      // Guardamos para redirigir a verificación
      localStorage.setItem('pending_verification', JSON.stringify({ user }));
      return {
        success: false,
        message: 'Tu cuenta no está verificada. Redirigiendo a verificación...',
        user
      };
    }

    // Login exitoso
    this.setCurrentUser(user);
    return { success: true, message: 'Inicio de sesión exitoso', user };
  }

  // Simula verificación de cuenta (Email o WhatsApp)
  verifyAccount(code: string): { success: boolean; message: string } {
    const pendingData = localStorage.getItem('pending_verification');
    if (!pendingData) {
      return { success: false, message: 'No hay proceso de verificación pendiente' };
    }

    const { user } = JSON.parse(pendingData);

    // Código de verificación simulado (en producción sería real)
    // Aceptamos "123456" o cualquier código que empiece con 1 para demo
    if (code === '123456' || code.startsWith('1')) {
      // Marcar como verificado
      const users = this.getStoredUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].verified = true;
        localStorage.setItem('lol_users', JSON.stringify(users));

        // Iniciar sesión automáticamente
        this.setCurrentUser(users[userIndex]);
        localStorage.removeItem('pending_verification');

        return { success: true, message: '¡Cuenta verificada exitosamente!' };
      }
    }

    return { success: false, message: 'Código de verificación inválido' };
  }

  // Reenviar código de verificación (simulado)
  resendVerificationCode(method: 'email' | 'whatsapp'): { success: boolean; message: string } {
    const pendingData = localStorage.getItem('pending_verification');
    if (!pendingData) {
      return { success: false, message: 'No hay verificación pendiente' };
    }

    const { user } = JSON.parse(pendingData);

    const contact = method === 'email' ? user.email : user.phone || 'tu número';

    return {
      success: true,
      message: `Se ha reenviado un código de verificación a ${contact} vía ${method === 'email' ? 'Email' : 'WhatsApp'}`
    };
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Actualizar datos del usuario (simulado)
  updateUser(updatedData: Partial<User>): { success: boolean; message: string; user?: User } {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return { success: false, message: 'No hay usuario logueado' };
    }

    const updatedUser: User = { ...currentUser, ...updatedData };

    // Actualizar en localStorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));

    // Actualizar lista de usuarios
    const users = this.getStoredUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('lol_users', JSON.stringify(users));
    }

    this.currentUserSubject.next(updatedUser);
    return { success: true, message: 'Perfil actualizado correctamente', user: updatedUser };
  }

  // Obtener región seleccionada
  getSelectedRegion(): any {
    const regionData = localStorage.getItem('selected_region');
    return regionData ? JSON.parse(regionData) : null;
  }

  // Guardar región seleccionada
  setSelectedRegion(region: any): void {
    localStorage.setItem('selected_region', JSON.stringify(region));
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    // Token simulado
    localStorage.setItem(this.TOKEN_KEY, 'fake-jwt-token-' + Date.now());
    this.currentUserSubject.next(user);
  }

  private getStoredUsers(): User[] {
    const users = localStorage.getItem('lol_users');
    return users ? JSON.parse(users) : [];
  }

  private generateId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
