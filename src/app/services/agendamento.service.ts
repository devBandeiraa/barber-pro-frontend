import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento, AgendamentoRequest } from '../models/agendamento.model';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = 'http://localhost:8080/api/agendamentos';

  constructor(private http: HttpClient) { }

  criarAgendamento(request: AgendamentoRequest): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.apiUrl, request);
  }

  listarTodos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.apiUrl);
  }

  listarPorCliente(clienteId: number): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  buscarPorId(id: number): Observable<Agendamento> {
    return this.http.get<Agendamento>(`${this.apiUrl}/${id}`);
  }
}

