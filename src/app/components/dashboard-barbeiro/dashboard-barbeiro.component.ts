import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { AuthService } from '../../services/auth.service';
import { Agendamento } from '../../models/agendamento.model';

@Component({
  selector: 'app-dashboard-barbeiro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div>
          <h1>Dashboard do Barbeiro</h1>
          <p class="subtitle">Gerencie seus agendamentos</p>
        </div>
      </div>

      <div *ngIf="!loading">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Hoje</h3>
            <div class="stat-value">{{ agendamentosHoje.length }}</div>
            <p>agendamentos</p>
          </div>
          <div class="stat-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            <h3>Esta Semana</h3>
            <div class="stat-value">{{ agendamentosSemana.length }}</div>
            <p>agendamentos</p>
          </div>
          <div class="stat-card" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
            <h3>Total</h3>
            <div class="stat-value">{{ agendamentos.length }}</div>
            <p>agendamentos</p>
          </div>
        </div>

        <div class="tabs">
          <button 
            class="tab-button" 
            [class.active]="abaAtiva === 'hoje'"
            (click)="abaAtiva = 'hoje'"
          >
            Hoje ({{ agendamentosHoje.length }})
          </button>
          <button 
            class="tab-button" 
            [class.active]="abaAtiva === 'semana'"
            (click)="abaAtiva = 'semana'"
          >
            Esta Semana ({{ agendamentosSemana.length }})
          </button>
          <button 
            class="tab-button" 
            [class.active]="abaAtiva === 'todos'"
            (click)="abaAtiva = 'todos'"
          >
            Todos ({{ agendamentos.length }})
          </button>
        </div>

        <div *ngIf="abaAtiva === 'hoje'" class="agendamentos-grid">
          <div *ngFor="let agendamento of agendamentosHoje" class="agendamento-card">
            <div class="card-header">
              <h3>{{ agendamento.cliente.nome }}</h3>
              <span class="status-badge" [class]="agendamento.status">{{ agendamento.status }}</span>
            </div>
            <div class="card-body">
              <p><strong>📞 Telefone:</strong> {{ agendamento.cliente.telefone }}</p>
              <p><strong>🕐 Horário:</strong> {{ formatarDataHora(agendamento.dataHora) }}</p>
              <p><strong>✂️ Serviço:</strong> {{ getServicosNome(agendamento) }}</p>
              <p><strong>💰 Valor:</strong> R$ {{ (agendamento.valorTotal || 0).toFixed(2) }}</p>
              <p *ngIf="agendamento.observacoes"><strong>📝 Observações:</strong> {{ agendamento.observacoes }}</p>
            </div>
          </div>
          <div *ngIf="agendamentosHoje.length === 0" class="empty-state">
            <p>Nenhum agendamento para hoje</p>
          </div>
        </div>

        <div *ngIf="abaAtiva === 'semana'" class="agendamentos-grid">
          <div *ngFor="let agendamento of agendamentosSemana" class="agendamento-card">
            <div class="card-header">
              <h3>{{ agendamento.cliente.nome }}</h3>
              <span class="status-badge" [class]="agendamento.status">{{ agendamento.status }}</span>
            </div>
            <div class="card-body">
              <p><strong>📞 Telefone:</strong> {{ agendamento.cliente.telefone }}</p>
              <p><strong>🕐 Horário:</strong> {{ formatarDataHora(agendamento.dataHora) }}</p>
              <p><strong>✂️ Serviço:</strong> {{ getServicosNome(agendamento) }}</p>
              <p><strong>💰 Valor:</strong> R$ {{ (agendamento.valorTotal || 0).toFixed(2) }}</p>
              <p *ngIf="agendamento.observacoes"><strong>📝 Observações:</strong> {{ agendamento.observacoes }}</p>
            </div>
          </div>
          <div *ngIf="agendamentosSemana.length === 0" class="empty-state">
            <p>Nenhum agendamento para esta semana</p>
          </div>
        </div>

        <div *ngIf="abaAtiva === 'todos'" class="agendamentos-grid">
          <div *ngFor="let agendamento of agendamentos" class="agendamento-card">
            <div class="card-header">
              <h3>{{ agendamento.cliente.nome }}</h3>
              <span class="status-badge" [class]="agendamento.status">{{ agendamento.status }}</span>
            </div>
            <div class="card-body">
              <p><strong>📞 Telefone:</strong> {{ agendamento.cliente.telefone }}</p>
              <p><strong>🕐 Horário:</strong> {{ formatarDataHora(agendamento.dataHora) }}</p>
              <p><strong>✂️ Serviço:</strong> {{ getServicosNome(agendamento) }}</p>
              <p><strong>💰 Valor:</strong> R$ {{ (agendamento.valorTotal || 0).toFixed(2) }}</p>
              <p *ngIf="agendamento.observacoes"><strong>📝 Observações:</strong> {{ agendamento.observacoes }}</p>
            </div>
          </div>
          <div *ngIf="agendamentos.length === 0" class="empty-state">
            <p>Nenhum agendamento encontrado</p>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Carregando agendamentos...</div>

      <div class="dashboard-footer">
        <button (click)="voltar()" class="btn-secondary">Voltar para Agendamento</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid var(--border-color);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .subtitle {
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }


    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #01257D 0%, #00FFFF 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
    }

    .stat-card h3 {
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .stat-card .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .stat-card p {
      color: white;
      opacity: 0.9;
      margin: 0;
      font-size: 0.875rem;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid var(--border-color);
    }

    .tab-button {
      padding: 12px 24px;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: var(--text-secondary);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-button:hover {
      color: var(--text-primary);
      background: var(--bg-secondary);
    }

    .tab-button.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .agendamentos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .agendamento-card {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .agendamento-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .card-body p {
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }

    .card-body p:last-child {
      margin-bottom: 0;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    .dashboard-footer {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid var(--border-color);
    }

    .btn-secondary {
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
export class DashboardBarbeiroComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  agendamentosHoje: Agendamento[] = [];
  agendamentosSemana: Agendamento[] = [];
  loading: boolean = false;
  abaAtiva: 'hoje' | 'semana' | 'todos' = 'hoje';

  constructor(
    private agendamentoService: AgendamentoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    const barbeiroId = this.authService.getCurrentBarbeiroId();
    if (!barbeiroId) {
      console.error('Barbeiro não autenticado');
      return;
    }

    this.loading = true;
    this.agendamentoService.listarPorBarbeiro(barbeiroId).subscribe({
      next: (agendamentos) => {
        this.agendamentos = agendamentos;
        this.filtrarAgendamentos();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar agendamentos:', err);
        this.loading = false;
      }
    });
  }

  filtrarAgendamentos() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimHoje = new Date(hoje);
    fimHoje.setHours(23, 59, 59, 999);

    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);

    this.agendamentosHoje = this.agendamentos.filter(a => {
      const dataHora = new Date(a.dataHora);
      return dataHora >= hoje && dataHora <= fimHoje;
    });

    this.agendamentosSemana = this.agendamentos.filter(a => {
      const dataHora = new Date(a.dataHora);
      return dataHora >= inicioSemana && dataHora <= fimSemana;
    });
  }

  formatarDataHora(dataHora: string): string {
    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getServicosNome(agendamento: Agendamento): string {
    if (agendamento.servicos && agendamento.servicos.length > 0) {
      return agendamento.servicos.map(s => s.nome).join(', ');
    }
    return 'Serviço';
  }

  voltar() {
    this.router.navigate(['/cadastro']);
  }
}

