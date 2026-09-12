import { Component } from '@angular/core';

/**
 * Substitui pages/consumer.tela_pedidos.html.
 *
 * ⚠️ Assim como o carrinho, esta página é um shell estático no legado — sem
 * `Application.js`, sem integração com `SimulacaoCompraGateway`. Ligar de
 * verdade ao `SimulacaoCompraService` (Fase 2) é uma decisão de produto,
 * fora do escopo desta migração 1:1.
 */
@Component({
  selector: 'app-pedidos',
  standalone: true,
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss',
})
export class Pedidos {}
