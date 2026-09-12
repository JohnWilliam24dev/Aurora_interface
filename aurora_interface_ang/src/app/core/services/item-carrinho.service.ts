import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ItemCarrinho,
  ItemCarrinhoDTO,
  itemCarrinhoFromDTO,
  itemCarrinhoToDTO,
} from '../models/carrinho.model';

/** Substitui Gateway/ItemCarrinhoGateway.js. */
@Injectable({ providedIn: 'root' })
export class ItemCarrinhoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/itemCarrinho`;

  listarTodos(): Observable<ItemCarrinho[]> {
    return this.http
      .get<ItemCarrinhoDTO[]>(this.baseUrl)
      .pipe(map((lista) => lista.map(itemCarrinhoFromDTO)));
  }

  buscarPorId(id: number | string): Observable<ItemCarrinho> {
    return this.http
      .get<ItemCarrinhoDTO>(`${this.baseUrl}/${id}`)
      .pipe(map(itemCarrinhoFromDTO));
  }

  criar(item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http
      .post<ItemCarrinhoDTO>(this.baseUrl, itemCarrinhoToDTO(item))
      .pipe(map(itemCarrinhoFromDTO));
  }

  atualizar(id: number | string, item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http
      .put<ItemCarrinhoDTO>(`${this.baseUrl}/${id}`, itemCarrinhoToDTO(item))
      .pipe(map(itemCarrinhoFromDTO));
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
