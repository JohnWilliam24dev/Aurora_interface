import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Aurora | Moda Feminina',
    loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    title: 'Aurora | Login',
    loadComponent: () =>
      import('./features/auth/pages/login-consumidor/login-consumidor').then(
        (m) => m.LoginConsumidor,
      ),
    canActivate: [authGuard],
    data: { allow: ['guest-only'] },
  },
  {
    path: 'cadastro',
    title: 'Aurora | Criar Conta',
    loadComponent: () =>
      import('./features/auth/pages/cadastro-consumidor/cadastro-consumidor').then(
        (m) => m.CadastroConsumidor,
      ),
    canActivate: [authGuard],
    data: { allow: ['guest-only'] },
  },
  {
    path: 'funcionario/login',
    title: 'Aurora | Login Funcionário',
    loadComponent: () =>
      import('./features/auth/pages/login-funcionario/login-funcionario').then(
        (m) => m.LoginFuncionario,
      ),
    canActivate: [authGuard],
    data: { allow: ['guest-only'] },
  },
  {
    path: 'funcionario/cadastro',
    title: 'Aurora | Cadastro de Funcionário',
    loadComponent: () =>
      import('./features/auth/pages/cadastro-funcionario/cadastro-funcionario').then(
        (m) => m.CadastroFuncionario,
      ),
    canActivate: [authGuard],
    data: { allow: ['ADMINISTRADOR_GERAL', 'GERENCIADOR_FUNCIONARIOS'] },
  },
  {
    path: 'produtos',
    title: 'Aurora | Produtos',
    loadComponent: () =>
      import('./features/produtos/pages/listar-produtos/listar-produtos').then(
        (m) => m.ListarProdutos,
      ),
  },
  {
    path: 'produtos/adicionar',
    title: 'Aurora | Adicionar Produto',
    loadComponent: () =>
      import('./features/produtos/pages/adicionar-produto/adicionar-produto').then(
        (m) => m.AdicionarProduto,
      ),
    canActivate: [authGuard],
    data: { allow: ['ADMINISTRADOR_GERAL', 'GERENCIADOR_ROUPAS'] },
  },
  {
    path: 'produtos/:id/editar',
    title: 'Aurora | Editar Produto',
    loadComponent: () =>
      import('./features/produtos/pages/editar-produto/editar-produto').then(
        (m) => m.EditarProduto,
      ),
    canActivate: [authGuard],
    data: { allow: ['ADMINISTRADOR_GERAL', 'GERENCIADOR_ROUPAS'] },
  },
  {
    path: 'produtos/:id',
    title: 'Aurora | Produto',
    loadComponent: () =>
      import('./features/produtos/pages/produto-detalhe/produto-detalhe').then(
        (m) => m.ProdutoDetalhe,
      ),
  },
  {
    path: 'carrinho',
    title: 'Aurora | Carrinho',
    loadComponent: () =>
      import('./features/carrinho/pages/carrinho/carrinho').then((m) => m.Carrinho),
    canActivate: [authGuard],
    data: { allow: ['costumer'] },
  },
  {
    path: 'pedidos',
    title: 'Aurora | Pedidos',
    loadComponent: () =>
      import('./features/pedidos/pages/pedidos/pedidos').then((m) => m.Pedidos),
    canActivate: [authGuard],
    data: { allow: ['costumer'] },
  },
  {
    path: 'endereco/cadastro',
    title: 'Aurora | Cadastrar Endereço',
    loadComponent: () =>
      import('./features/endereco/pages/cadastro-endereco/cadastro-endereco').then(
        (m) => m.CadastroEndereco,
      ),
    canActivate: [authGuard],
    data: { allow: ['costumer'] },
  },
  {
    path: 'acesso-negado',
    title: 'Aurora | Acesso Negado',
    loadComponent: () =>
      import('./features/erro/pages/acesso-negado/acesso-negado').then((m) => m.AcessoNegado),
  },
  {
    path: '**',
    title: 'Aurora | Acesso Negado',
    loadComponent: () =>
      import('./features/erro/pages/acesso-negado/acesso-negado').then((m) => m.AcessoNegado),
  },
];
