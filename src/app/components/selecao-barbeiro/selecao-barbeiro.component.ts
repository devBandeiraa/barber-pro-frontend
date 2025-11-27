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
      
      <div *ngIf="loading" class="loading">Carregando barbeiros...</div>
      
      <div *ngIf="!loading && barbeiros.length === 0" class="error">
        Nenhum barbeiro disponível no momento.
      </div>

      <div class="barbeiros-grid">
        <div 
          *ngFor="let barbeiro of barbeiros" 
          class="card barbeiro-card"
          [class.selected]="barbeiroSelecionado?.id === barbeiro.id"
          (click)="selecionarBarbeiro(barbeiro)"
        >
          <h3>💇 {{ barbeiro.nome }}</h3>
          <p *ngIf="barbeiro.especialidades" class="especialidades">
            {{ barbeiro.especialidades }}
          </p>
          <div class="barbeiro-info">
            <span>📧 {{ barbeiro.email }}</span>
            <span>📞 {{ barbeiro.telefone }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error">{{ error }}</div>

      <button 
        (click)="prosseguir()" 
        [disabled]="!barbeiroSelecionado"
        class="btn-prosseguir"
      >
        Próximo: Agendar Horário
      </button>

      <button (click)="voltar()" class="btn-voltar">Voltar</button>
    </div>
  `,
  styles: [`
    .selecao-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .barbeiros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .barbeiro-card {
      cursor: pointer;
      transition: all 0.3s;
    }

    .barbeiro-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .barbeiro-card.selected {
      border: 3px solid #667eea;
      background: #f0f4ff;
    }

    .especialidades {
      color: #666;
      font-style: italic;
      margin: 10px 0;
    }

    .barbeiro-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
      font-size: 0.9em;
      color: #666;
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
    this.barbeiroService.listarAtivos().subscribe({
      next: (barbeiros) => {
        this.barbeiros = barbeiros;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar barbeiros. Tente novamente.';
        this.loading = false;
        console.error(err);
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

