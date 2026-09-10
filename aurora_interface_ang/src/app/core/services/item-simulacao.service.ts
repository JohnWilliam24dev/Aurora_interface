import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ItemSimulacao } from '../models/carrinho.model';

/** Substitui Gateway/ItemSimulacaoGateway.js. */
@Injectable({ providedIn: 'root' })
export class ItemSimulacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/itemSimulacao`;

  listarTodos(): Observable<ItemSimulacao[]> {
    return this.http.get<ItemSimulacao[]>(this.baseUrl);
  }

  buscarPorId(id: number | string): Observable<ItemSimulacao> {
    return this.http.get<ItemSimulacao>(`${this.baseUrl}/${id}`);
  }

  criar(item: ItemSimulacao): Observable<ItemSimulacao> {
    return this.http.post<ItemSimulacao>(this.baseUrl, item);
  }

  atualizar(id: number | string, item: ItemSimulacao): Observable<ItemSimulacao> {
    return this.http.put<ItemSimulacao>(`${this.baseUrl}/${id}`, item);
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
