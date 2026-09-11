import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-consumidor/login-consumidor').then(
        (m) => m.LoginConsumidor,
      ),
    canActivate: [authGuard],
    data: { allow: ['guest-only'] },
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./features/auth/pages/cadastro-consumidor/cadastro-consumidor').then(
        (m) => m.CadastroConsumidor,
      ),
    canActivate: [authGuard],
    data: { allow: ['guest-only'] },
  },
  {
    path: 'funcionario/login',
    loadComponent: () =>
      import('./features/auth/pages/login-funcionario/login-funcionario').then(
        (m) => m.LoginFuncionario,
      ),
    canActivate: [authGuard],
    data: { allow: ['guest-only'] },
  },
  {
    path: 'funcionario/cadastro',
    loadComponent: () =>
      import('./features/auth/pages/cadastro-funcionario/cadastro-funcionario').then(
        (m) => m.CadastroFuncionario,
      ),
    canActivate: [authGuard],
    data: { allow: ['ADMINISTRADOR_GERAL', 'GERENCIADOR_FUNCIONARIOS'] },
  },
];
