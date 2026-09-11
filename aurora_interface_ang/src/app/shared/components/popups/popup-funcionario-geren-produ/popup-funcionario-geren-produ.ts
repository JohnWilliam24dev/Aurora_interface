import { Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popup-funcionario-geren-produ',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './popup-funcionario-geren-produ.html',
  styleUrl: './popup-funcionario-geren-produ.scss',
})
export class PopupFuncionarioGerenProdu {
  readonly nome = input.required<string>();
  @Output() readonly sair = new EventEmitter<void>();
}
