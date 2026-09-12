import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ItemSimulacao,
  ItemSimulacaoDTO,
  itemSimulacaoFromDTO,
  itemSimulacaoToDTO,
} from '../models/carrinho.model';

/** Substitui Gateway/ItemSimulacaoGateway.js. */
@Injectable({ providedIn: 'root' })
export class ItemSimulacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/itemSimulacao`;

  listarTodos(): Observable<ItemSimulacao[]> {
    return this.http
      .get<ItemSimulacaoDTO[]>(this.baseUrl)
      .pipe(map((lista) => lista.map(itemSimulacaoFromDTO)));
  }

  buscarPorId(id: number | string): Observable<ItemSimulacao> {
    return this.http
      .get<ItemSimulacaoDTO>(`${this.baseUrl}/${id}`)
      .pipe(map(itemSimulacaoFromDTO));
  }

  criar(item: ItemSimulacao): Observable<ItemSimulacao> {
    return this.http
      .post<ItemSimulacaoDTO>(this.baseUrl, itemSimulacaoToDTO(item))
      .pipe(map(itemSimulacaoFromDTO));
  }

  atualizar(id: number | string, item: ItemSimulacao): Observable<ItemSimulacao> {
    return this.http
      .put<ItemSimulacaoDTO>(`${this.baseUrl}/${id}`, itemSimulacaoToDTO(item))
      .pipe(map(itemSimulacaoFromDTO));
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
