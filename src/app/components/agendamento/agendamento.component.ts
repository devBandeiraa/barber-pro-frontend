import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { AgendamentoRequest, FormaPagamento } from '../../models/agendamento.model';
import { Servico } from '../../models/servico.model';
import { Barbeiro } from '../../models/barbeiro.model';
import { CalendarioAgendamentoComponent } from '../calendario-agendamento/calendario-agendamento.component';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarioAgendamentoComponent],
  template: `
    <div class="agendamento-container">
      <h2>Agendar Horário</h2>

      <div class="resumo">
        <div class="resumo-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <h3>Resumo do Agendamento</h3>
        </div>
        <div class="resumo-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <div>
            <strong>Cliente:</strong> {{ clienteNome }}
          </div>
        </div>
        <div class="resumo-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <div>
            <strong>Serviços:</strong> 
            <span *ngFor="let servico of servicos; let last = last">
              {{ servico.nome }}<span *ngIf="!last">, </span>
            </span>
          </div>
        </div>
        <div class="resumo-item highlight">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <div>
            <strong>Total:</strong> R$ {{ calcularTotal().toFixed(2) }}
          </div>
        </div>
        <div class="resumo-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <div>
            <strong>Barbeiro:</strong> {{ barbeiro?.nome }}
          </div>
        </div>
      </div>

      <div class="calendario-section">
        <h3>Selecione Data e Horário</h3>
        <app-calendario-agendamento
          [barbeiroId]="barbeiro?.id"
          [agendamentos]="agendamentosExistentes"
          (dataHoraSelecionada)="onDataHoraSelecionada($event)"
        ></app-calendario-agendamento>
      </div>

      <form (ngSubmit)="onSubmit()" #agendamentoForm="ngForm">
        <div class="form-group" *ngIf="dataHora">
          <label>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Data e Hora Selecionada
          </label>
          <input 
            type="text" 
            [value]="dataHora | date:'dd/MM/yyyy HH:mm':'pt-BR'"
            readonly
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label for="formaPagamento">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Forma de Pagamento
          </label>
          <select 
            id="formaPagamento" 
            name="formaPagamento" 
            [(ngModel)]="formaPagamento"
            class="form-input"
          >
            <option [value]="null">Selecione...</option>
            <option [value]="FormaPagamento.PIX">PIX</option>
            <option [value]="FormaPagamento.CARTAO_CREDITO">Cartão de Crédito</option>
            <option [value]="FormaPagamento.CARTAO_DEBITO">Cartão de Débito</option>
            <option [value]="FormaPagamento.DINHEIRO">Dinheiro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="observacoes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Observações (opcional)
          </label>
          <textarea 
            id="observacoes" 
            name="observacoes" 
            [(ngModel)]="observacoes"
            rows="4"
            placeholder="Alguma observação especial sobre o atendimento..."
            class="form-input"
          ></textarea>
        </div>

        <div *ngIf="error" class="error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>
        <div *ngIf="success" class="success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ success }}
        </div>

        <button type="submit" [disabled]="!agendamentoForm.valid || loading" class="btn-primary">
          <span *ngIf="loading" class="button-content">
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Agendando...
          </span>
          <span *ngIf="!loading" class="button-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Confirmar Agendamento
          </span>
        </button>
      </form>

      <button (click)="voltar()" class="btn-secondary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </button>
    </div>
  `,
  styles: [`
    .agendamento-container {
      max-width: 600px;
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

    .resumo {
      background: linear-gradient(135deg, rgba(1, 37, 125, 0.08) 0%, rgba(0, 255, 255, 0.05) 100%);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      margin-bottom: var(--spacing-2xl);
      border-left: 4px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(1, 37, 125, 0.1);
      animation: slideInLeft 0.5s ease-out;
      position: relative;
      overflow: hidden;
    }

    .resumo::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      animation: shimmer 3s ease-in-out infinite;
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

    @keyframes shimmer {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    .resumo-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
      border-bottom: 2px solid var(--border-light);
    }

    .resumo-header svg {
      color: var(--primary-color);
    }

    .resumo-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--text-primary);
    }

    .resumo-item {
      margin-bottom: var(--spacing-md);
      color: var(--text-primary);
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }

    .resumo-item:last-child {
      margin-bottom: 0;
    }

    .resumo-item svg {
      color: var(--primary-color);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .resumo-item.highlight {
      background: linear-gradient(135deg, rgba(1, 37, 125, 0.15) 0%, rgba(0, 255, 255, 0.1) 100%);
      padding: var(--spacing-md);
      border-radius: var(--radius-lg);
      margin-top: var(--spacing-md);
      animation: highlightPulse 2s ease-in-out infinite;
      border: 2px solid var(--primary-color);
    }

    @keyframes highlightPulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(1, 37, 125, 0.3);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(1, 37, 125, 0);
      }
    }

    .resumo-item.highlight svg {
      color: var(--success-color);
    }

    .resumo-item strong {
      color: var(--text-primary);
      margin-right: var(--spacing-xs);
    }

    .form-group {
      margin-bottom: 1.5rem;
      animation: fadeIn 0.5s ease-out backwards;
    }

    .form-group:nth-child(1) { animation-delay: 0.1s; }
    .form-group:nth-child(2) { animation-delay: 0.2s; }
    .form-group:nth-child(3) { animation-delay: 0.3s; }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
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
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .form-input:hover {
      border-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(1, 37, 125, 0.1);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(1, 37, 125, 0.15), 0 4px 12px rgba(1, 37, 125, 0.2);
      transform: translateY(-2px);
      animation: inputFocus 0.3s ease-out;
    }

    @keyframes inputFocus {
      0% {
        box-shadow: 0 0 0 0 rgba(1, 37, 125, 0.4);
      }
      100% {
        box-shadow: 0 0 0 4px rgba(1, 37, 125, 0.15), 0 4px 12px rgba(1, 37, 125, 0.2);
      }
    }

    .btn-primary {
      width: 100%;
      margin-top: var(--spacing-lg);
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
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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

    .btn-secondary {
      width: 100%;
      margin-top: var(--spacing-md);
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .btn-secondary:hover {
      background: var(--bg-tertiary);
      border-color: var(--text-secondary);
    }

    .calendario-section {
      margin-bottom: var(--spacing-2xl);
    }

    .calendario-section h3 {
      margin-bottom: var(--spacing-lg);
      color: var(--text-primary);
    }
  `]
})
export class AgendamentoComponent implements OnInit {
  clienteNome: string = '';
  clienteTelefone: string = '';
  servicos: Servico[] = [];
  barbeiro: Barbeiro | null = null;
  dataHora: string = '';
  observacoes: string = '';
  formaPagamento: FormaPagamento | null = null;
  minDateTime: string = '';
  error: string = '';
  success: string = '';
  loading: boolean = false;
  agendamentosExistentes: any[] = [];
  FormaPagamento = FormaPagamento;

  constructor(
    private agendamentoService: AgendamentoService,
    private notificacaoService: NotificacaoService,
    private router: Router
  ) {}

  ngOnInit() {
    // Carregar dados do localStorage
    const clienteInfoStr = localStorage.getItem('clienteInfo');
    const servicosStr = localStorage.getItem('servicosSelecionados');
    const barbeiroStr = localStorage.getItem('barbeiro');

    if (!clienteInfoStr || !servicosStr || !barbeiroStr) {
      this.router.navigate(['/cadastro']);
      return;
    }

    const clienteInfo = JSON.parse(clienteInfoStr);
    this.clienteNome = clienteInfo.nome;
    this.clienteTelefone = clienteInfo.telefone;
    this.servicos = JSON.parse(servicosStr);
    this.barbeiro = JSON.parse(barbeiroStr);

    // Definir data mínima como hoje
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTime = now.toISOString().slice(0, 16);

    // Carregar agendamentos existentes para o calendário
    this.carregarAgendamentosExistentes();
  }

  carregarAgendamentosExistentes() {
    if (this.barbeiro?.id) {
      this.agendamentoService.listarPorBarbeiro(this.barbeiro.id).subscribe({
        next: (agendamentos) => {
          this.agendamentosExistentes = agendamentos;
        },
        error: (err) => console.error('Erro ao carregar agendamentos:', err)
      });
    }
  }

  onDataHoraSelecionada(dataHora: string) {
    this.dataHora = dataHora;
  }

  calcularTotal(): number {
    return this.servicos.reduce((total, servico) => total + servico.preco, 0);
  }

  onSubmit() {
    if (!this.barbeiro?.id || this.servicos.length === 0 || !this.dataHora) {
      this.error = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.error = '';
    this.success = '';
    this.loading = true;

    const request: AgendamentoRequest = {
      clienteNome: this.clienteNome,
      clienteTelefone: this.clienteTelefone,
      servicoIds: this.servicos.map(s => s.id!),
      barbeiroId: this.barbeiro.id,
      dataHora: new Date(this.dataHora).toISOString(),
      observacoes: this.observacoes || undefined,
      formaPagamento: this.formaPagamento || undefined
    };

    this.agendamentoService.criarAgendamento(request).subscribe({
      next: (agendamento) => {
        this.success = 'Agendamento realizado com sucesso!';
        
        // Enviar notificação de confirmação
        if (this.clienteTelefone) {
          const mensagem = this.notificacaoService.gerarMensagemConfirmacao(agendamento);
          this.notificacaoService.enviarWhatsApp(this.clienteTelefone, mensagem).subscribe();
        }

        localStorage.removeItem('clienteInfo');
        localStorage.removeItem('servicosSelecionados');
        localStorage.removeItem('barbeiro');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erro ao realizar agendamento. Verifique se o horário está disponível.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  voltar() {
    this.router.navigate(['/barbeiros']);
  }
}
