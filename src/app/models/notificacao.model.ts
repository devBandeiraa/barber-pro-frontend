export enum TipoNotificacao {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL'
}

export interface Notificacao {
  id?: number;
  agendamentoId: number;
  tipo: TipoNotificacao;
  destinatario: string;
  mensagem: string;
  enviado: boolean;
  dataEnvio?: string;
  erro?: string;
}

export interface ConfiguracaoNotificacao {
  id?: number;
  tipo: TipoNotificacao;
  ativo: boolean;
  enviarConfirmacao: boolean;
  enviarLembrete: boolean;
  horasAntecedenciaLembrete: number;
  templateMensagem?: string;
}

