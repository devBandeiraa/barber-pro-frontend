import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Agendamento } from '../../models/agendamento.model';

@Component({
  selector: 'app-calendario-agendamento',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="calendario-container">
      <div class="calendario-header">
        <button (click)="mesAnterior()" class="btn-nav">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h3>{{ mesAtual | date:'MMMM yyyy':'pt-BR' }}</h3>
        <button (click)="proximoMes()" class="btn-nav">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <div class="dias-semana">
        <div *ngFor="let dia of diasSemana" class="dia-semana">{{ dia }}</div>
      </div>

      <div class="calendario-grid">
        <div 
          *ngFor="let dia of diasDoMes" 
          class="dia-calendario"
          [class.dia-passado]="dia.passado"
          [class.dia-hoje]="dia.hoje"
          [class.dia-selecionado]="dia.selecionado"
          [class.dia-indisponivel]="dia.indisponivel"
          [class.dia-ocupado]="dia.ocupado"
          (click)="selecionarDia(dia)"
        >
          <span class="numero-dia">{{ dia.numero }}</span>
          <div *ngIf="dia.agendamentos > 0" class="badge-agendamentos">
            {{ dia.agendamentos }}
          </div>
        </div>
      </div>

      <div class="horarios-disponiveis" *ngIf="diaSelecionado">
        <h4>Horários Disponíveis - {{ diaSelecionado.data | date:'dd/MM/yyyy':'pt-BR' }}</h4>
        <div class="horarios-grid">
          <button
            *ngFor="let horario of horariosDisponiveis"
            class="btn-horario"
            [class.selecionado]="horarioSelecionado === horario"
            [class.indisponivel]="!horario.disponivel"
            (click)="selecionarHorario(horario)"
            [disabled]="!horario.disponivel"
          >
            {{ horario.hora }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendario-container {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
    }

    .calendario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
      border-bottom: 2px solid var(--border-color);
    }

    .calendario-header h3 {
      margin: 0;
      font-size: 1.5rem;
      text-transform: capitalize;
      color: var(--text-primary);
    }

    .btn-nav {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
      color: var(--text-primary);
    }

    .btn-nav:hover {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .dias-semana {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-sm);
    }

    .dia-semana {
      text-align: center;
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.875rem;
      padding: var(--spacing-sm);
    }

    .calendario-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--spacing-xs);
    }

    .dia-calendario {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      position: relative;
      background: var(--bg-primary);
    }

    .dia-calendario:hover:not(.dia-passado):not(.dia-indisponivel) {
      background: var(--bg-secondary);
      border-color: var(--primary-color);
      transform: scale(1.05);
    }

    .dia-passado {
      opacity: 0.4;
      cursor: not-allowed;
      background: var(--bg-tertiary);
    }

    .dia-hoje {
      border-color: var(--primary-color);
      background: rgba(102, 126, 234, 0.1);
      font-weight: 700;
    }

    .dia-selecionado {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border-color: var(--primary-color);
      font-weight: 700;
    }

    .dia-indisponivel {
      opacity: 0.3;
      cursor: not-allowed;
      background: var(--bg-tertiary);
    }

    .dia-ocupado {
      border-color: var(--warning-color);
    }

    .numero-dia {
      font-size: 1rem;
      font-weight: 500;
    }

    .badge-agendamentos {
      position: absolute;
      top: 4px;
      right: 4px;
      background: var(--primary-color);
      color: white;
      border-radius: var(--radius-full);
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .horarios-disponiveis {
      margin-top: var(--spacing-2xl);
      padding-top: var(--spacing-xl);
      border-top: 2px solid var(--border-color);
    }

    .horarios-disponiveis h4 {
      margin-bottom: var(--spacing-lg);
      color: var(--text-primary);
    }

    .horarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: var(--spacing-md);
    }

    .btn-horario {
      padding: var(--spacing-md);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-lg);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-horario:hover:not(:disabled) {
      background: var(--bg-secondary);
      border-color: var(--primary-color);
      transform: translateY(-2px);
    }

    .btn-horario.selecionado {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border-color: var(--primary-color);
    }

    .btn-horario:disabled,
    .btn-horario.indisponivel {
      opacity: 0.4;
      cursor: not-allowed;
      background: var(--bg-tertiary);
    }
  `]
})
export class CalendarioAgendamentoComponent implements OnInit {
  @Input() agendamentos: Agendamento[] = [];
  @Input() barbeiroId?: number;
  @Input() horarioInicio: string = '08:00';
  @Input() horarioFim: string = '18:00';
  @Input() intervaloMinutos: number = 30;
  @Output() dataHoraSelecionada = new EventEmitter<string>();

  dataAtual: Date = new Date();
  mesAtual: Date = new Date();
  diaSelecionado: any = null;
  horarioSelecionado: string = '';
  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  diasDoMes: any[] = [];
  horariosDisponiveis: any[] = [];

  ngOnInit() {
    this.gerarCalendario();
  }

  gerarCalendario() {
    const primeiroDia = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth(), 1);
    const ultimoDia = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaInicioSemana = primeiroDia.getDay();

    this.diasDoMes = [];

    // Dias vazios do início
    for (let i = 0; i < diaInicioSemana; i++) {
      this.diasDoMes.push({ numero: '', vazio: true });
    }

    // Dias do mês
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataDia = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth(), dia);
      const passado = dataDia < hoje;
      const hojeDia = dataDia.getTime() === hoje.getTime();
      
      const agendamentosDia = this.agendamentos.filter(a => {
        const dataAgendamento = new Date(a.dataHora);
        return dataAgendamento.toDateString() === dataDia.toDateString() &&
               (!this.barbeiroId || a.barbeiro.id === this.barbeiroId);
      });

      this.diasDoMes.push({
        numero: dia,
        data: dataDia,
        passado: passado,
        hoje: hojeDia,
        selecionado: false,
        indisponivel: false,
        ocupado: agendamentosDia.length > 0,
        agendamentos: agendamentosDia.length
      });
    }
  }

  selecionarDia(dia: any) {
    if (dia.vazio || dia.passado || dia.indisponivel) return;

    // Desmarcar dia anterior
    this.diasDoMes.forEach(d => d.selecionado = false);
    dia.selecionado = true;
    this.diaSelecionado = dia;
    this.gerarHorariosDisponiveis(dia);
  }

  gerarHorariosDisponiveis(dia: any) {
    const [horaInicio, minutoInicio] = this.horarioInicio.split(':').map(Number);
    const [horaFim, minutoFim] = this.horarioFim.split(':').map(Number);
    
    this.horariosDisponiveis = [];
    const dataSelecionada = new Date(dia.data);
    
    for (let hora = horaInicio; hora < horaFim; hora++) {
      for (let minuto = 0; minuto < 60; minuto += this.intervaloMinutos) {
        const horario = new Date(dataSelecionada);
        horario.setHours(hora, minuto, 0, 0);
        
        // Verificar se já passou (se for hoje)
        const agora = new Date();
        const passado = horario < agora && dataSelecionada.toDateString() === agora.toDateString();
        
        // Verificar se está ocupado
        const ocupado = this.agendamentos.some(a => {
          const dataAgendamento = new Date(a.dataHora);
          return dataAgendamento.getTime() === horario.getTime() &&
                 (!this.barbeiroId || a.barbeiro.id === this.barbeiroId);
        });

        this.horariosDisponiveis.push({
          hora: `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`,
          dataHora: horario.toISOString(),
          disponivel: !passado && !ocupado
        });
      }
    }
  }

  selecionarHorario(horario: any) {
    if (!horario.disponivel) return;
    this.horarioSelecionado = horario.hora;
    this.dataHoraSelecionada.emit(horario.dataHora);
  }

  mesAnterior() {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() - 1, 1);
    this.gerarCalendario();
  }

  proximoMes() {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
    this.gerarCalendario();
  }
}

