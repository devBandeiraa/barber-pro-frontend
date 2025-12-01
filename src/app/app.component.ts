import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService, UserRole } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div [class.container]="showContainer" [class.container-transparent]="!showContainer">
      <header *ngIf="showHeader">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Círculo de fundo com gradiente -->
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#01257D;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#00FFFF;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="20" r="18" fill="url(#logoGradient)"/>
                <!-- Tesouras de barbeiro estilizadas -->
                <path d="M12 10 L20 20 L28 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M12 30 L20 20 L28 30" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <circle cx="20" cy="20" r="3" fill="white"/>
                <!-- Linha decorativa -->
                <line x1="10" y1="20" x2="30" y2="20" stroke="white" stroke-width="1.5" opacity="0.6"/>
              </svg>
            </div>
            <div>
              <h1>Barber Pro</h1>
              <p class="header-subtitle">Agendamento Rápido e Fácil</p>
            </div>
          </div>
          <nav>
            <a routerLink="/" 
               routerLinkActive="active"
               [routerLinkActiveOptions]="{exact: true}"
               class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Início
            </a>
            <a routerLink="/cadastro" 
               routerLinkActive="active"
               class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Agendar
            </a>
            <a *ngIf="shouldShowDashboard()" 
               routerLink="/dashboard" 
               routerLinkActive="active"
               class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Dashboard
            </a>
            <a *ngIf="authService.isAdmin()" 
               routerLink="/admin" 
               routerLinkActive="active"
               class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              Admin
            </a>
            <a *ngIf="authService.isAdmin()" 
               routerLink="/clientes" 
               routerLinkActive="active"
               class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Clientes
            </a>
            <button *ngIf="shouldShowDashboard()" 
                    (click)="logout()" 
                    class="nav-link btn-logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sair
            </button>
          </nav>
        </div>
      </header>
      
      <div class="progress-indicator" *ngIf="showProgress">
        <div class="progress-steps">
          <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
            <div class="step-number">1</div>
            <span class="step-label">Cliente</span>
          </div>
          <div class="step-line" [class.completed]="currentStep > 1"></div>
          <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
            <div class="step-number">2</div>
            <span class="step-label">Serviços</span>
          </div>
          <div class="step-line" [class.completed]="currentStep > 2"></div>
          <div class="step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
            <div class="step-number">3</div>
            <span class="step-label">Barbeiro</span>
          </div>
          <div class="step-line" [class.completed]="currentStep > 3"></div>
          <div class="step" [class.active]="currentStep >= 4" [class.completed]="currentStep > 4">
            <div class="step-number">4</div>
            <span class="step-label">Agendamento</span>
          </div>
        </div>
      </div>

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    header {
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-lg);
      border-bottom: 2px solid var(--border-color);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .logo {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(1, 37, 125, 0.3);
      margin-right: var(--spacing-md);
      transition: all 0.3s ease;
      animation: logoFloat 3s ease-in-out infinite;
    }

    .logo:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 6px 20px rgba(1, 37, 125, 0.4);
    }

    @keyframes logoFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }

    .header-subtitle {
      color: var(--text-secondary);
      margin-top: var(--spacing-xs);
      margin-bottom: 0;
      font-size: 0.875rem;
      font-weight: 400;
    }

    nav {
      display: flex;
      gap: var(--spacing-sm);
    }

    .nav-link {
      padding: 10px 20px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      text-decoration: none;
      border-radius: var(--radius-lg);
      font-weight: 500;
      transition: all var(--transition-base);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9375rem;
    }

    .nav-link:hover {
      background: var(--primary-color);
      color: white;
      border-color: transparent;
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .nav-link.active {
      background: var(--primary-color);
      color: white;
      border-color: transparent;
    }

    .btn-logout {
      background: var(--danger-color);
      color: white;
      border-color: var(--danger-color);
    }

    .btn-logout:hover {
      background: var(--danger-dark);
      border-color: var(--danger-dark);
    }

    h1 {
      font-size: 2rem;
      margin: 0;
      font-family: 'Poppins', sans-serif;
    }

    .progress-indicator {
      margin-bottom: var(--spacing-2xl);
      padding: var(--spacing-lg);
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-color);
    }

    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 800px;
      margin: 0 auto;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      flex: 1;
      position: relative;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--bg-tertiary);
      border: 3px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--text-secondary);
      transition: all var(--transition-base);
    }

    .step.active .step-number {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
      box-shadow: var(--shadow-md);
      transform: scale(1.1);
    }

    .step.completed .step-number {
      background: var(--success-color);
      border-color: var(--success-color);
      color: white;
    }

    .step.completed .step-number::after {
      content: '✓';
      font-size: 18px;
    }

    .step-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .step.active .step-label {
      color: var(--primary-color);
    }

    .step.completed .step-label {
      color: var(--success-color);
    }

    .step-line {
      flex: 1;
      height: 3px;
      background: var(--border-color);
      margin: 0 var(--spacing-sm);
      transition: all var(--transition-base);
      position: relative;
      top: -20px;
    }

    .step-line.completed {
      background: var(--success-color);
    }

    .container-transparent {
      background: transparent;
      box-shadow: none;
      padding: 0;
      max-width: 100%;
    }

    .container-transparent::before {
      display: none;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      nav {
        width: 100%;
      }

      .nav-link {
        flex: 1;
        justify-content: center;
      }

      .progress-steps {
        flex-wrap: wrap;
        gap: var(--spacing-sm);
      }

      .step-line {
        display: none;
      }

      .step-label {
        font-size: 0.625rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Barber Pro';
  currentStep: number = 1;
  showProgress: boolean = false;
  showContainer: boolean = true;
  showHeader: boolean = true;
  UserRole = UserRole;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateProgress(event.url);
      });
  }

  ngOnInit() {
    // Não definir role automaticamente - apenas usar a role existente
    // Clientes não precisam fazer login, então não terão role definida
  }

  shouldShowDashboard(): boolean {
    const role = this.authService.getCurrentRole();
    const barbeiroId = this.authService.getCurrentBarbeiroId();
    
    // Só mostrar Dashboard se:
    // 1. A role for explicitamente BARBEIRO ou ADMIN
    // 2. E houver um barbeiro autenticado (barbeiroId existe)
    // Isso garante que mesmo se houver role antiga, sem barbeiro autenticado não mostra
    if (role === UserRole.BARBEIRO || role === UserRole.ADMIN) {
      // Se for ADMIN, sempre mostrar (admins podem não ter barbeiroId)
      if (role === UserRole.ADMIN) {
        return true;
      }
      // Se for BARBEIRO, só mostrar se houver barbeiroId (barbeiro autenticado)
      return barbeiroId !== null;
    }
    
    return false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  updateProgress(url: string) {
    // Se estiver no fluxo de cadastro do cliente, limpar role de barbeiro se não houver barbeiro autenticado
    if (url.includes('/cadastro') || url.includes('/servicos') || url.includes('/barbeiros') || url.includes('/agendamento')) {
      const role = this.authService.getCurrentRole();
      const barbeiroId = this.authService.getCurrentBarbeiroId();
      
      // Se não houver barbeiro autenticado (sem barbeiroId), limpar role de barbeiro
      // Isso garante que clientes não vejam o Dashboard mesmo se houver role antiga
      if (!barbeiroId && (role === UserRole.BARBEIRO || role === UserRole.ADMIN)) {
        // Se estiver no fluxo do cliente e não houver barbeiro autenticado, limpar a role
        this.authService.logout();
      }
    }
    
    if (url === '/' || url === '') {
      this.showProgress = false;
      this.showContainer = false;
      this.showHeader = false;
    } else {
      this.showContainer = true;
      this.showHeader = true;
      if (url.includes('/cadastro')) {
        this.currentStep = 1;
        this.showProgress = true;
      } else if (url.includes('/servicos')) {
        this.currentStep = 2;
        this.showProgress = true;
      } else if (url.includes('/barbeiros')) {
        this.currentStep = 3;
        this.showProgress = true;
      } else if (url.includes('/agendamento')) {
        this.currentStep = 4;
        this.showProgress = true;
      } else {
        this.showProgress = false;
      }
    }
  }
}

