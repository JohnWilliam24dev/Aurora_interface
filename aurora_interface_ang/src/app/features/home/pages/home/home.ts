import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../../../core/services/produto.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Produto } from '../../../../core/models/produto.model';
import { assetUrl } from '../../../../shared/assets/cloudinary-assets';

/**
 * Substitui index.html + Infrastructure/Interacoes/VitrineProduto.js.
 *
 * ⚠️ Melhoria consciente: o legado buscava 8 produtos com IDs FIXOS
 * (`27 + n`, ou seja, sempre 28..35) para preencher as vitrines "Em Alta",
 * "Leveza" e "Seu Mood" — funciona só por acaso, com aquele banco de dados
 * específico, e quebra (produtos não encontrados) em qualquer outro. Aqui
 * a home busca a lista real de produtos e distribui os primeiros nas
 * vitrines, sem depender de IDs específicos existirem.
 *
 * Também corrigido: a vitrine "Seu Mood" tinha, no HTML legado, uma
 * descrição de produto fixa ("Óculos de sol retrô vermelho...") no lugar
 * do nome dinâmico do segundo item — parecia um placeholder esquecido.
 * Aqui os dois itens mostram o nome real do produto, como as outras vitrines.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly produtoService = inject(ProdutoService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly assetUrl = assetUrl;
  protected readonly produtos = signal<Produto[]>([]);
  protected readonly carregando = signal(true);

  protected readonly vitrineEmAlta = computed(() => this.produtos().slice(0, 3));
  protected readonly vitrineLeveza = computed(() => this.produtos().slice(3, 6));
  protected readonly vitrineSeuMood = computed(() => this.produtos().slice(6, 8));

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
      error: () => this.carregando.set(false),
    });
  }

  protected abrirProduto(produto: Produto): void {
    const destino = this.podeEditar() ? `/produtos/${produto.id}/editar` : `/produtos/${produto.id}`;
    this.router.navigateByUrl(destino);
  }
}
