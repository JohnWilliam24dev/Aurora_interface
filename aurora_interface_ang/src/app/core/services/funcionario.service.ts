import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Funcionario } from '../models/funcionario.model';

/**
 * Substitui, de forma consolidada, o `FuncionarioGateway` + os services finos
 * legados (`CadastroFuncionarioService`, `LoginFuncionarioService`).
 *
 * Diferente de `Produto`/`Cliente`, os campos de `Funcionario` já batem 1:1
 * com o formato da API, então não há necessidade de DTO/mapper separado.
 */
@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/funcionario`;

  listarTodos(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl);
  }

  buscarPorId(id: number | string): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`);
  }

  buscarPorCpf(cpf: string): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseUrl}/cpf/${cpf}`);
  }

  cadastrar(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.baseUrl, funcionario);
  }

  atualizar(id: number | string, funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.baseUrl}/${id}`, funcionario);
  }

  remover(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Substitui `LoginFuncionarioService.verificar_login`.
   *
   * Busca o funcionário por CPF e compara a senha em texto puro no front
   * (mesmo comportamento do legado). Retorna `null` se as credenciais não
   * conferem.
   */
  login(cpf: string, senha: string): Observable<Funcionario | null> {
    return this.buscarPorCpf(cpf).pipe(
      map((funcionario) => (funcionario && funcionario.senha === senha ? funcionario : null)),
    );
  }
}
