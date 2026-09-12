import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../../../core/services/produto.service';
import {
  Produto,
  arquivoParaBytes,
  base64ParaBytes,
  produtoParaPayload,
} from '../../../../core/models/produto.model';
import { parsePrecoBr } from '../../../../shared/utils/preco';
import { checkImagem, checkPreco, checkTamanhoTexto } from '../../../../shared/validators/aurora-validators';

const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG'] as const;

/**
 * Substitui pages/employer.tela_edicao_produto.html +
 * Infrastructure/Application/EdicaoProdutoApplication.js +
 * Infrastructure/Interacoes/EdicaoProduto.js +
 * Infrastructure/Application/DeletarProdutoApplication.js.
 *
 * Comportamento preservado do legado: os campos de texto são opcionais —
 * se o usuário deixar em branco, o valor ATUAL do produto é mantido; só o
 * que for preenchido passa por validação. O placeholder de cada input
 * mostra o valor atual, exatamente como no legado.
 *
 * Acessível apenas por ADMINISTRADOR_GERAL / GERENCIADOR_ROUPAS (ver
 * `authGuard` na definição da rota).
 */
@Component({
  selector: 'app-editar-produto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editar-produto.html',
  styleUrl: './editar-produto.scss',
})
export class EditarProduto implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  private readonly produtoId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly tamanhosDisponiveis = TAMANHOS;
  protected readonly produto = signal<Produto | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erroCarregar = signal(false);
  protected enviando = false;

  // Estado do formulário (campos opcionais — vazio = manter valor atual).
  protected nomeInput = '';
  protected precoInput = '';
  protected descricaoInput = '';
  protected arquivoImagem: File | null = null;
  protected readonly tamanhosSelecionados = signal<string[]>([]);

  protected readonly erroNome = signal<string | null>(null);
  protected readonly erroPreco = signal<string | null>(null);
  protected readonly erroDescricao = signal<string | null>(null);
  protected readonly erroImagem = signal<string | null>(null);
  protected readonly erroTamanho = signal<string | null>(null);

  private previewObjectUrl: string | null = null;
  protected readonly imagemPreviewUrl = signal('');

  constructor() {
    if (!this.produtoId) {
      this.erroCarregar.set(true);
      this.carregando.set(false);
      return;
    }

    this.produtoService.buscarPorId(this.produtoId).subscribe({
      next: (produto) => {
        this.produto.set(produto);
        this.tamanhosSelecionados.set([...produto.tamanhos]);
        this.imagemPreviewUrl.set(`data:image/jpeg;base64,${produto.imagem}`);
        this.carregando.set(false);
      },
      error: () => {
        this.erroCarregar.set(true);
        this.carregando.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
    }
  }

  protected onImagemSelecionada(event: Event): void {
    const arquivo = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!arquivo) return;

    this.arquivoImagem = arquivo;
    if (this.previewObjectUrl) URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = URL.createObjectURL(arquivo);
    this.imagemPreviewUrl.set(this.previewObjectUrl);
  }

  protected tamanhoAtivo(tamanho: string): boolean {
    return this.tamanhosSelecionados().includes(tamanho);
  }

  protected alternarTamanho(tamanho: string): void {
    this.tamanhosSelecionados.update((atual) =>
      atual.includes(tamanho) ? atual.filter((t) => t !== tamanho) : [...atual, tamanho],
    );
  }

  protected async salvar(): Promise<void> {
    const produtoAtual = this.produto();
    if (!produtoAtual) return;

    this.erroNome.set(null);
    this.erroPreco.set(null);
    this.erroDescricao.set(null);
    this.erroImagem.set(null);
    this.erroTamanho.set(null);

    // ----- IMAGEM -----
    let imagemBytes: number[];
    if (!this.arquivoImagem) {
      imagemBytes = base64ParaBytes(produtoAtual.imagem);
    } else {
      const erro = checkImagem(this.arquivoImagem);
      if (erro) {
        this.erroImagem.set(erro);
        return;
      }
      imagemBytes = await arquivoParaBytes(this.arquivoImagem);
    }

    // ----- NOME -----
    const nomeDigitado = this.nomeInput.trim();
    let nomeFinal = produtoAtual.nome;
    if (nomeDigitado) {
      const erro = checkTamanhoTexto(nomeDigitado, 2, 100);
      if (erro) {
        this.erroNome.set(erro);
        return;
      }
      nomeFinal = nomeDigitado;
    }

    // ----- PREÇO -----
    const precoDigitado = this.precoInput.trim();
    let precoFinal = produtoAtual.precoUnitario;
    if (precoDigitado) {
      const erro = checkPreco(precoDigitado);
      if (erro) {
        this.erroPreco.set(erro);
        return;
      }
      precoFinal = parsePrecoBr(precoDigitado);
    }

    // ----- DESCRIÇÃO -----
    const descricaoDigitada = this.descricaoInput.trim();
    let descricaoFinal = produtoAtual.descricao;
    if (descricaoDigitada) {
      const erro = checkTamanhoTexto(descricaoDigitada, 2, 1000);
      if (erro) {
        this.erroDescricao.set(erro);
        return;
      }
      descricaoFinal = descricaoDigitada;
    }

    // ----- TAMANHOS -----
    const tamanhosFinal = this.tamanhosSelecionados();
    if (tamanhosFinal.length === 0) {
      this.erroTamanho.set('*Por favor, selecione ao menos uma opção');
      return;
    }

    const payload = produtoParaPayload(
      {
        id: produtoAtual.id,
        nome: nomeFinal,
        descricao: descricaoFinal,
        precoUnitario: precoFinal,
        categoria: produtoAtual.categoria,
        tamanhos: tamanhosFinal,
      },
      imagemBytes,
    );

    this.enviando = true;
    this.produtoService.atualizar(this.produtoId, payload).subscribe({
      next: () => {
        this.enviando = false;
        alert('Produto atualizado com sucesso!');
        this.router.navigateByUrl('/produtos');
      },
      error: (erro) => {
        this.enviando = false;
        console.error(erro);
        alert('Erro ao atualizar o produto.');
      },
    });
  }

  protected apagar(): void {
    if (!confirm('Tem certeza que deseja apagar este produto?')) return;

    this.produtoService.remover(this.produtoId).subscribe({
      next: () => {
        alert('Produto apagado com sucesso!');
        this.router.navigateByUrl('/produtos');
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao apagar o produto.');
      },
    });
  }
}
