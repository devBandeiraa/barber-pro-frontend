import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cadastro-container">
      <div class="form-header">
        <div class="icon-wrapper">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h2>Informações do Cliente</h2>
        <p class="subtitle">Digite seu nome e telefone para continuar</p>
      </div>
      
      <form (ngSubmit)="onSubmit()" #clienteForm="ngForm">
        <div class="form-group">
          <label for="nome">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Nome Completo *
          </label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            [(ngModel)]="nome" 
            required
            placeholder="Digite seu nome completo"
            class="form-input"
            autocomplete="name"
          >
        </div>

        <div class="form-group">
          <label for="telefone">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Telefone *
          </label>
          <input 
            type="tel" 
            id="telefone" 
            name="telefone" 
            [(ngModel)]="telefone" 
            required
            placeholder="(11) 99999-9999"
            maxlength="15"
            class="form-input"
            autocomplete="tel"
            (input)="formatarTelefone($event)"
          >
        </div>

        <div *ngIf="error" class="error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>

        <button type="submit" [disabled]="!clienteForm.valid || loading" class="btn-primary">
          <span *ngIf="loading" class="button-content">
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Processando...
          </span>
          <span *ngIf="!loading" class="button-content">
            Próximo: Escolher Serviços
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .cadastro-container {
      max-width: 550px;
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

    .form-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--spacing-lg);
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 10px 30px rgba(1, 37, 125, 0.3);
      animation: pulse 2s ease-in-out infinite, float 3s ease-in-out infinite;
      position: relative;
      overflow: hidden;
    }

    .icon-wrapper::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: rotate(45deg);
      animation: shine 3s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 10px 30px rgba(1, 37, 125, 0.3);
      }
      50% {
        transform: scale(1.08);
        box-shadow: 0 15px 40px rgba(1, 37, 125, 0.4);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes shine {
      0% {
        left: -100%;
      }
      50%, 100% {
        left: 100%;
      }
    }

    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 0;
      font-size: 1rem;
      margin-top: var(--spacing-sm);
    }

    .form-group {
      margin-bottom: var(--spacing-xl);
      animation: fadeIn 0.5s ease-out backwards;
    }

    .form-group:nth-child(1) {
      animation-delay: 0.1s;
    }

    .form-group:nth-child(2) {
      animation-delay: 0.2s;
    }

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
      padding: 14px 18px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      font-size: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: var(--bg-primary);
      color: var(--text-primary);
      position: relative;
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
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
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

    .btn-primary:active {
      transform: translateY(-1px);
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

    .error {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      animation: shake 0.5s ease-in-out, slideInDown 0.4s ease-out;
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
      padding: var(--spacing-md);
      border-radius: var(--radius-lg);
      border-left: 4px solid var(--danger-color);
      margin-bottom: var(--spacing-md);
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class CadastroClienteComponent {
  nome: string = '';
  telefone: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private router: Router) {}

  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length <= 11) {
      if (valor.length <= 10) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
      this.telefone = valor;
    }
  }

  onSubmit() {
    this.error = '';
    this.loading = true;

    // Validar telefone
    const telefoneLimpo = this.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      this.error = 'Telefone inválido. Digite pelo menos 10 dígitos.';
      this.loading = false;
      return;
    }

    // Salvar no localStorage
    const clienteInfo = {
      nome: this.nome,
      telefone: telefoneLimpo
    };

    localStorage.setItem('clienteInfo', JSON.stringify(clienteInfo));
    
    setTimeout(() => {
      this.router.navigate(['/servicos']);
    }, 300);
  }
}
