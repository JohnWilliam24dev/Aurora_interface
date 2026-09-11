import { Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popup-funcionario-adm',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './popup-funcionario-adm.html',
  styleUrl: './popup-funcionario-adm.scss',
})
export class PopupFuncionarioAdm {
  readonly nome = input.required<string>();
  @Output() readonly sair = new EventEmitter<void>();
}
