import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { AgendamentoRequest } from '../../models/agendamento.model';
import { Cliente } from '../../models/cliente.model';
import { Servico } from '../../models/servico.model';
import { Barbeiro } from '../../models/barbeiro.model';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="agendamento-container">
      <h2>Agendar Horário</h2>

      <div class="resumo">
        <div class="resumo-item">
          <strong>Cliente:</strong> {{ cliente?.nome }}
        </div>
        <div class="resumo-item">
          <strong>Serviço:</strong> {{ servico?.nome }} - R$ {{ servico?.preco.toFixed(2) }}
        </div>
        <div class="resumo-item">
          <strong>Barbeiro:</strong> {{ barbeiro?.nome }}
        </div>
      </div>

      <form (ngSubmit)="onSubmit()" #agendamentoForm="ngForm">
        <div class="form-group">
          <label for="dataHora">Data e Hora *</label>
          <input 
            type="datetime-local" 
            id="dataHora" 
            name="dataHora" 
            [(ngModel)]="dataHora" 
            required
            [min]="minDateTime"
          >
        </div>

        <div class="form-group">
          <label for="observacoes">Observações (opcional)</label>
          <textarea 
            id="observacoes" 
            name="observacoes" 
            [(ngModel)]="observacoes"
            rows="4"
            placeholder="Alguma observação especial sobre o atendimento..."
          ></textarea>
        </div>

        <div *ngIf="error" class="error">{{ error }}</div>
        <div *ngIf="success" class="success">{{ success }}</div>

        <button type="submit" [disabled]="!agendamentoForm.valid || loading">
          <span *ngIf="loading">Agendando...</span>
          <span *ngIf="!loading">Confirmar Agendamento</span>
        </button>
      </form>

      <button (click)="voltar()" class="btn-voltar">Voltar</button>
    </div>
  `,
  styles: [`
    .agendamento-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .resumo {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      border-left: 4px solid #667eea;
    }

    .resumo-item {
      margin-bottom: 10px;
      color: #333;
    }

    .resumo-item:last-child {
      margin-bottom: 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    input, textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    button {
      width: 100%;
      margin-top: 10px;
    }

    .btn-voltar {
      background: #6c757d;
      margin-top: 10px;
    }

    .btn-voltar:hover {
      background: #5a6268;
    }
  `]
})
export class AgendamentoComponent implements OnInit {
  cliente: Cliente | null = null;
  servico: Servico | null = null;
  barbeiro: Barbeiro | null = null;
  dataHora: string = '';
  observacoes: string = '';
  minDateTime: string = '';
  error: string = '';
  success: string = '';
  loading: boolean = false;

  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router
  ) {}

  ngOnInit() {
    // Carregar dados do localStorage
    const clienteStr = localStorage.getItem('cliente');
    const servicoStr = localStorage.getItem('servico');
    const barbeiroStr = localStorage.getItem('barbeiro');

    if (!clienteStr || !servicoStr || !barbeiroStr) {
      this.router.navigate(['/cadastro']);
      return;
    }

    this.cliente = JSON.parse(clienteStr);
    this.servico = JSON.parse(servicoStr);
    this.barbeiro = JSON.parse(barbeiroStr);

    // Definir data mínima como hoje
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTime = now.toISOString().slice(0, 16);
  }

  onSubmit() {
    if (!this.cliente?.id || !this.servico?.id || !this.barbeiro?.id || !this.dataHora) {
      this.error = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.error = '';
    this.success = '';
    this.loading = true;

    const request: AgendamentoRequest = {
      clienteId: this.cliente.id,
      servicoId: this.servico.id,
      barbeiroId: this.barbeiro.id,
      dataHora: new Date(this.dataHora).toISOString(),
      observacoes: this.observacoes || undefined
    };

    this.agendamentoService.criarAgendamento(request).subscribe({
      next: (agendamento) => {
        this.success = 'Agendamento realizado com sucesso!';
        localStorage.removeItem('cliente');
        localStorage.removeItem('servico');
        localStorage.removeItem('barbeiro');
        setTimeout(() => {
          this.router.navigate(['/cadastro']);
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

