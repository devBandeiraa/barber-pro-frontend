import { Cliente } from './cliente.model';
import { Servico } from './servico.model';
import { Barbeiro } from './barbeiro.model';

export enum StatusAgendamento {
  AGENDADO = 'AGENDADO',
  CONFIRMADO = 'CONFIRMADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
  FALTOU = 'FALTOU'
}

export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  PIX = 'PIX',
  OUTRO = 'OUTRO'
}

export interface Agendamento {
  id?: number;
  cliente: Cliente;
  servicos: Servico[];
  barbeiro: Barbeiro;
  dataHora: string;
  observacoes?: string;
  status?: StatusAgendamento;
  dataCriacao?: string;
  dataConfirmacao?: string;
  dataConclusao?: string;
  formaPagamento?: FormaPagamento;
  valorTotal?: number;
  comissaoBarbeiro?: number;
  notificado?: boolean;
  lembreteEnviado?: boolean;
}

export interface AgendamentoRequest {
  clienteId?: number;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail?: string;
  servicoIds: number[];
  barbeiroId: number;
  dataHora: string;
  observacoes?: string;
  formaPagamento?: FormaPagamento;
}

export interface BloqueioAgenda {
  id?: number;
  barbeiroId: number;
  dataInicio: string;
  dataFim: string;
  motivo: string;
  tipo: 'FERIAS' | 'FOLGA' | 'BLOQUEIO' | 'OUTRO';
}
