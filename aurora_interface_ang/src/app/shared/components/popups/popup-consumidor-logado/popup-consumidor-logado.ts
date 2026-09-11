import { Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popup-consumidor-logado',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './popup-consumidor-logado.html',
  styleUrl: './popup-consumidor-logado.scss',
})
export class PopupConsumidorLogado {
  readonly nome = input.required<string>();
  @Output() readonly sair = new EventEmitter<void>();
}
