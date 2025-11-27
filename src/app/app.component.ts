import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="container">
      <header>
        <h1>💈 Barber Pro</h1>
        <p style="color: #666; margin-bottom: 30px;">Sistema de Agendamento para Barbearia</p>
      </header>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    h1 {
      font-size: 2.5em;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `]
})
export class AppComponent {
  title = 'Barber Pro';
}

