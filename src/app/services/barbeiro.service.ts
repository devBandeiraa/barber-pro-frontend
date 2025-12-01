import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Barbeiro } from '../models/barbeiro.model';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BarbeiroService {
  private apiUrl = 'http://localhost:8080/api/barbeiros';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Barbeiro[]> {
    return this.http.get<Barbeiro[]>(this.apiUrl);
  }

  listarAtivos(): Observable<Barbeiro[]> {
    return this.http.get<Barbeiro[]>(`${this.apiUrl}/ativos`);
  }

  buscarPorId(id: number): Observable<Barbeiro> {
    return this.http.get<Barbeiro>(`${this.apiUrl}/${id}`);
  }

  login(email: string, senha: string): Observable<LoginResponse> {
    const request: LoginRequest = { email, senha };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }
}

