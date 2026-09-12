import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SimulacaoCompra,
  SimulacaoCompraDTO,
  simulacaoCompraFromDTO,
  simulacaoCompraToDTO,
} from '../models/carrinho.model';

/** Substitui Gateway/SimulacaoCompraGateway.js. */
@Injectable({ providedIn: 'root' })
export class SimulacaoCompraService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/simulacaoCompra`;

  listarTodos(): Observable<SimulacaoCompra[]> {
    return this.http
      .get<SimulacaoCompraDTO[]>(this.baseUrl)
      .pipe(map((lista) => lista.map(simulacaoCompraFromDTO)));
  }

  buscarPorId(id: number | string): Observable<SimulacaoCompra> {
    return this.http
      .get<SimulacaoCompraDTO>(`${this.baseUrl}/${id}`)
      .pipe(map(simulacaoCompraFromDTO));
  }

  criar(simulacao: SimulacaoCompra): Observable<SimulacaoCompra> {
    return this.http
      .post<SimulacaoCompraDTO>(this.baseUrl, simulacaoCompraToDTO(simulacao))
      .pipe(map(simulacaoCompraFromDTO));
  }

  atualizar(id: number | string, simulacao: SimulacaoCompra): Observable<SimulacaoCompra> {
    return this.http
      .put<SimulacaoCompraDTO>(`${this.baseUrl}/${id}`, simulacaoCompraToDTO(simulacao))
      .pipe(map(simulacaoCompraFromDTO));
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
