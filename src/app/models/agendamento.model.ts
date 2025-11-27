import { Cliente } from './cliente.model';
import { Servico } from './servico.model';
import { Barbeiro } from './barbeiro.model';

export interface Agendamento {
  id?: number;
  cliente: Cliente;
  servico: Servico;
  barbeiro: Barbeiro;
  dataHora: string;
  observacoes?: string;
  status?: string;
  dataCriacao?: string;
}

export interface AgendamentoRequest {
  clienteId: number;
  servicoId: number;
  barbeiroId: number;
  dataHora: string;
  observacoes?: string;
}

