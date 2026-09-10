import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Substitui Persistence/VericacaoAcesso.js.
 *
 * No legado, a permissão de cada página era controlada por um mapa gigante
 * `pageName -> permissoes`. Aqui, cada rota declara sua própria permissão via
 * `data: { allow: [...] }`:
 *
 *   - 'public'        -> qualquer visitante (logado ou não)
 *   - 'guest-only'     -> só quem NÃO está logado (ex: telas de login/cadastro)
 *   - 'costumer'       -> apenas consumidores logados
 *   - '<CARGO>'        -> apenas funcionários com aquele cargo
 *     (ADMINISTRADOR_GERAL, GERENCIADOR_FUNCIONARIOS, GERENCIADOR_ROUPAS)
 */
export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allow = (route.data['allow'] as string[] | undefined) ?? ['public'];

  const sessao = auth.session();

  if (allow.includes('public')) {
    return true;
  }

  if (allow.includes('guest-only')) {
    if (sessao.userType === 'deslogado') {
      return true;
    }
    return router.parseUrl('/');
  }

  if (sessao.userType === 'costumer' && allow.includes('costumer')) {
    return true;
  }

  if (sessao.userType === 'employer' && sessao.cargo && allow.includes(sessao.cargo)) {
    return true;
  }

  return router.parseUrl('/acesso-negado');
};
