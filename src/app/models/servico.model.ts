export interface Servico {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  fotoUrl?: string;
  categoria?: string;
  ativo?: boolean;
  ordem?: number;
}

export interface ComboServico {
  id?: number;
  nome: string;
  descricao: string;
  servicos: Servico[];
  precoTotal: number;
  desconto?: number;
  fotoUrl?: string;
  ativo?: boolean;
}

