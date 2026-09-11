import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionarioService } from '../../../../core/services/funcionario.service';
import { AuthService } from '../../../../core/services/auth.service';
import { cpfValidator, senhaValidator } from '../../../../shared/validators/aurora-validators';

/**
 * Substitui pages/tela_login_funcionario.html +
 * Infrastructure/Application/LoginFuncionarioApplication.js.
 */
@Component({
  selector: 'app-login-funcionario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-funcionario.html',
  styleUrl: './login-funcionario.scss',
})
export class LoginFuncionario {
  private readonly fb = inject(FormBuilder);
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected enviando = false;

  protected readonly form = this.fb.nonNullable.group({
    cpf: ['', [Validators.required, cpfValidator()]],
    senha: ['', [Validators.required, senhaValidator()]],
  });

  protected primeiroErro(nome: 'cpf' | 'senha'): string | null {
    const control = this.form.controls[nome];
    if (!control.touched || !control.errors) return null;
    return Object.values(control.errors)[0] as string;
  }

  protected enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { cpf, senha } = this.form.getRawValue();
    this.enviando = true;

    this.funcionarioService.login(cpf, senha).subscribe({
      next: (funcionario) => {
        this.enviando = false;
        if (!funcionario) {
          alert('Verifique seu CPF ou senha.');
          return;
        }
        this.auth.iniciarSessaoFuncionario(funcionario);
        this.form.reset();
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.enviando = false;
        alert(
          'Ocorreu um problema ao realizar o login. Verifique sua conexão com a internet e tente novamente. Se o erro persistir, entre em contato com o suporte técnico.',
        );
      },
    });
  }
}
