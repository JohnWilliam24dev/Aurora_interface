import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService } from '../../../../core/services/produto.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Produto } from '../../../../core/models/produto.model';
import { assetUrl } from '../../../../shared/assets/cloudinary-assets';

/**
 * Substitui pages/tela_listar_produto.html +
 * Infrastructure/Application/ListarProdutosApplication.js.
 *
 * As categorias no topo são apenas decorativas — o legado também não tinha
 * lógica de filtro por categoria implementada, só o visual dos botões.
 */
@Component({
  selector: 'app-listar-produtos',
  standalone: true,
  templateUrl: './listar-produtos.html',
  styleUrl: './listar-produtos.scss',
})
export class ListarProdutos {
  private readonly produtoService = inject(ProdutoService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly assetUrl = assetUrl;
  protected readonly categorias = [
    'PRAIA',
    'BLUSA',
    'INVERNO',
    'JEANS',
    'VESTIDO',
    'CALÇA',
    'MACACÃO',
    'SHORT',
    'CAMISA',
  ];

  protected readonly produtos = signal<Produto[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal(false);

  protected readonly podeEditar = computed(() => {
    const sessao = this.auth.session();
    return (
      sessao.userType === 'employer' &&
      (sessao.cargo === 'ADMINISTRADOR_GERAL' || sessao.cargo === 'GERENCIADOR_ROUPAS')
    );
  });

  constructor() {
    this.produtoService.listarTodos().subscribe({
      next: (produtos) => {
        this.produtos.set(produtos);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  protected abrirProduto(produto: Produto): void {
    const destino = this.podeEditar() ? `/produtos/${produto.id}/editar` : `/produtos/${produto.id}`;
    this.router.navigateByUrl(destino);
  }
}
