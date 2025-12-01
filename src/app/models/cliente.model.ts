export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento?: string;
  dataCadastro?: string;
  preferencias?: string;
  observacoes?: string;
  pontosFidelidade?: number;
  totalAtendimentos?: number;
  ultimoAtendimento?: string;
}

export interface HistoricoAtendimento {
  id?: number;
  dataHora: string;
  servico: string;
  barbeiro: string;
  valor: number;
  status: string;
}

