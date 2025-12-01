import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from './barbeiro.service';

export enum UserRole {
  CLIENTE = 'CLIENTE',
  BARBEIRO = 'BARBEIRO',
  ADMIN = 'ADMIN'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentRoleSubject = new BehaviorSubject<UserRole | null>(this.getStoredRole());
  public currentRole$ = this.currentRoleSubject.asObservable();

  constructor() {
    // Verificar se há role armazenada
    const storedRole = this.getStoredRole();
    if (storedRole) {
      this.currentRoleSubject.next(storedRole);
    }
  }

  getStoredRole(): UserRole | null {
    const role = localStorage.getItem('userRole');
    return role ? (role as UserRole) : null;
  }

  login(role: UserRole) {
    localStorage.setItem('userRole', role);
    this.currentRoleSubject.next(role);
  }

  getCurrentRole(): UserRole | null {
    return this.currentRoleSubject.value;
  }

  isCliente(): boolean {
    return this.getCurrentRole() === UserRole.CLIENTE || !this.getCurrentRole();
  }

  isBarbeiro(): boolean {
    return this.getCurrentRole() === UserRole.BARBEIRO;
  }

  isAdmin(): boolean {
    return this.getCurrentRole() === UserRole.ADMIN;
  }

  hasAccess(requiredRole: UserRole[]): boolean {
    const currentRole = this.getCurrentRole();
    if (!currentRole) return false;
    return requiredRole.includes(currentRole);
  }

  setCurrentBarbeiro(loginResponse: LoginResponse) {
    localStorage.setItem('barbeiroId', loginResponse.id.toString());
    localStorage.setItem('barbeiroNome', loginResponse.nome);
    localStorage.setItem('barbeiroEmail', loginResponse.email);
  }

  getCurrentBarbeiroId(): number | null {
    const id = localStorage.getItem('barbeiroId');
    return id ? parseInt(id, 10) : null;
  }

  logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('barbeiroId');
    localStorage.removeItem('barbeiroNome');
    localStorage.removeItem('barbeiroEmail');
    this.currentRoleSubject.next(null);
  }
}

