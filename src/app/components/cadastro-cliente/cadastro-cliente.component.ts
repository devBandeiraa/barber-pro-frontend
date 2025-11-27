import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cadastro-container">
      <h2>Cadastro de Cliente</h2>
      <form (ngSubmit)="onSubmit()" #clienteForm="ngForm">
        <div class="form-group">
          <label for="nome">Nome Completo *</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            [(ngModel)]="cliente.nome" 
            required
            placeholder="Digite seu nome completo"
          >
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            [(ngModel)]="cliente.email" 
            required
            placeholder="seu@email.com"
          >
        </div>

        <div class="form-group">
          <label for="telefone">Telefone *</label>
          <input 
            type="text" 
            id="telefone" 
            name="telefone" 
            [(ngModel)]="cliente.telefone" 
            required
            placeholder="(11) 99999-9999"
            maxlength="11"
          >
        </div>

        <div *ngIf="error" class="error">{{ error }}</div>
        <div *ngIf="success" class="success">{{ success }}</div>

        <button type="submit" [disabled]="!clienteForm.valid || loading">
          <span *ngIf="loading">Cadastrando...</span>
          <span *ngIf="!loading">Próximo: Escolher Serviço</span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .cadastro-container {
      max-width: 500px;
      margin: 0 auto;
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

    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    button {
      width: 100%;
      margin-top: 10px;
    }
  `]
})
export class CadastroClienteComponent {
  cliente: Cliente = {
    nome: '',
    email: '',
    telefone: ''
  };

  error: string = '';
  success: string = '';
  loading: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.clienteService.criarCliente(this.cliente).subscribe({
      next: (clienteSalvo) => {
        this.success = 'Cliente cadastrado com sucesso!';
        localStorage.setItem('clienteId', clienteSalvo.id!.toString());
        localStorage.setItem('cliente', JSON.stringify(clienteSalvo));
        setTimeout(() => {
          this.router.navigate(['/servicos']);
        }, 1000);
      },
      error: (err) => {
        this.error = 'Erro ao cadastrar cliente. Verifique os dados e tente novamente.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}

