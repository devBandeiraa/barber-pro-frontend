import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicoService } from '../../services/servico.service';
import { Servico } from '../../models/servico.model';

@Component({
  selector: 'app-selecao-servico',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="selecao-container">
      <h2>Escolha os Serviços</h2>
      <p class="subtitle">Você pode selecionar um ou mais serviços</p>
      
      <div *ngIf="loading" class="loading">Carregando serviços...</div>
      
      <div *ngIf="!loading && servicos.length === 0" class="error">
        Nenhum serviço disponível no momento.
      </div>

      <div class="servicos-grid">
        <div 
          *ngFor="let servico of servicos" 
          class="card servico-card"
          [class.multiple-selected]="isSelected(servico)"
          (click)="toggleServico(servico)"
        >
          <div class="servico-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="servico-header">
            <h3>{{ servico.nome }}</h3>
            <div class="checkbox" [class.checked]="isSelected(servico)">
              <svg *ngIf="isSelected(servico)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>
          <p class="descricao">{{ servico.descricao }}</p>
          <div class="servico-info">
            <span class="preco">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              R$ {{ servico.preco.toFixed(2) }}
            </span>
            <span class="duracao">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ servico.duracaoMinutos }} min
            </span>
          </div>
        </div>
      </div>

      <div *ngIf="servicosSelecionados.length > 0" class="resumo-selecao">
        <strong>{{ servicosSelecionados.length }}</strong> serviço(s) selecionado(s)
        <span class="total">Total: R$ {{ calcularTotal().toFixed(2) }}</span>
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>

      <button 
        (click)="prosseguir()" 
        [disabled]="servicosSelecionados.length === 0"
        class="btn-primary"
      >
        Próximo: Escolher Barbeiro
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <button (click)="voltar()" class="btn-secondary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </button>
    </div>
  `,
  styles: [`
    .selecao-container {
      max-width: 1000px;
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

    .subtitle {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-2xl);
    }

    .servicos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .servico-card {
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      text-align: left;
      animation: fadeInScale 0.5s ease-out backwards;
    }

    .servico-card:nth-child(1) { animation-delay: 0.1s; }
    .servico-card:nth-child(2) { animation-delay: 0.2s; }
    .servico-card:nth-child(3) { animation-delay: 0.3s; }
    .servico-card:nth-child(4) { animation-delay: 0.4s; }
    .servico-card:nth-child(5) { animation-delay: 0.5s; }
    .servico-card:nth-child(n+6) { animation-delay: 0.6s; }

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

    .servico-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 15px 35px rgba(1, 37, 125, 0.2);
    }

    .servico-card:active {
      transform: translateY(-4px) scale(0.98);
    }

    .servico-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: var(--spacing-md);
      box-shadow: 0 4px 12px rgba(1, 37, 125, 0.3);
      transition: all 0.3s ease;
    }

    .servico-card:hover .servico-icon {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 6px 20px rgba(1, 37, 125, 0.4);
    }

    .servico-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }

    .servico-header h3 {
      margin: 0;
      flex: 1;
      font-size: 1.25rem;
    }

    .checkbox {
      width: 28px;
      height: 28px;
      border: 3px solid var(--border-color);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      flex-shrink: 0;
      position: relative;
    }

    .checkbox.checked {
      background: linear-gradient(135deg, var(--success-color) 0%, var(--success-light) 100%);
      border-color: var(--success-color);
      color: white;
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25), 0 4px 12px rgba(16, 185, 129, 0.3);
      animation: checkBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes checkBounce {
      0% {
        transform: scale(0.8) rotate(-10deg);
      }
      50% {
        transform: scale(1.2) rotate(10deg);
      }
      100% {
        transform: scale(1.15) rotate(5deg);
      }
    }

    .descricao {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .servico-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 2px solid var(--border-light);
    }

    .preco {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .duracao {
      color: var(--text-secondary);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }

    .resumo-selecao {
      background: linear-gradient(135deg, rgba(1, 37, 125, 0.1) 0%, rgba(0, 255, 255, 0.05) 100%);
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 4px solid var(--primary-color);
      animation: slideInLeft 0.4s ease-out, pulse 2s ease-in-out infinite;
      box-shadow: 0 4px 12px rgba(1, 37, 125, 0.1);
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .resumo-selecao .total {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary-color);
    }

    .btn-primary {
      width: 100%;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-primary::before {
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

    .btn-primary:hover::before {
      width: 400px;
      height: 400px;
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(1, 37, 125, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      width: 100%;
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
    }

    .btn-secondary:hover {
      background: var(--bg-tertiary);
      border-color: var(--text-secondary);
    }
  `]
})
export class SelecaoServicoComponent implements OnInit {
  servicos: Servico[] = [];
  servicosSelecionados: Servico[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private servicoService: ServicoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarServicos();
    // Carregar seleções anteriores
    const selecionados = localStorage.getItem('servicosSelecionados');
    if (selecionados) {
      this.servicosSelecionados = JSON.parse(selecionados);
    }
  }

  carregarServicos() {
    this.loading = true;
    this.servicoService.listarTodos().subscribe({
      next: (servicos) => {
        this.servicos = servicos;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar serviços. Tente novamente.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleServico(servico: Servico) {
    const index = this.servicosSelecionados.findIndex(s => s.id === servico.id);
    if (index >= 0) {
      this.servicosSelecionados.splice(index, 1);
    } else {
      this.servicosSelecionados.push(servico);
    }
    localStorage.setItem('servicosSelecionados', JSON.stringify(this.servicosSelecionados));
  }

  isSelected(servico: Servico): boolean {
    return this.servicosSelecionados.some(s => s.id === servico.id);
  }

  calcularTotal(): number {
    return this.servicosSelecionados.reduce((total, servico) => total + servico.preco, 0);
  }

  prosseguir() {
    if (this.servicosSelecionados.length > 0) {
      this.router.navigate(['/barbeiros']);
    }
  }

  voltar() {
    this.router.navigate(['/cadastro']);
  }
}
