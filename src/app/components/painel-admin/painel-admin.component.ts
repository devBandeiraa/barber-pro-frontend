import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AgendamentoService } from '../../services/agendamento.service';
import { ClienteService } from '../../services/cliente.service';
import { BarbeiroService } from '../../services/barbeiro.service';
import { ServicoService } from '../../services/servico.service';
import { Agendamento, StatusAgendamento } from '../../models/agendamento.model';
import { RelatorioFinanceiro } from '../../models/financeiro.model';
import { Servico } from '../../models/servico.model';

@Component({
  selector: 'app-painel-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="painel-container">
      <h2>Painel Administrativo</h2>

      <!-- Métricas Principais -->
      <div class="metricas-grid">
        <div class="metrica-card">
          <div class="metrica-icon receitas">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="metrica-content">
            <h3>Receita Hoje</h3>
            <p class="metrica-valor">R$ {{ receitaHoje.toFixed(2) }}</p>
            <span class="metrica-variacao positiva">+12% vs ontem</span>
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icon agendamentos">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="metrica-content">
            <h3>Agendamentos Hoje</h3>
            <p class="metrica-valor">{{ agendamentosHoje.length }}</p>
            <span class="metrica-variacao">{{ agendamentosConfirmados }} confirmados</span>
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icon clientes">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="metrica-content">
            <h3>Total Clientes</h3>
            <p class="metrica-valor">{{ totalClientes }}</p>
            <span class="metrica-variacao">{{ novosClientesMes }} novos este mês</span>
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icon ticket">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="metrica-content">
            <h3>Ticket Médio</h3>
            <p class="metrica-valor">R$ {{ ticketMedio.toFixed(2) }}</p>
            <span class="metrica-variacao positiva">+5% vs mês anterior</span>
          </div>
        </div>
      </div>

      <!-- Agendamentos do Dia -->
      <div class="secao">
        <h3>Agendamentos de Hoje</h3>
        <div class="agendamentos-lista">
          <div *ngFor="let agendamento of agendamentosHoje" class="agendamento-item">
            <div class="agendamento-horario">
              {{ agendamento.dataHora | date:'HH:mm' }}
            </div>
            <div class="agendamento-info">
              <strong>{{ agendamento.cliente.nome }}</strong>
              <span>{{ getServicosNome(agendamento) }}</span>
              <span class="barbeiro-nome">{{ agendamento.barbeiro.nome }}</span>
            </div>
            <div class="agendamento-valor">
              R$ {{ (agendamento.valorTotal || 0).toFixed(2) }}
            </div>
            <span class="status-badge" [class]="agendamento.status">
              {{ agendamento.status }}
            </span>
          </div>
          <div *ngIf="agendamentosHoje.length === 0" class="empty-state">
            Nenhum agendamento para hoje
          </div>
        </div>
      </div>

      <!-- Gráficos e Relatórios -->
      <div class="relatorios-grid">
        <div class="secao">
          <h3>Receitas por Forma de Pagamento</h3>
          <div class="pagamento-stats">
            <div class="pagamento-item">
              <span class="pagamento-label">PIX</span>
              <div class="pagamento-bar">
                <div class="pagamento-fill pix" [style.width]="percentualPix + '%'"></div>
              </div>
              <span class="pagamento-valor">R$ {{ getValorFormatado(receitasPorPagamento.pix) }}</span>
            </div>
            <div class="pagamento-item">
              <span class="pagamento-label">Cartão</span>
              <div class="pagamento-bar">
                <div class="pagamento-fill cartao" [style.width]="percentualCartao + '%'"></div>
              </div>
              <span class="pagamento-valor">R$ {{ getValorFormatado(receitasPorPagamento.cartao) }}</span>
            </div>
            <div class="pagamento-item">
              <span class="pagamento-label">Dinheiro</span>
              <div class="pagamento-bar">
                <div class="pagamento-fill dinheiro" [style.width]="percentualDinheiro + '%'"></div>
              </div>
              <span class="pagamento-valor">R$ {{ getValorFormatado(receitasPorPagamento.dinheiro) }}</span>
            </div>
          </div>
        </div>

        <div class="secao">
          <h3>Top Barbeiros</h3>
          <div class="barbeiros-stats">
            <div *ngFor="let barbeiro of topBarbeiros" class="barbeiro-stat-item">
              <div class="barbeiro-info">
                <strong>{{ barbeiro.nome }}</strong>
                <span>{{ barbeiro.totalAgendamentos }} agendamentos</span>
              </div>
              <div class="barbeiro-valor">
                R$ {{ getValorFormatado(barbeiro.receitaTotal) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .painel-container {
      animation: fadeInUp 0.5s ease-out;
    }

    .metricas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .metrica-card {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      display: flex;
      gap: var(--spacing-md);
      transition: all var(--transition-base);
    }

    .metrica-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .metrica-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .metrica-icon.receitas {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .metrica-icon.agendamentos {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
    }

    .metrica-icon.clientes {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .metrica-icon.ticket {
      background: linear-gradient(135deg, #01257D, #00FFFF);
      color: white;
    }

    .metrica-content h3 {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .metrica-valor {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: var(--spacing-xs) 0;
    }

    .metrica-variacao {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .metrica-variacao.positiva {
      color: var(--success-color);
    }

    .secao {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      margin-bottom: var(--spacing-xl);
    }

    .secao h3 {
      margin: 0 0 var(--spacing-lg) 0;
      font-size: 1.25rem;
    }

    .agendamentos-lista {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .agendamento-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }

    .agendamento-horario {
      font-weight: 700;
      color: var(--primary-color);
      min-width: 60px;
    }

    .agendamento-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .barbeiro-nome {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .agendamento-valor {
      font-weight: 700;
      color: var(--success-color);
    }

    .relatorios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--spacing-xl);
    }

    .pagamento-stats {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .pagamento-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .pagamento-label {
      min-width: 80px;
      font-weight: 600;
    }

    .pagamento-bar {
      flex: 1;
      height: 24px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .pagamento-fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 0.5s ease;
    }

    .pagamento-fill.pix {
      background: linear-gradient(90deg, #32bcad, #2a9d8f);
    }

    .pagamento-fill.cartao {
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    }

    .pagamento-fill.dinheiro {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .pagamento-valor {
      font-weight: 700;
      min-width: 100px;
      text-align: right;
    }

    .barbeiros-stats {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .barbeiro-stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }

    .barbeiro-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .barbeiro-valor {
      font-weight: 700;
      color: var(--success-color);
      font-size: 1.125rem;
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--text-secondary);
    }
  `]
})
export class PainelAdminComponent implements OnInit {
  agendamentosHoje: Agendamento[] = [];
  totalClientes: number = 0;
  novosClientesMes: number = 0;
  receitaHoje: number = 0;
  ticketMedio: number = 0;
  agendamentosConfirmados: number = 0;
  receitasPorPagamento = { pix: 0, cartao: 0, dinheiro: 0 };
  topBarbeiros: any[] = [];
  
  percentualPix: number = 0;
  percentualCartao: number = 0;
  percentualDinheiro: number = 0;

  constructor(
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService,
    private barbeiroService: BarbeiroService
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    // Carregar agendamentos de hoje
    this.agendamentoService.listarTodos().subscribe({
      next: (agendamentos) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const fimHoje = new Date(hoje);
        fimHoje.setHours(23, 59, 59, 999);

        this.agendamentosHoje = agendamentos.filter(a => {
          const dataAgendamento = new Date(a.dataHora);
          return dataAgendamento >= hoje && dataAgendamento <= fimHoje;
        });

        this.agendamentosConfirmados = this.agendamentosHoje.filter(
          a => a.status === StatusAgendamento.CONFIRMADO || a.status === StatusAgendamento.EM_ANDAMENTO
        ).length;

        this.receitaHoje = this.agendamentosHoje
          .filter(a => a.status === StatusAgendamento.CONCLUIDO)
          .reduce((total, a) => total + (a.valorTotal || 0), 0);

        // Calcular receitas por forma de pagamento
        this.agendamentosHoje
          .filter(a => a.status === StatusAgendamento.CONCLUIDO)
          .forEach(a => {
            if (a.formaPagamento === 'PIX') {
              this.receitasPorPagamento.pix += a.valorTotal || 0;
            } else if (a.formaPagamento === 'CARTAO_CREDITO' || a.formaPagamento === 'CARTAO_DEBITO') {
              this.receitasPorPagamento.cartao += a.valorTotal || 0;
            } else if (a.formaPagamento === 'DINHEIRO') {
              this.receitasPorPagamento.dinheiro += a.valorTotal || 0;
            }
          });

        const totalReceitas = this.receitasPorPagamento.pix + 
                             this.receitasPorPagamento.cartao + 
                             this.receitasPorPagamento.dinheiro;
        
        if (totalReceitas > 0) {
          this.percentualPix = Math.round((this.receitasPorPagamento.pix / totalReceitas) * 100);
          this.percentualCartao = Math.round((this.receitasPorPagamento.cartao / totalReceitas) * 100);
          this.percentualDinheiro = Math.round((this.receitasPorPagamento.dinheiro / totalReceitas) * 100);
        }
      }
    });

    // Carregar clientes
    this.clienteService.listarTodos().subscribe({
      next: (clientes) => {
        this.totalClientes = clientes.length;
        const inicioMes = new Date();
        inicioMes.setDate(1);
        this.novosClientesMes = clientes.filter(c => {
          if (!c.dataCadastro) return false;
          return new Date(c.dataCadastro) >= inicioMes;
        }).length;
      }
    });
  }

  getServicosNome(agendamento: Agendamento): string {
    if (agendamento.servicos && agendamento.servicos.length > 0) {
      return agendamento.servicos.map(s => s.nome).join(', ');
    }
    return 'Serviço';
  }

  getValorFormatado(valor: number): string {
    return valor.toFixed(2);
  }
}

