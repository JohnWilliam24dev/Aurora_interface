import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ItemCarrinho } from '../models/carrinho.model';

/** Substitui Gateway/ItemCarrinhoGateway.js. */
@Injectable({ providedIn: 'root' })
export class ItemCarrinhoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/itemCarrinho`;

  listarTodos(): Observable<ItemCarrinho[]> {
    return this.http.get<ItemCarrinho[]>(this.baseUrl);
  }

  buscarPorId(id: number | string): Observable<ItemCarrinho> {
    return this.http.get<ItemCarrinho>(`${this.baseUrl}/${id}`);
  }

  criar(item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.post<ItemCarrinho>(this.baseUrl, item);
  }

  atualizar(id: number | string, item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.put<ItemCarrinho>(`${this.baseUrl}/${id}`, item);
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
