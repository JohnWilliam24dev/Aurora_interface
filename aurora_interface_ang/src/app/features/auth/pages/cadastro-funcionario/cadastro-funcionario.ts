import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FuncionarioService } from '../../../../core/services/funcionario.service';
import { Cargo } from '../../../../core/models/funcionario.model';
import {
  cpfValidator,
  emailValidator,
  nomeValidator,
  senhaConfirmadaValidator,
  senhaValidator,
} from '../../../../shared/validators/aurora-validators';

/**
 * Substitui pages/employer.tela_cadastro_funcionario.html +
 * Infrastructure/Application/CadastroFuncionarioApplication.js.
 *
 * Acessível apenas por ADMINISTRADOR_GERAL / GERENCIADOR_FUNCIONARIOS
 * (ver `authGuard` na definição da rota).
 */
@Component({
  selector: 'app-cadastro-funcionario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-funcionario.html',
  styleUrl: './cadastro-funcionario.scss',
})
export class CadastroFuncionario {
  private readonly fb = inject(FormBuilder);
  private readonly funcionarioService = inject(FuncionarioService);

  protected enviando = false;

  protected readonly cargos: { valor: Cargo; label: string }[] = [
    { valor: 'ADMINISTRADOR_GERAL', label: 'Administrador' },
    { valor: 'GERENCIADOR_FUNCIONARIOS', label: 'Gerenciador de Funcionário' },
    { valor: 'GERENCIADOR_ROUPAS', label: 'Gerenciador de Produtos' },
  ];

  protected readonly form = this.fb.nonNullable.group(
    {
      nome: ['', [Validators.required, nomeValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      cpf: ['', [Validators.required, cpfValidator()]],
      senha: ['', [Validators.required, senhaValidator()]],
      senha_confi: ['', [Validators.required]],
      cargo: ['' as Cargo | '', [Validators.required]],
    },
    { validators: senhaConfirmadaValidator() },
  );

  protected primeiroErro(nome: 'nome' | 'email' | 'cpf' | 'senha' | 'cargo'): string | null {
    const control = this.form.controls[nome];
    if (!control.touched || !control.errors) return null;
    return Object.values(control.errors)[0] as string;
  }

  protected erroSenhaConfirmada(): string | null {
    const control = this.form.controls.senha_confi;
    if (!control.touched) return null;
    return (this.form.errors?.['senhaConfirmada'] as string | undefined) ?? null;
  }

  protected enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { nome, email, cpf, senha, cargo } = this.form.getRawValue();
    this.enviando = true;

    this.funcionarioService
      .cadastrar({
        id: null,
        nomeCompleto: nome,
        email,
        senha,
        cpf,
        cargo: cargo as Cargo,
        status: null,
      })
      .subscribe({
        next: () => {
          this.enviando = false;
          alert('Cadastro realizado com sucesso! Redirecionando para a tela inicial. Faça o login para continuar.');
          this.form.reset();
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
