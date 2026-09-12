import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../../../core/services/produto.service';
import { Produto } from '../../../../core/models/produto.model';

const TAMANHOS_DISPONIVEIS = ['PP', 'P', 'M', 'G', 'GG'];

/**
 * Substitui pages/tela_produto_consumidor.html +
 * Infrastructure/Application/ProdutoConsumidorApplication.js.
 */
@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  templateUrl: './produto-detalhe.html',
  styleUrl: './produto-detalhe.scss',
})
export class ProdutoDetalhe {
  private readonly route = inject(ActivatedRoute);
  private readonly produtoService = inject(ProdutoService);

  protected readonly tamanhosDisponiveis = TAMANHOS_DISPONIVEIS;
  protected readonly produto = signal<Produto | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);

  protected readonly imagemUrl = computed(() => {
    const produto = this.produto();
    return produto ? `data:image/jpeg;base64,${produto.imagem}` : '';
  });

  protected readonly parcela = computed(() => {
    const produto = this.produto();
    return produto ? (produto.precoUnitario / 3).toFixed(2).replace('.', ',') : '';
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.erro.set(true);
      this.carregando.set(false);
      return;
    }

    this.produtoService.buscarPorId(id).subscribe({
      next: (produto) => {
        this.produto.set(produto);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  protected tamanhoDisponivel(tamanho: string): boolean {
    return this.produto()?.tamanhos.includes(tamanho) ?? false;
  }
}
