import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteDTO, clienteFromDTO, clienteToDTO } from '../models/cliente.model';

/**
 * Substitui, de forma consolidada, o `ClienteGateway` + os services finos
 * legados (`CadastroClienteService`, `LoginConsumidorService`).
 */
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cliente`;

  listarTodos(): Observable<Cliente[]> {
    return this.http
      .get<ClienteDTO[]>(this.baseUrl)
      .pipe(map((lista) => lista.map(clienteFromDTO)));
  }

  buscarPorId(id: number | string): Observable<Cliente> {
    return this.http.get<ClienteDTO>(`${this.baseUrl}/${id}`).pipe(map(clienteFromDTO));
  }

  buscarPorEmail(email: string): Observable<Cliente> {
    return this.http
      .get<ClienteDTO>(`${this.baseUrl}/email/${email}`)
      .pipe(map(clienteFromDTO));
  }

  cadastrar(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post<ClienteDTO>(this.baseUrl, clienteToDTO(cliente))
      .pipe(map(clienteFromDTO));
  }

  atualizar(id: number | string, cliente: Cliente): Observable<Cliente> {
    return this.http
      .put<ClienteDTO>(`${this.baseUrl}/${id}`, clienteToDTO(cliente))
      .pipe(map(clienteFromDTO));
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Substitui `LoginConsumidorService.verificar_login`.
   *
   * Mesmo comportamento do legado: busca o cliente por email e compara a
   * senha em texto puro no front. Retorna `null` quando as credenciais não
   * conferem, em vez de lançar erro — o chamador decide a mensagem exibida.
   */
  login(email: string, senha: string): Observable<Cliente | null> {
    return this.buscarPorEmail(email).pipe(
      map((cliente) => (cliente && cliente.senha === senha ? cliente : null)),
    );
  }
}
