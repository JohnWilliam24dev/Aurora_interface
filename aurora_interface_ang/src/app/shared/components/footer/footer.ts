import { Component } from '@angular/core';
import { assetUrl } from '../../assets/cloudinary-assets';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  protected readonly assetUrl = assetUrl;
}
