import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SimulacaoCompra } from '../models/carrinho.model';

/** Substitui Gateway/SimulacaoCompraGateway.js. */
@Injectable({ providedIn: 'root' })
export class SimulacaoCompraService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/simulacaoCompra`;

  listarTodos(): Observable<SimulacaoCompra[]> {
    return this.http.get<SimulacaoCompra[]>(this.baseUrl);
  }

  buscarPorId(id: number | string): Observable<SimulacaoCompra> {
    return this.http.get<SimulacaoCompra>(`${this.baseUrl}/${id}`);
  }

  criar(simulacao: SimulacaoCompra): Observable<SimulacaoCompra> {
    return this.http.post<SimulacaoCompra>(this.baseUrl, simulacao);
  }

  atualizar(id: number | string, simulacao: SimulacaoCompra): Observable<SimulacaoCompra> {
    return this.http.put<SimulacaoCompra>(`${this.baseUrl}/${id}`, simulacao);
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
