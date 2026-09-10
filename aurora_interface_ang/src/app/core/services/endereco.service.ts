import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Endereco } from '../models/endereco.model';

/** Substitui EnderecoGateway + CadastroEnderecoService (legado). */
@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/endereco`;

  listarTodos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.baseUrl);
  }

  buscarPorId(id: number | string): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.baseUrl}/${id}`);
  }

  cadastrar(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(this.baseUrl, endereco);
  }

  atualizar(id: number | string, endereco: Endereco): Observable<Endereco> {
    return this.http.put<Endereco>(`${this.baseUrl}/${id}`, endereco);
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
