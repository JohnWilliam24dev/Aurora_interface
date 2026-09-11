import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import {
  emailValidator,
  nomeValidator,
  senhaConfirmadaValidator,
  senhaValidator,
} from '../../../../shared/validators/aurora-validators';

/**
 * Substitui pages/tela_cadastro_consumidor.html +
 * Infrastructure/Application/CadastroConsumidorApplication.js.
 */
@Component({
  selector: 'app-cadastro-consumidor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-consumidor.html',
  styleUrl: './cadastro-consumidor.scss',
})
export class CadastroConsumidor {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly router = inject(Router);

  protected enviando = false;

  protected readonly form = this.fb.nonNullable.group(
    {
      nome: ['', [Validators.required, nomeValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      senha: ['', [Validators.required, senhaValidator()]],
      senha_confi: ['', [Validators.required]],
    },
    { validators: senhaConfirmadaValidator() },
  );

  protected primeiroErro(nome: 'nome' | 'email' | 'senha'): string | null {
    const control = this.form.controls[nome];
    if (!control.touched || !control.errors) return null;
    return Object.values(control.errors)[0] as string;
  }

  /** Erro de grupo (senhas não conferem) — não pertence a um control específico. */
  protected erroSenhaConfirmada(): string | null {
    const control = this.form.controls.senha_confi;
    if (!control.touched) return null;
    return (this.form.errors?.['senhaConfirmada'] as string | undefined) ?? null;
  }

  protected enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { nome, email, senha } = this.form.getRawValue();
    this.enviando = true;

    this.clienteService
      .cadastrar({ nomeCompleto: nome, email, senha, carrinhoId: null })
      .subscribe({
        next: () => {
          this.enviando = false;
          alert(
            'Cadastro realizado com sucesso! Redirecionando para a tela inicial. Faça o login para continuar.',
          );
          this.form.reset();
          setTimeout(() => this.router.navigateByUrl('/'), 2000);
        },
        error: () => {
          this.enviando = false;
          alert(
            'Ocorreu um problema ao realizar o cadastro. Verifique sua conexão com a internet e tente novamente. Se o erro persistir, entre em contato com o suporte técnico.',
          );
        },
      });
  }
}
