import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Endereco, EnderecoDTO, enderecoFromDTO, enderecoToDTO } from '../models/endereco.model';

/** Substitui EnderecoGateway + CadastroEnderecoService (legado). */
@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/endereco`;

  listarTodos(): Observable<Endereco[]> {
    return this.http
      .get<EnderecoDTO[]>(this.baseUrl)
      .pipe(map((lista) => lista.map(enderecoFromDTO)));
  }

  buscarPorId(id: number | string): Observable<Endereco> {
    return this.http.get<EnderecoDTO>(`${this.baseUrl}/${id}`).pipe(map(enderecoFromDTO));
  }

  cadastrar(endereco: Endereco): Observable<Endereco> {
    return this.http
      .post<EnderecoDTO>(this.baseUrl, enderecoToDTO(endereco))
      .pipe(map(enderecoFromDTO));
  }

  atualizar(id: number | string, endereco: Endereco): Observable<Endereco> {
    return this.http
      .put<EnderecoDTO>(`${this.baseUrl}/${id}`, enderecoToDTO(endereco))
      .pipe(map(enderecoFromDTO));
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
