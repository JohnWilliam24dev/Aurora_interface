import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Cliente } from '../models/cliente.model';
import { Funcionario } from '../models/funcionario.model';

describe('AuthService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  function criarService(): AuthService {
    TestBed.configureTestingModule({});
    return TestBed.inject(AuthService);
  }

  it('começa deslogado quando não há nada no sessionStorage', () => {
    const auth = criarService();
    expect(auth.session().userType).toBe('deslogado');
    expect(auth.estaLogado()).toBe(false);
  });

  it('inicia sessão de consumidor e persiste nas MESMAS chaves do legado', () => {
    const auth = criarService();
    const cliente: Cliente = {
      id: 7,
      nomeCompleto: 'Maria Silva',
      email: 'maria@exemplo.com',
      senha: 'Abcdefg1!',
      carrinhoId: null,
    };

    auth.iniciarSessaoConsumidor(cliente);

    expect(auth.session().userType).toBe('costumer');
    expect(auth.estaLogado()).toBe(true);
    // Compatibilidade com o app legado: mesmas chaves de sessionStorage.
    expect(sessionStorage.getItem('userType')).toBe('costumer');
    expect(JSON.parse(sessionStorage.getItem('clienteInfo')!).nomeCompleto).toBe('Maria Silva');
  });

  it('inicia sessão de funcionário com cargo', () => {
    const auth = criarService();
    const funcionario: Funcionario = {
      id: 1,
      nomeCompleto: 'João Admin',
      email: 'joao@exemplo.com',
      senha: 'Abcdefg1!',
      cpf: '08526523654',
      cargo: 'ADMINISTRADOR_GERAL',
      status: null,
    };

    auth.iniciarSessaoFuncionario(funcionario);

    expect(auth.session().userType).toBe('employer');
    expect(auth.session().cargo).toBe('ADMINISTRADOR_GERAL');
    expect(sessionStorage.getItem('userType')).toBe('employer');
  });

  it('encerra sessão e limpa o sessionStorage', () => {
    const auth = criarService();
    auth.iniciarSessaoConsumidor({
      nomeCompleto: 'Maria Silva',
      email: 'maria@exemplo.com',
      senha: 'Abcdefg1!',
      carrinhoId: null,
    });

    auth.encerrarSessao();

    expect(auth.session().userType).toBe('deslogado');
    expect(auth.estaLogado()).toBe(false);
    expect(sessionStorage.getItem('userType')).toBeNull();
  });

  it('recupera sessão de consumidor já existente no sessionStorage (ex.: vinda do app legado)', () => {
    sessionStorage.setItem('userType', 'costumer');
    sessionStorage.setItem('clienteInfo', JSON.stringify({ nomeCompleto: 'Ana' }));

    const auth = criarService();

    expect(auth.session().userType).toBe('costumer');
    expect((auth.session().cliente as Cliente).nomeCompleto).toBe('Ana');
  });
});
