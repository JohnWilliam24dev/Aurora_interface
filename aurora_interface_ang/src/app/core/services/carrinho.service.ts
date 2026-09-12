import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Carrinho, CarrinhoDTO, carrinhoFromDTO, carrinhoToDTO } from '../models/carrinho.model';

/** Substitui Gateway/CarrinhoGateway.js. */
@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/carrinho`;

  listarTodos(): Observable<Carrinho[]> {
    return this.http
      .get<CarrinhoDTO[]>(this.baseUrl)
      .pipe(map((lista) => lista.map(carrinhoFromDTO)));
  }

  buscarPorId(id: number | string): Observable<Carrinho> {
    return this.http.get<CarrinhoDTO>(`${this.baseUrl}/${id}`).pipe(map(carrinhoFromDTO));
  }

  criar(carrinho: Carrinho): Observable<Carrinho> {
    return this.http
      .post<CarrinhoDTO>(this.baseUrl, carrinhoToDTO(carrinho))
      .pipe(map(carrinhoFromDTO));
  }

  atualizar(id: number | string, carrinho: Carrinho): Observable<Carrinho> {
    return this.http
      .put<CarrinhoDTO>(`${this.baseUrl}/${id}`, carrinhoToDTO(carrinho))
      .pipe(map(carrinhoFromDTO));
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
