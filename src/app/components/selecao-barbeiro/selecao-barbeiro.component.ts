import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BarbeiroService } from '../../services/barbeiro.service';
import { Barbeiro } from '../../models/barbeiro.model';

@Component({
  selector: 'app-selecao-barbeiro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="selecao-container">
      <h2>Escolha o Barbeiro</h2>
      
      <div *ngIf="loading" class="loading">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
        </svg>
        Carregando barbeiros...
      </div>
      
      <div *ngIf="!loading && !error && barbeiros.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.3; margin-bottom: 1rem;">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <p>Nenhum barbeiro disponível no momento.</p>
        <p class="empty-subtitle">Os barbeiros serão criados automaticamente quando o backend iniciar pela primeira vez.</p>
        <p class="empty-subtitle" style="margin-top: 0.5rem; font-size: 0.8rem;">
          Certifique-se de que o backend está rodando em <strong>http://localhost:8080</strong>
        </p>
        <button (click)="carregarBarbeiros()" class="btn-retry">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Tentar Novamente
        </button>
      </div>

      <div *ngIf="error && !loading" class="error-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.3; margin-bottom: 1rem;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>{{ error }}</p>
        <p class="error-subtitle">Verifique se o backend está rodando em http://localhost:8080</p>
        <button (click)="carregarBarbeiros()" class="btn-retry">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Tentar Novamente
        </button>
      </div>

      <div *ngIf="!loading && !error && barbeiros.length > 0" class="barbeiros-grid">
        <div 
          *ngFor="let barbeiro of barbeiros" 
          class="card barbeiro-card"
          [class.selected]="barbeiroSelecionado?.id === barbeiro.id"
          (click)="selecionarBarbeiro(barbeiro)"
        >
          <div class="barbeiro-avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h3>{{ barbeiro.nome }}</h3>
          <p *ngIf="barbeiro.especialidades" class="especialidades">
            {{ barbeiro.especialidades }}
          </p>
          <div class="barbeiro-info">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {{ barbeiro.email }}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {{ barbeiro.telefone }}
            </span>
          </div>
          <div class="selected-badge" *ngIf="barbeiroSelecionado?.id === barbeiro.id">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Selecionado
          </div>
        </div>
      </div>

      <button 
        (click)="prosseguir()" 
        [disabled]="!barbeiroSelecionado"
        class="btn-prosseguir"
      >
        Próximo: Agendar Horário
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <button (click)="voltar()" class="btn-voltar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </button>
    </div>
  `,
  styles: [`
    .selecao-container {
      max-width: 900px;
      margin: 0 auto;
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .barbeiros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .barbeiro-card {
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
      position: relative;
      animation: fadeInScale 0.5s ease-out backwards;
      overflow: hidden;
    }

    .barbeiro-card:nth-child(1) { animation-delay: 0.1s; }
    .barbeiro-card:nth-child(2) { animation-delay: 0.2s; }
    .barbeiro-card:nth-child(3) { animation-delay: 0.3s; }
    .barbeiro-card:nth-child(4) { animation-delay: 0.4s; }
    .barbeiro-card:nth-child(n+5) { animation-delay: 0.5s; }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .barbeiro-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
      transition: left 0.5s;
    }

    .barbeiro-card:hover::before {
      left: 100%;
    }

    .barbeiro-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 15px 35px rgba(1, 37, 125, 0.2);
    }

    .barbeiro-card.selected {
      border: 3px solid var(--primary-color);
      background: linear-gradient(135deg, rgba(1, 37, 125, 0.08) 0%, rgba(0, 255, 255, 0.05) 100%);
      animation: selectedPulse 0.5s ease-out;
      box-shadow: 0 0 0 4px rgba(1, 37, 125, 0.1), 0 10px 30px rgba(1, 37, 125, 0.2);
    }

    @keyframes selectedPulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(1, 37, 125, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 8px rgba(1, 37, 125, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 4px rgba(1, 37, 125, 0.1), 0 10px 30px rgba(1, 37, 125, 0.2);
      }
    }

    .barbeiro-avatar {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--spacing-md);
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(1, 37, 125, 0.3);
      transition: all 0.3s ease;
      position: relative;
    }

    .barbeiro-card:hover .barbeiro-avatar {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 6px 20px rgba(1, 37, 125, 0.4);
    }

    .barbeiro-card.selected .barbeiro-avatar {
      animation: avatarBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes avatarBounce {
      0%, 100% {
        transform: scale(1) rotate(0deg);
      }
      25% {
        transform: scale(1.2) rotate(-10deg);
      }
      75% {
        transform: scale(1.1) rotate(10deg);
      }
    }

    .barbeiro-card h3 {
      margin-bottom: var(--spacing-sm);
      font-size: 1.25rem;
    }

    .especialidades {
      color: var(--text-secondary);
      font-style: italic;
      margin: var(--spacing-sm) 0;
      font-size: 0.9rem;
    }

    .barbeiro-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 2px solid var(--border-light);
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .barbeiro-info span {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
    }

    .selected-badge {
      position: absolute;
      top: var(--spacing-md);
      right: var(--spacing-md);
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-light) 100%);
      color: white;
      padding: 6px 12px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), badgePulse 2s ease-in-out infinite;
      z-index: 10;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    @keyframes badgePulse {
      0%, 100% {
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      50% {
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.5);
      }
    }

    .btn-prosseguir {
      width: 100%;
      margin-bottom: var(--spacing-md);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-prosseguir::before {
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

    .btn-prosseguir:hover::before {
      width: 400px;
      height: 400px;
    }

    .btn-prosseguir:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(1, 37, 125, 0.4);
    }

    .btn-prosseguir:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .btn-voltar {
      width: 100%;
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .btn-voltar:hover {
      background: var(--bg-tertiary);
      border-color: var(--text-secondary);
    }

    .loading {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-md);
    }

    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .empty-state,
    .error-state {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--text-secondary);
    }

    .empty-state p,
    .error-state p {
      margin: var(--spacing-sm) 0;
      font-size: 1.125rem;
      color: var(--text-primary);
    }

    .empty-subtitle,
    .error-subtitle {
      font-size: 0.875rem;
      color: var(--text-tertiary);
      margin-bottom: var(--spacing-lg);
    }

    .btn-retry {
      margin-top: var(--spacing-lg);
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: var(--radius-lg);
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      transition: all var(--transition-base);
    }

    .btn-retry:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .error-state {
      color: var(--danger-color);
    }

    .error-state p {
      color: var(--danger-color);
    }
  `]
})
export class SelecaoBarbeiroComponent implements OnInit {
  barbeiros: Barbeiro[] = [];
  barbeiroSelecionado: Barbeiro | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private barbeiroService: BarbeiroService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarBarbeiros();
  }

  carregarBarbeiros() {
    this.loading = true;
    this.error = '';
    this.barbeiroService.listarAtivos().subscribe({
      next: (barbeiros) => {
        this.barbeiros = barbeiros || [];
        this.loading = false;
        if (barbeiros.length === 0) {
          console.warn('Nenhum barbeiro retornado pela API');
        }
      },
      error: (err) => {
        this.error = 'Erro ao carregar barbeiros. Verifique se o backend está rodando.';
        this.loading = false;
        this.barbeiros = [];
        console.error('Erro ao carregar barbeiros:', err);
        if (err.status === 0) {
          this.error = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080';
        } else if (err.status === 404) {
          this.error = 'Endpoint não encontrado. Verifique a configuração da API.';
        }
      }
    });
  }

  selecionarBarbeiro(barbeiro: Barbeiro) {
    this.barbeiroSelecionado = barbeiro;
    localStorage.setItem('barbeiro', JSON.stringify(barbeiro));
  }

  prosseguir() {
    if (this.barbeiroSelecionado) {
      this.router.navigate(['/agendamento']);
    }
  }

  voltar() {
    this.router.navigate(['/servicos']);
  }
}

