import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <div class="hero-icon">
          <svg width="64" height="64" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#01257D;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00FFFF;stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#heroGradient)"/>
            <path d="M12 10 L20 20 L28 10" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M12 30 L20 20 L28 30" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="20" cy="20" r="3" fill="white"/>
            <line x1="10" y1="20" x2="30" y2="20" stroke="white" stroke-width="1.5" opacity="0.6"/>
          </svg>
        </div>
        <h1 class="hero-title">Barber Pro</h1>
        <p class="hero-description">
          Sistema de agendamento para barbearia
        </p>
      </div>

      <div class="user-options">
        <button class="option-card cliente" (click)="irParaAgendamento()">
          <div class="option-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="option-card-content">
            <h2>Sou Cliente</h2>
            <p>Agende seu horário de forma rápida e fácil</p>
          </div>
          <div class="option-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </button>

        <button class="option-card barbeiro" (click)="irParaLoginBarbeiro()">
          <div class="option-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div class="option-card-content">
            <h2>Sou Barbeiro</h2>
            <p>Acesse seu dashboard e gerencie seus agendamentos</p>
          </div>
          <div class="option-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </button>
      </div>

      <div class="action-buttons">
        <button class="action-btn agendamentos" (click)="agendarAgora()">
          <div class="action-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span>AGENDAMENTOS</span>
        </button>
        
        <a [href]="whatsappLink" target="_blank" class="action-btn whatsapp" (click)="$event.stopPropagation()">
          <div class="action-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <span>WHATSAPP</span>
        </a>
        
        <a [href]="instagramLink" target="_blank" class="action-btn instagram" (click)="$event.stopPropagation()">
          <div class="action-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </div>
          <span>INSTAGRAM</span>
        </a>
        
        <a [href]="localizacaoLink" target="_blank" class="action-btn localizacao" (click)="$event.stopPropagation()">
          <div class="action-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <span>LOCALIZAÇÃO</span>
        </a>
      </div>

    </div>
  `,
  styles: [`
    .home-container {
      max-width: 900px;
      margin: 0 auto;
      padding: var(--spacing-xl) var(--spacing-lg);
      animation: fadeInUp 0.6s ease-out;
    }

    .hero-section {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
      padding: var(--spacing-2xl);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-2xl);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .hero-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto var(--spacing-md);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      margin-bottom: var(--spacing-sm);
      color: var(--text-primary);
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .hero-description {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
    }

    .user-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    @media (max-width: 768px) {
      .user-options {
        grid-template-columns: 1fr;
      }
    }

    .option-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      text-align: left;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .option-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .option-icon {
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      color: var(--text-secondary);
    }

    .option-card:hover .option-icon {
      background: var(--primary-color);
      color: white;
      transform: scale(1.05);
    }

    .option-card-content {
      flex: 1;
      min-width: 0;
    }

    .option-card h2 {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .option-card p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .option-arrow {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-tertiary);
      transition: all 0.3s ease;
    }

    .option-card:hover .option-arrow {
      color: var(--primary-color);
      transform: translateX(4px);
    }

    .btn-agendar {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 24px 56px;
      border-radius: var(--radius-xl);
      font-size: 1.375rem;
      font-weight: 800;
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: 0 10px 30px rgba(30, 64, 175, 0.3);
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-md);
      text-transform: uppercase;
      letter-spacing: 2px;
      position: relative;
      overflow: hidden;
      border: 3px solid transparent;
    }

    .btn-agendar::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn-agendar:hover::before {
      width: 600px;
      height: 600px;
    }

    .btn-agendar:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 20px 50px rgba(30, 64, 175, 0.4);
      background: var(--primary-dark);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-agendar:active {
      transform: translateY(-3px) scale(1);
    }

    .btn-agendar span {
      position: relative;
      z-index: 1;
    }

    .btn-agendar svg {
      position: relative;
      z-index: 1;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
      margin-top: var(--spacing-2xl);
    }

    .action-btn {
      background: var(--bg-primary);
      border: 3px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 800;
      font-size: 0.9375rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-md);
      transition: all var(--transition-base);
      cursor: pointer;
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
    }

    .action-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
    }

    .action-btn:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-xl);
      border-width: 3px;
    }

    .action-btn:hover .action-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .action-btn.agendamentos:hover {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .action-btn.agendamentos:hover .action-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .action-btn.whatsapp:hover {
      background: #25D366;
      color: white;
      border-color: #25D366;
    }

    .action-btn.whatsapp:hover .action-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .action-btn.instagram:hover {
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      color: white;
      border-color: transparent;
    }

    .action-btn.instagram:hover .action-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .action-btn.localizacao:hover {
      background: var(--danger-color);
      color: white;
      border-color: var(--danger-color);
    }

    .action-btn.localizacao:hover .action-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
      .home-container {
        padding: var(--spacing-lg) 0;
      }

      .hero-section {
        padding: var(--spacing-xl);
      }

      .hero-icon {
        width: 100px;
        height: 100px;
      }

      .btn-agendar {
        padding: 16px 32px;
        font-size: 1.125rem;
      }

      .action-buttons {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
      }

      .action-btn {
        padding: var(--spacing-lg);
        font-size: 0.8125rem;
      }

      .action-icon {
        width: 56px;
        height: 56px;
      }
    }

    @media (max-width: 480px) {
      .action-buttons {
        grid-template-columns: 1fr;
      }

      .hero-icon {
        width: 100px;
        height: 100px;
      }

      .btn-agendar {
        padding: 18px 32px;
        font-size: 1.125rem;
      }
    }

  `]
})
export class HomeComponent {
  whatsappLink = 'https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20agendar%20um%20horário.';
  instagramLink = 'https://instagram.com/barberpro';
  localizacaoLink = 'https://maps.google.com/?q=Barbearia+Barber+Pro';

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  agendarAgora() {
    this.router.navigate(['/cadastro']);
  }

  irParaAgendamento() {
    this.router.navigate(['/cadastro']);
  }

  irParaLoginBarbeiro() {
    this.router.navigate(['/login-barbeiro']);
  }
}

