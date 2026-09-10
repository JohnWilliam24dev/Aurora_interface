import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Carrinho } from '../models/carrinho.model';

/** Substitui Gateway/CarrinhoGateway.js. */
@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/carrinho`;

  listarTodos(): Observable<Carrinho[]> {
    return this.http.get<Carrinho[]>(this.baseUrl);
  }

  buscarPorId(id: number | string): Observable<Carrinho> {
    return this.http.get<Carrinho>(`${this.baseUrl}/${id}`);
  }

  criar(carrinho: Carrinho): Observable<Carrinho> {
    return this.http.post<Carrinho>(this.baseUrl, carrinho);
  }

  atualizar(id: number | string, carrinho: Carrinho): Observable<Carrinho> {
    return this.http.put<Carrinho>(`${this.baseUrl}/${id}`, carrinho);
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
