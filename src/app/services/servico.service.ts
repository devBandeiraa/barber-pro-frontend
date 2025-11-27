import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from '../models/servico.model';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private apiUrl = 'http://localhost:8080/api/servicos';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }
}

