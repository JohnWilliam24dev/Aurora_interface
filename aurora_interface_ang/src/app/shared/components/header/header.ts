import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { assetUrl } from '../../assets/cloudinary-assets';
import { PopupConsumidorDeslogado } from '../popups/popup-consumidor-deslogado/popup-consumidor-deslogado';
import { PopupConsumidorLogado } from '../popups/popup-consumidor-logado/popup-consumidor-logado';
import { PopupSuporteDeslogado } from '../popups/popup-suporte-deslogado/popup-suporte-deslogado';
import { PopupCarrinhoDeslogado } from '../popups/popup-carrinho-deslogado/popup-carrinho-deslogado';
import { PopupFuncionarioCarrinho } from '../popups/popup-funcionario-carrinho/popup-funcionario-carrinho';
import { PopupFuncionarioAdm } from '../popups/popup-funcionario-adm/popup-funcionario-adm';
import { PopupFuncionarioGerenFunc } from '../popups/popup-funcionario-geren-func/popup-funcionario-geren-func';
import { PopupFuncionarioGerenProdu } from '../popups/popup-funcionario-geren-produ/popup-funcionario-geren-produ';

type PopupAberto = 'suporte' | 'carrinho' | 'user' | null;

/**
 * Substitui Interacoes/HeaderPopUp.js.
 *
 * No legado, cada popup era um fragmento HTML buscado via `fetch` e injetado
 * no DOM (`innerHTML +=`), com a decisão de qual popup mostrar e em que
 * posição feita imperativamente. Aqui, os 8 popups são componentes Angular
 * de verdade, renderizados condicionalmente conforme a sessão (`AuthService`)
 * e posicionados via CSS relativo ao próprio ícone (ver `styles/_popup.scss`).
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    PopupConsumidorDeslogado,
    PopupConsumidorLogado,
    PopupSuporteDeslogado,
    PopupCarrinhoDeslogado,
    PopupFuncionarioCarrinho,
    PopupFuncionarioAdm,
    PopupFuncionarioGerenFunc,
    PopupFuncionarioGerenProdu,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected readonly assetUrl = assetUrl;
  protected readonly session = this.auth.session;
  protected readonly popupAberto = signal<PopupAberto>(null);

  protected readonly nomeUsuario = computed(() => {
    const cliente = this.session().cliente as { nomeCompleto?: string } | null;
    return cliente?.nomeCompleto ?? '';
  });

  protected readonly cargo = computed(() => this.session().cargo);

  protected toggleSuporte(): void {
    this.togglePopup('suporte');
  }

  protected toggleUser(): void {
    this.togglePopup('user');
  }

  /**
   * No legado, o clique no ícone de carrinho ora abria um popup (deslogado
   * ou funcionário), ora navegava direto para a tela de carrinho
   * (consumidor logado). Mantemos a mesma regra aqui.
   */
  protected clicarCarrinho(): void {
    if (this.session().userType === 'costumer') {
      this.popupAberto.set(null);
      this.router.navigateByUrl('/carrinho');
      return;
    }
    this.togglePopup('carrinho');
  }

  protected sair(): void {
    this.auth.encerrarSessao();
    this.popupAberto.set(null);
    this.router.navigateByUrl('/');
  }

  private togglePopup(nome: NonNullable<PopupAberto>): void {
    this.popupAberto.update((atual) => (atual === nome ? null : nome));
  }

  /** Fecha qualquer popup aberto ao clicar fora do header (equivalente ao listener global do legado). */
  @HostListener('document:click', ['$event'])
  protected aoClicarForaDoHeader(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.popupAberto.set(null);
    }
  }
}
