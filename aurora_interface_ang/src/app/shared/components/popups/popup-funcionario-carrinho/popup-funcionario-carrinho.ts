import { Component } from '@angular/core';
import { assetUrl } from '../../../assets/cloudinary-assets';

@Component({
  selector: 'app-popup-funcionario-carrinho',
  standalone: true,
  templateUrl: './popup-funcionario-carrinho.html',
  styleUrl: './popup-funcionario-carrinho.scss',
})
export class PopupFuncionarioCarrinho {
  protected readonly assetUrl = assetUrl;
}
