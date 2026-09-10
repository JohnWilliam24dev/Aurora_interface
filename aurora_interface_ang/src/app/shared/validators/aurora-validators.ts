import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Substitui Validators/ValidarUsuario.js.
 *
 * Cada validador segue o padrão nativo do Angular Reactive Forms: retorna
 * `null` quando válido, ou um objeto de erro (usado nos templates junto de
 * `control.errors?.['chave']`) quando inválido. As mensagens de erro em
 * português continuam centralizadas aqui para reaproveitar as strings
 * originais da tela.
 */

export function nomeValidator(minLength = 2, maxLength = 100): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '').toString().trim();
    if (!valor) return { required: '*Campo obrigatório' };
    if (valor.length < minLength) {
      return { minlength: `*O campo deve conter no mínimo ${minLength} caracteres` };
    }
    if (valor.length > maxLength) {
      return { maxlength: `*O campo deve conter no máximo ${maxLength} caracteres` };
    }
    return null;
  };
}

export function descricaoValidator(): ValidatorFn {
  return nomeValidator(2, 1000);
}

export function emailValidator(): ValidatorFn {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!regex.test(control.value ?? '')) {
      return { email: '*Email inválido!' };
    }
    return null;
  };
}

export function senhaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const senha: string = control.value ?? '';
    if (!/[A-Z]/.test(senha)) {
      return { maiuscula: '*A senha deve conter ao menos uma letra maiúscula.' };
    }
    if (!/[a-z]/.test(senha)) {
      return { minuscula: '*A senha deve conter ao menos uma letra minúscula.' };
    }
    if (!/[^a-zA-Z0-9]/.test(senha)) {
      return { especial: '*A senha deve conter ao menos um caractere especial.' };
    }
    if (senha.length < 8) {
      return { minlength: '*A senha deve conter ao menos 8 caracteres' };
    }
    return null;
  };
}

/** Validador de grupo (aplicar no FormGroup, não no control individual). */
export function senhaConfirmadaValidator(
  senhaField = 'senha',
  confirmacaoField = 'senha_confi',
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const senha = group.get(senhaField)?.value;
    const confirmacao = group.get(confirmacaoField)?.value;
    if (senha !== confirmacao) {
      return { senhaConfirmada: '*As senhas não coincidem, por favor verifique se estão iguais' };
    }
    return null;
  };
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = (control.value ?? '').replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { cpf: '*CPF inválido!' };
    }
    return null;
  };
}

export function cepValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cep = (control.value ?? '').replace(/\D/g, '');
    if (!/^[0-9]{8}$/.test(cep)) {
      return { cep: '*Cep inválido!' };
    }
    return null;
  };
}

export function numeroCasaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = (control.value ?? '').toString().trim();
    if (!valor) return { required: 'O número da casa é obrigatório.' };
    const numero = parseInt(valor, 10);
    if (isNaN(numero) || numero <= 0) {
      return { numeroCasa: '*Informe um número de casa válido' };
    }
    return null;
  };
}

export function precoValidator(): ValidatorFn {
  const regex = /^\d{1,5}(,\d{1,2})?$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!regex.test(control.value ?? '')) {
      return { preco: '*Preço inválido!' };
    }
    return null;
  };
}

export function arrayNaoVazioValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!Array.isArray(valor) || valor.length === 0) {
      return { arrayVazio: '*Por favor, selecione ao menos uma opção' };
    }
    return null;
  };
}

const TIPOS_IMAGEM_PERMITIDOS = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

export function imagemValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const arquivo: File | null = control.value;
    if (!arquivo) return { required: '*Campo obrigatório' };
    if (!TIPOS_IMAGEM_PERMITIDOS.includes(arquivo.type)) {
      return {
        imagem: '*Arquivo inválido. Selecione uma imagem (jpg, png, gif, bmp, webp).',
      };
    }
    return null;
  };
}
