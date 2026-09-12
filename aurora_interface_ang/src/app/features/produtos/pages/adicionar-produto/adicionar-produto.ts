import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoService } from '../../../../core/services/produto.service';
import { arquivoParaBytes, produtoParaPayload } from '../../../../core/models/produto.model';
import { parsePrecoBr } from '../../../../shared/utils/preco';
import {
  arrayNaoVazioValidator,
  descricaoValidator,
  imagemValidator,
  nomeValidator,
  precoValidator,
} from '../../../../shared/validators/aurora-validators';

const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG'] as const;
const CATEGORIAS = [
  { valor: 'vestido', label: 'Vestido' },
  { valor: 'praia', label: 'Praia' },
  { valor: 'calça', label: 'Calça' },
  { valor: 'macacao', label: 'Macacão' },
  { valor: 'blusa', label: 'Blusa' },
  { valor: 'short', label: 'Short' },
  { valor: 'camisa', label: 'Camisa' },
  { valor: 'inverno', label: 'Inverno' },
  { valor: 'jeans', label: 'Jeans' },
];

/**
 * Substitui pages/employer.tela_adicionar_produto.html +
 * Infrastructure/Application/AdicionarProdutoApplication.js.
 *
 * Acessível apenas por ADMINISTRADOR_GERAL / GERENCIADOR_ROUPAS (ver
 * `authGuard` na definição da rota).
 */
@Component({
  selector: 'app-adicionar-produto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './adicionar-produto.html',
  styleUrl: './adicionar-produto.scss',
})
export class AdicionarProduto {
  private readonly fb = inject(FormBuilder);
  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  protected readonly tamanhos = TAMANHOS;
  protected readonly categorias = CATEGORIAS;
  protected enviando = false;

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, nomeValidator()]],
    preco: ['', [Validators.required, precoValidator()]],
    categoria: ['', [Validators.required]],
    tamanho: this.fb.nonNullable.control<string[]>([], [arrayNaoVazioValidator()]),
    descricao: ['', [Validators.required, descricaoValidator()]],
    imagem: this.fb.control<File | null>(null, [imagemValidator()]),
  });

  protected onImagemSelecionada(event: Event): void {
    const arquivo = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.form.controls.imagem.setValue(arquivo);
    this.form.controls.imagem.markAsTouched();
  }

  protected alternarTamanho(tamanho: string, marcado: boolean): void {
    const atual = this.form.controls.tamanho.value;
    const novo = marcado ? [...atual, tamanho] : atual.filter((t) => t !== tamanho);
    this.form.controls.tamanho.setValue(novo);
    this.form.controls.tamanho.markAsTouched();
  }

  protected primeiroErro(
    nome: 'nome' | 'preco' | 'categoria' | 'tamanho' | 'descricao' | 'imagem',
  ): string | null {
    const control = this.form.controls[nome];
    if (!control.touched || !control.errors) return null;
    return Object.values(control.errors)[0] as string;
  }

  protected async enviar(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { nome, preco, categoria, tamanho, descricao, imagem } = this.form.getRawValue();
    this.enviando = true;

    try {
      const imagemBytes = await arquivoParaBytes(imagem!);
      const payload = produtoParaPayload(
        {
          id: null,
          nome,
          descricao,
          precoUnitario: parsePrecoBr(preco),
          categoria,
          tamanhos: tamanho,
        },
        imagemBytes,
      );

      this.produtoService.criar(payload).subscribe({
        next: () => {
          this.enviando = false;
          alert('Produto cadastrado com sucesso!');
          this.form.reset({ tamanho: [] });
        },
        error: (erro) => {
          this.enviando = false;
          console.error('Erro ao cadastrar produto:', erro);
          alert(
            'Não foi possível concluir o cadastro do produto. Verifique sua conexão com a internet e tente novamente. Caso o problema persista, entre em contato com o suporte técnico.',
          );
        },
      });
    } catch {
      this.enviando = false;
      alert('Erro ao ler a imagem selecionada.');
    }
  }

  protected voltar(): void {
    this.router.navigateByUrl('/produtos');
  }
}
