import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
import { BarbeiroService } from '../../services/barbeiro.service';

@Component({
  selector: 'app-login-barbeiro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h1>Login do Barbeiro</h1>
          <p class="login-subtitle">Acesse seu dashboard</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              class="form-input"
              placeholder="seu.email@barberpro.com"
            >
          </div>

          <div class="form-group">
            <label for="senha">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              [(ngModel)]="senha"
              required
              class="form-input"
              placeholder="Digite sua senha"
            >
          </div>

          <div *ngIf="error" class="error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" [disabled]="!loginForm.valid || loading" class="btn-login">
            <span *ngIf="loading" class="button-content">
              <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              Entrando...
            </span>
            <span *ngIf="!loading" class="button-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Entrar
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p class="info-text">Senha padrão: <strong>123456</strong></p>
          <p class="info-text">Use o email do barbeiro cadastrado</p>
        </div>

        <button (click)="voltar()" class="btn-voltar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-2xl) var(--spacing-lg);
    }

    .login-card {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-2xl);
      padding: var(--spacing-2xl);
      max-width: 450px;
      width: 100%;
      box-shadow: var(--shadow-xl);
      animation: fadeInUp 0.5s ease-out;
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }

    .login-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--spacing-lg);
      background: var(--primary-color);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .login-header h1 {
      margin: 0 0 var(--spacing-sm) 0;
      color: var(--text-primary);
      font-size: 1.75rem;
    }

    .login-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.9375rem;
    }

    .form-group {
      margin-bottom: var(--spacing-xl);
    }

    label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    label svg {
      color: var(--primary-color);
    }

    .form-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      font-size: 16px;
      transition: all 0.3s ease;
      font-family: inherit;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
    }

    .btn-login {
      width: 100%;
      margin-top: var(--spacing-lg);
      padding: 16px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-md);
    }

    .btn-login:hover:not(:disabled) {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .error {
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid var(--danger-color);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
      color: var(--danger-color);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 0.9375rem;
    }

    .login-footer {
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-xl);
      border-top: 2px solid var(--border-color);
      text-align: center;
    }

    .info-text {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: var(--spacing-xs) 0;
    }

    .btn-voltar {
      width: 100%;
      margin-top: var(--spacing-lg);
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      padding: 12px;
      border-radius: var(--radius-lg);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .btn-voltar:hover {
      background: var(--bg-tertiary);
      border-color: var(--text-secondary);
    }
  `]
})
export class LoginBarbeiroComponent {
  email: string = '';
  senha: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private barbeiroService: BarbeiroService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.senha) {
      this.error = 'Por favor, preencha todos os campos.';
      return;
    }

    this.error = '';
    this.loading = true;

    this.barbeiroService.login(this.email, this.senha).subscribe({
      next: (response) => {
        this.authService.login(UserRole.BARBEIRO);
        this.authService.setCurrentBarbeiro(response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Email ou senha inválidos.';
        this.loading = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}

