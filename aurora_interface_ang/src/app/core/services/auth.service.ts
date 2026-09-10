import { Injectable, computed, signal } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { Cargo, Funcionario } from '../models/funcionario.model';

export type UserType = 'costumer' | 'employer' | 'deslogado';

export interface SessionInfo {
  userType: UserType;
  cliente: Cliente | Funcionario | null;
  cargo?: Cargo;
}

const STORAGE_USER_TYPE = 'userType';
const STORAGE_CLIENTE_INFO = 'clienteInfo';

/**
 * Substitui Persistence/VerificarPersistence.js e Persistence/EncerrarSessao.js.
 *
 * Mantém as MESMAS chaves de `sessionStorage` usadas pela aplicação legada
 * (`userType` e `clienteInfo`) para que a sessão continue válida em ambas as
 * aplicações durante o período de migração (usuário pode transitar entre
 * páginas antigas e novas sem precisar logar de novo).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionSignal = signal<SessionInfo>(this.lerSessao());

  readonly session = this.sessionSignal.asReadonly();
  readonly estaLogado = computed(() => this.sessionSignal().userType !== 'deslogado');

  private lerSessao(): SessionInfo {
    const userType = sessionStorage.getItem(STORAGE_USER_TYPE) as UserType | null;
    const clienteJSON = sessionStorage.getItem(STORAGE_CLIENTE_INFO);

    if (!userType) {
      return { userType: 'deslogado', cliente: null };
    }

    const clienteInfo = clienteJSON ? JSON.parse(clienteJSON) : null;

    if (userType === 'costumer') {
      return { userType: 'costumer', cliente: clienteInfo };
    }

    if (userType === 'employer') {
      return { userType: 'employer', cliente: clienteInfo, cargo: clienteInfo?.cargo };
    }

    return { userType: 'deslogado', cliente: null };
  }

  iniciarSessaoConsumidor(cliente: Cliente): void {
    sessionStorage.setItem(STORAGE_CLIENTE_INFO, JSON.stringify(cliente));
    sessionStorage.setItem(STORAGE_USER_TYPE, 'costumer');
    this.sessionSignal.set({ userType: 'costumer', cliente });
  }

  iniciarSessaoFuncionario(funcionario: Funcionario): void {
    sessionStorage.setItem(STORAGE_CLIENTE_INFO, JSON.stringify(funcionario));
    sessionStorage.setItem(STORAGE_USER_TYPE, 'employer');
    this.sessionSignal.set({
      userType: 'employer',
      cliente: funcionario,
      cargo: funcionario.cargo,
    });
  }

  encerrarSessao(): void {
    sessionStorage.clear();
    this.sessionSignal.set({ userType: 'deslogado', cliente: null });
  }
}
