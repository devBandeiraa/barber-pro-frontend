import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacao, TipoNotificacao, ConfiguracaoNotificacao } from '../models/notificacao.model';
import { Servico } from '../models/servico.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private apiUrl = 'http://localhost:8080/api/notificacoes';

  constructor(private http: HttpClient) { }

  enviarConfirmacao(agendamentoId: number, tipo: TipoNotificacao): Observable<Notificacao> {
    return this.http.post<Notificacao>(`${this.apiUrl}/confirmacao`, {
      agendamentoId,
      tipo
    });
  }

  enviarLembrete(agendamentoId: number, tipo: TipoNotificacao): Observable<Notificacao> {
    return this.http.post<Notificacao>(`${this.apiUrl}/lembrete`, {
      agendamentoId,
      tipo
    });
  }

  enviarWhatsApp(telefone: string, mensagem: string): Observable<any> {
    // Integração com API do WhatsApp (ex: Twilio, Evolution API, etc.)
    const whatsappUrl = `https://wa.me/${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  enviarSMS(telefone: string, mensagem: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sms`, {
      telefone,
      mensagem
    });
  }

  enviarEmail(email: string, assunto: string, mensagem: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/email`, {
      email,
      assunto,
      mensagem
    });
  }

  getConfiguracoes(): Observable<ConfiguracaoNotificacao[]> {
    return this.http.get<ConfiguracaoNotificacao[]>(`${this.apiUrl}/configuracoes`);
  }

  atualizarConfiguracao(config: ConfiguracaoNotificacao): Observable<ConfiguracaoNotificacao> {
    return this.http.put<ConfiguracaoNotificacao>(`${this.apiUrl}/configuracoes/${config.id}`, config);
  }

  gerarMensagemConfirmacao(agendamento: any): string {
    const data = new Date(agendamento.dataHora);
    const dataFormatada = data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const servicosNome = agendamento.servicos && agendamento.servicos.length > 0
      ? agendamento.servicos.map((s: Servico) => s.nome).join(', ')
      : 'Serviço';

    return `✅ Agendamento Confirmado!\n\n` +
           `Olá ${agendamento.cliente.nome}!\n\n` +
           `Seu agendamento foi confirmado:\n` +
           `📅 Data: ${dataFormatada}\n` +
           `💇 Barbeiro: ${agendamento.barbeiro.nome}\n` +
           `✂️ Serviço: ${servicosNome}\n` +
           `💰 Valor: R$ ${(agendamento.valorTotal || 0).toFixed(2)}\n\n` +
           `Nos vemos em breve!`;
  }

  gerarMensagemLembrete(agendamento: any): string {
    const data = new Date(agendamento.dataHora);
    const dataFormatada = data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const servicosNome = agendamento.servicos && agendamento.servicos.length > 0
      ? agendamento.servicos.map((s: Servico) => s.nome).join(', ')
      : 'Serviço';

    return `⏰ Lembrete de Agendamento\n\n` +
           `Olá ${agendamento.cliente.nome}!\n\n` +
           `Este é um lembrete do seu agendamento:\n` +
           `📅 Data: ${dataFormatada}\n` +
           `💇 Barbeiro: ${agendamento.barbeiro.nome}\n` +
           `✂️ Serviço: ${servicosNome}\n\n` +
           `Te esperamos!`;
  }
}

