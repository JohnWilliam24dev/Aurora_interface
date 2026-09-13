import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  function executarGuard(allow?: string[]) {
    return TestBed.runInInjectionContext(() =>
      authGuard({ data: { allow } } as never, {} as never),
    );
  }

  it("permite rotas 'public' independente da sessão", () => {
    expect(executarGuard(['public'])).toBe(true);
  });

  it("sem 'allow' definido, o padrão é 'public' (permite)", () => {
    expect(executarGuard(undefined)).toBe(true);
  });

  it("'guest-only' permite quando deslogado", () => {
    expect(executarGuard(['guest-only'])).toBe(true);
  });

  it("'guest-only' bloqueia quando já logado como consumidor", () => {
    sessionStorage.setItem('userType', 'costumer');
    sessionStorage.setItem('clienteInfo', JSON.stringify({ nomeCompleto: 'Ana' }));
    expect(executarGuard(['guest-only'])).not.toBe(true);
  });

  it("permite 'costumer' quando a sessão é de consumidor", () => {
    sessionStorage.setItem('userType', 'costumer');
    sessionStorage.setItem('clienteInfo', JSON.stringify({ nomeCompleto: 'Ana' }));
    expect(executarGuard(['costumer'])).toBe(true);
  });

  it("bloqueia consumidor tentando acessar rota restrita a um cargo", () => {
    sessionStorage.setItem('userType', 'costumer');
    sessionStorage.setItem('clienteInfo', JSON.stringify({ nomeCompleto: 'Ana' }));
    expect(executarGuard(['ADMINISTRADOR_GERAL'])).not.toBe(true);
  });

  it('permite funcionário com cargo correspondente', () => {
    sessionStorage.setItem('userType', 'employer');
    sessionStorage.setItem(
      'clienteInfo',
      JSON.stringify({ nomeCompleto: 'João', cargo: 'GERENCIADOR_ROUPAS' }),
    );
    expect(executarGuard(['ADMINISTRADOR_GERAL', 'GERENCIADOR_ROUPAS'])).toBe(true);
  });

  it('bloqueia funcionário com cargo diferente do exigido pela rota', () => {
    sessionStorage.setItem('userType', 'employer');
    sessionStorage.setItem(
      'clienteInfo',
      JSON.stringify({ nomeCompleto: 'João', cargo: 'GERENCIADOR_FUNCIONARIOS' }),
    );
    expect(executarGuard(['ADMINISTRADOR_GERAL'])).not.toBe(true);
  });

  it('bloqueia visitante deslogado tentando acessar rota restrita', () => {
    expect(executarGuard(['costumer'])).not.toBe(true);
  });
});
