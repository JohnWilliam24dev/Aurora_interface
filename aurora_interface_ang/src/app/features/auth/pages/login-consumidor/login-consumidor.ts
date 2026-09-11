import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { AuthService } from '../../../../core/services/auth.service';
import { assetUrl } from '../../../../shared/assets/cloudinary-assets';
import { emailValidator, senhaValidator } from '../../../../shared/validators/aurora-validators';

/**
 * Substitui pages/tela_login_consumidor.html +
 * Infrastructure/Application/LoginConsumidorApplication.js.
 */
@Component({
  selector: 'app-login-consumidor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-consumidor.html',
  styleUrl: './login-consumidor.scss',
})
export class LoginConsumidor {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly assetUrl = assetUrl;
  protected enviando = false;

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, emailValidator()]],
    senha: ['', [Validators.required, senhaValidator()]],
  });

  protected primeiroErro(nome: 'email' | 'senha'): string | null {
    const control = this.form.controls[nome];
    if (!control.touched || !control.errors) return null;
    return Object.values(control.errors)[0] as string;
  }

  protected enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { email, senha } = this.form.getRawValue();
    this.enviando = true;

    this.clienteService.login(email, senha).subscribe({
      next: (cliente) => {
        this.enviando = false;
        if (!cliente) {
          alert('Verifique seu email ou senha.');
          return;
        }
        this.auth.iniciarSessaoConsumidor(cliente);
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
