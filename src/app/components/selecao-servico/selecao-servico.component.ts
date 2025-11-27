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
      <h2>Escolha o Serviço</h2>
      
      <div *ngIf="loading" class="loading">Carregando serviços...</div>
      
      <div *ngIf="!loading && servicos.length === 0" class="error">
        Nenhum serviço disponível no momento.
      </div>

      <div class="servicos-grid">
        <div 
          *ngFor="let servico of servicos" 
          class="card servico-card"
          [class.selected]="servicoSelecionado?.id === servico.id"
          (click)="selecionarServico(servico)"
        >
          <h3>{{ servico.nome }}</h3>
          <p>{{ servico.descricao }}</p>
          <div class="servico-info">
            <span class="preco">R$ {{ servico.preco.toFixed(2) }}</span>
            <span class="duracao">⏱ {{ servico.duracaoMinutos }} min</span>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>

      <button 
        (click)="prosseguir()" 
        [disabled]="!servicoSelecionado"
        class="btn-prosseguir"
      >
        Próximo: Escolher Barbeiro
      </button>

      <button (click)="voltar()" class="btn-voltar">Voltar</button>
    </div>
  `,
  styles: [`
    .selecao-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .servicos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .servico-card {
      cursor: pointer;
      transition: all 0.3s;
    }

    .servico-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .servico-card.selected {
      border: 3px solid #667eea;
      background: #f0f4ff;
    }

    .servico-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
    }

    .preco {
      font-size: 1.5em;
      font-weight: bold;
      color: #667eea;
    }

    .duracao {
      color: #666;
      font-size: 0.9em;
    }

    .btn-prosseguir {
      width: 100%;
      margin-bottom: 10px;
    }

    .btn-voltar {
      width: 100%;
      background: #6c757d;
    }

    .btn-voltar:hover {
      background: #5a6268;
    }
  `]
})
export class SelecaoServicoComponent implements OnInit {
  servicos: Servico[] = [];
  servicoSelecionado: Servico | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private servicoService: ServicoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarServicos();
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

  selecionarServico(servico: Servico) {
    this.servicoSelecionado = servico;
    localStorage.setItem('servico', JSON.stringify(servico));
  }

  prosseguir() {
    if (this.servicoSelecionado) {
      this.router.navigate(['/barbeiros']);
    }
  }

  voltar() {
    this.router.navigate(['/cadastro']);
  }
}

