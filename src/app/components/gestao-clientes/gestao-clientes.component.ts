import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { Cliente, HistoricoAtendimento } from '../../models/cliente.model';
import { Agendamento } from '../../models/agendamento.model';

@Component({
  selector: 'app-gestao-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gestao-container">
      <div class="header-section">
        <h2>Gestão de Clientes</h2>
        <button class="btn-primary" (click)="mostrarFormulario = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Cliente
        </button>
      </div>

      <div class="filtros">
        <input 
          type="text" 
          placeholder="Buscar cliente..." 
          [(ngModel)]="filtroBusca"
          (input)="filtrarClientes()"
          class="input-busca"
        >
      </div>

      <div class="clientes-grid">
        <div *ngFor="let cliente of clientesFiltrados" class="cliente-card">
          <div class="cliente-header">
            <div class="cliente-avatar">
              {{ cliente.nome.charAt(0).toUpperCase() }}
            </div>
            <div class="cliente-info">
              <h3>{{ cliente.nome }}</h3>
              <p>{{ cliente.telefone }}</p>
              <p *ngIf="cliente.email">{{ cliente.email }}</p>
            </div>
            <div class="cliente-stats">
              <div class="stat-item">
                <span class="stat-label">Pontos</span>
                <span class="stat-value">{{ cliente.pontosFidelidade || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Atendimentos</span>
                <span class="stat-value">{{ cliente.totalAtendimentos || 0 }}</span>
              </div>
            </div>
          </div>
          
          <div class="cliente-actions">
            <button (click)="verHistorico(cliente)" class="btn-action">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Histórico
            </button>
            <button (click)="editarCliente(cliente)" class="btn-action">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
          </div>

          <div *ngIf="cliente.preferencias" class="cliente-preferencias">
            <strong>Preferências:</strong> {{ cliente.preferencias }}
          </div>
        </div>
      </div>

      <!-- Modal Histórico -->
      <div *ngIf="clienteSelecionado" class="modal-overlay" (click)="fecharModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Histórico - {{ clienteSelecionado.nome }}</h3>
            <button (click)="fecharModal()" class="btn-close">×</button>
          </div>
          <div class="modal-body">
            <div *ngIf="historico.length === 0" class="empty-state">
              Nenhum atendimento registrado
            </div>
            <div *ngFor="let item of historico" class="historico-item">
              <div class="historico-data">{{ item.dataHora | date:'dd/MM/yyyy HH:mm' }}</div>
              <div class="historico-detalhes">
                <strong>{{ item.servico }}</strong> - {{ item.barbeiro }}
                <span class="historico-valor">R$ {{ item.valor.toFixed(2) }}</span>
              </div>
              <span class="status-badge" [class]="item.status">{{ item.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gestao-container {
      animation: fadeInUp 0.5s ease-out;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .filtros {
      margin-bottom: var(--spacing-xl);
    }

    .input-busca {
      width: 100%;
      max-width: 500px;
      padding: 12px 16px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      font-size: 16px;
    }

    .clientes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-lg);
    }

    .cliente-card {
      background: var(--bg-primary);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      transition: all var(--transition-base);
    }

    .cliente-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .cliente-header {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .cliente-avatar {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .cliente-info {
      flex: 1;
    }

    .cliente-info h3 {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: 1.25rem;
    }

    .cliente-info p {
      margin: 4px 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .cliente-stats {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .stat-item {
      text-align: center;
      padding: var(--spacing-sm);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
    }

    .stat-label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .stat-value {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .cliente-actions {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);
    }

    .btn-action {
      flex: 1;
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      cursor: pointer;
      transition: all var(--transition-base);
      font-size: 0.875rem;
    }

    .btn-action:hover {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .cliente-preferencias {
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--spacing-xl);
    }

    .modal-content {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-2xl);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xl);
      border-bottom: 2px solid var(--border-color);
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: var(--text-secondary);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      transition: all var(--transition-base);
    }

    .btn-close:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .modal-body {
      padding: var(--spacing-xl);
    }

    .historico-item {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-md);
    }

    .historico-item:last-child {
      border-bottom: none;
    }

    .historico-data {
      font-size: 0.875rem;
      color: var(--text-secondary);
      min-width: 140px;
    }

    .historico-detalhes {
      flex: 1;
    }

    .historico-valor {
      display: block;
      font-weight: 700;
      color: var(--success-color);
      margin-top: 4px;
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--text-secondary);
    }
  `]
})
export class GestaoClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  historico: HistoricoAtendimento[] = [];
  clienteSelecionado: Cliente | null = null;
  filtroBusca: string = '';
  mostrarFormulario: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.listarTodos().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = clientes;
      },
      error: (err) => console.error('Erro ao carregar clientes:', err)
    });
  }

  filtrarClientes() {
    if (!this.filtroBusca) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    const busca = this.filtroBusca.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nome.toLowerCase().includes(busca) ||
      c.telefone.includes(busca) ||
      (c.email && c.email.toLowerCase().includes(busca))
    );
  }

  verHistorico(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.agendamentoService.listarPorCliente(cliente.id!).subscribe({
      next: (agendamentos) => {
        this.historico = agendamentos.map(a => ({
          id: a.id,
          dataHora: a.dataHora,
          servico: a.servicos?.map(s => s.nome).join(', ') || 'Serviço',
          barbeiro: a.barbeiro.nome,
          valor: a.valorTotal || 0,
          status: a.status || 'CONCLUIDO'
        }));
      },
      error: (err) => console.error('Erro ao carregar histórico:', err)
    });
  }

  editarCliente(cliente: Cliente) {
    // Implementar edição
    console.log('Editar cliente:', cliente);
  }

  fecharModal() {
    this.clienteSelecionado = null;
    this.historico = [];
  }
}

