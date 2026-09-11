import { Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popup-funcionario-geren-func',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './popup-funcionario-geren-func.html',
  styleUrl: './popup-funcionario-geren-func.scss',
})
export class PopupFuncionarioGerenFunc {
  readonly nome = input.required<string>();
  @Output() readonly sair = new EventEmitter<void>();
}
