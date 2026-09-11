import { Component } from '@angular/core';
import { assetUrl } from '../../../assets/cloudinary-assets';

@Component({
  selector: 'app-popup-carrinho-deslogado',
  standalone: true,
  templateUrl: './popup-carrinho-deslogado.html',
  styleUrl: './popup-carrinho-deslogado.scss',
})
export class PopupCarrinhoDeslogado {
  protected readonly assetUrl = assetUrl;
}
