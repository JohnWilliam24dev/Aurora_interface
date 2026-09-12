import { Component } from '@angular/core';
import { assetUrl } from '../../../../shared/assets/cloudinary-assets';

/**
 * Substitui pages/consumer.tela_carrinho.html.
 *
 * ⚠️ No legado, esta página é um shell puramente estático: sem
 * `Application.js`, sem integração com `CarrinhoGateway`/`ItemCarrinhoGateway`.
 * A mensagem de "carrinho vazio" e os totais "R$ 0" eram fixos no HTML.
 * Esta versão preserva exatamente esse comportamento. Ligar o carrinho de
 * verdade ao `CarrinhoService`/`ItemCarrinhoService` (já prontos desde a
 * Fase 2) é uma decisão de produto — precisa definir como itens entram no
 * carrinho, atualização de quantidade, etc. — fora do escopo de uma
 * migração 1:1.
 */
@Component({
  selector: 'app-carrinho',
  standalone: true,
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.scss',
})
export class Carrinho {
  protected readonly assetUrl = assetUrl;
}
