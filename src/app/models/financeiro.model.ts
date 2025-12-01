export interface TransacaoFinanceira {
  id?: number;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  formaPagamento: string;
  agendamentoId?: number;
  observacoes?: string;
}

export interface RelatorioFinanceiro {
  periodo: string;
  receitas: number;
  despesas: number;
  lucro: number;
  totalAgendamentos: number;
  ticketMedio: number;
  receitasPorFormaPagamento: {
    dinheiro: number;
    cartaoCredito: number;
    cartaoDebito: number;
    pix: number;
    outro: number;
  };
}

export interface ComissaoBarbeiro {
  barbeiroId: number;
  barbeiroNome: string;
  totalServicos: number;
  valorTotal: number;
  comissao: number;
  percentualComissao: number;
}

