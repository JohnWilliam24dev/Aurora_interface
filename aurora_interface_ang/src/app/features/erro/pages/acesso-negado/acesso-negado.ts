import { Component, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Substitui pages/acesso-negado.html + Infrastructure/Interacoes/RedirecionarIndex.js.
 */
@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  templateUrl: './acesso-negado.html',
  styleUrl: './acesso-negado.scss',
})
export class AcessoNegado implements OnDestroy {
  private readonly router = inject(Router);
  private readonly timeoutId = setTimeout(() => this.router.navigateByUrl('/'), 2000);

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }
}
