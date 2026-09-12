import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnderecoService } from '../../../../core/services/endereco.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Cliente } from '../../../../core/models/cliente.model';
import {
  cepValidator,
  nomeValidator,
  numeroCasaValidator,
} from '../../../../shared/validators/aurora-validators';

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
];

/**
 * Substitui Infrastructure/Application/EnderecoConsumidorApplication.js.
 *
 * ⚠️ Bug do legado corrigido: `const cliente_id = 1;` era HARDCODED no
 * `Application.js` — todo endereço cadastrado, de qualquer consumidor,
 * ficava associado ao cliente de id 1. Aqui o id vem da sessão real
 * (`AuthService`).
 *
 * ⚠️ Mapeamento de campos preservado do legado: o construtor de `Endereco`
 * é `(cliente_id, rua, numero, complemento, bairro, cidade, estado, cep)`,
 * mas o formulário chamava `new Endereco(cliente_id, rua, numero_casa,
 * logradouro, bairro, ...)` — ou seja, o campo do formulário rotulado
 * "logradouro" na verdade vai para `complemento`. Mantido para não quebrar
 * dados já salvos com esse mapeamento.
 */
@Component({
  selector: 'app-cadastro-endereco',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-endereco.html',
  styleUrl: './cadastro-endereco.scss',
})
export class CadastroEndereco {
  private readonly fb = inject(FormBuilder);
  private readonly enderecoService = inject(EnderecoService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly estados = ESTADOS;
  protected enviando = false;

  protected readonly form = this.fb.nonNullable.group({
    cep: ['', [Validators.required, cepValidator()]],
    logradouro: ['', [Validators.required, nomeValidator()]],
    rua: ['', [Validators.required, nomeValidator()]],
    bairro: ['', [Validators.required, nomeValidator()]],
    cidade: ['', [Validators.required, nomeValidator()]],
    estado: ['', [Validators.required]],
    numero_casa: ['', [Validators.required, numeroCasaValidator()]],
  });

  protected primeiroErro(
    nome: 'cep' | 'logradouro' | 'rua' | 'bairro' | 'cidade' | 'estado' | 'numero_casa',
  ): string | null {
    const control = this.form.controls[nome];
    if (!control.touched || !control.errors) return null;
    return Object.values(control.errors)[0] as string;
  }

  protected enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const cliente = this.auth.session().cliente as Cliente | null;
    if (!cliente?.id) {
      alert('Não foi possível identificar o consumidor logado. Faça login novamente.');
      return;
    }

    const { cep, logradouro, rua, bairro, cidade, estado, numero_casa } = this.form.getRawValue();
    this.enviando = true;

    this.enderecoService
      .cadastrar({
        clienteId: cliente.id,
        rua,
        numero: numero_casa,
        complemento: logradouro,
        bairro,
        cidade,
        estado,
        cep,
      })
      .subscribe({
        next: () => {
          this.enviando = false;
          alert('Endereço cadastrado com sucesso!');
          this.form.reset();
          setTimeout(() => this.router.navigateByUrl('/'), 2000);
        },
        error: () => {
          this.enviando = false;
          alert(
            'Ocorreu um problema ao atualizar o endereço. Verifique sua conexão com a internet e tente novamente. Se o erro persistir, entre em contato com o suporte técnico.',
          );
        },
      });
  }
}
