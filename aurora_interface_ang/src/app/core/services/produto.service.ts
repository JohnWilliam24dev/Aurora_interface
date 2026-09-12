import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produto, ProdutoDTO, ProdutoPayload, produtoFromDTO } from '../models/produto.model';

/**
 * Substitui, de forma consolidada, o `ProdutoGateway` + os `*Service` legados
 * (ListarProdutosService, ProdutoConsumidorService, AdicionarProdutoService,
 * EdicaoProdutoService, DeleteProdutoService), que apenas delegavam para o gateway.
 */
@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produto`;

  listarTodos(): Observable<Produto[]> {
    return this.http
      .get<ProdutoDTO[]>(this.baseUrl)
      .pipe(map((lista) => lista.map(produtoFromDTO)));
  }

  buscarPorId(id: number | string): Observable<Produto> {
    return this.http
      .get<ProdutoDTO>(`${this.baseUrl}/${id}`)
      .pipe(map(produtoFromDTO));
  }

  criar(payload: ProdutoPayload): Observable<Produto> {
    return this.http.post<ProdutoDTO>(this.baseUrl, payload).pipe(map(produtoFromDTO));
  }

  atualizar(id: number | string, payload: ProdutoPayload): Observable<Produto> {
    return this.http
      .put<ProdutoDTO>(`${this.baseUrl}/${id}`, payload)
      .pipe(map(produtoFromDTO));
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
