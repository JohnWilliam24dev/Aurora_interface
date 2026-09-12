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
    const erro = checkTamanhoTexto(valor, minLength, maxLength);
    return erro ? { minlength: erro } : null;
  };
}

/**
 * Checagem pura de comprimento (sem exigir "obrigatório"), reaproveitada
 * por telas onde o campo é opcional — ex.: edição de produto, em que campo
 * vazio significa "manter valor atual" em vez de erro de validação.
 */
export function checkTamanhoTexto(valor: string, minLength = 2, maxLength = 100): string | null {
  if (valor.length < minLength) {
    return `*O campo deve conter no mínimo ${minLength} caracteres`;
  }
  if (valor.length > maxLength) {
    return `*O campo deve conter no máximo ${maxLength} caracteres`;
  }
  return null;
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
  return (control: AbstractControl): ValidationErrors | null => {
    return checkPreco(control.value ?? '') ? { preco: checkPreco(control.value ?? '') } : null;
  };
}

/** Checagem pura de formato de preço ("108,00"), reaproveitada na edição de produto. */
export function checkPreco(valor: string): string | null {
  const regex = /^\d{1,5}(,\d{1,2})?$/;
  return regex.test(valor) ? null : '*Preço inválido!';
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
    const erro = checkImagem(arquivo);
    return erro ? { imagem: erro } : null;
  };
}

/** Checagem pura de tipo de arquivo de imagem, reaproveitada na edição de produto. */
export function checkImagem(arquivo: File): string | null {
  return TIPOS_IMAGEM_PERMITIDOS.includes(arquivo.type)
    ? null
    : '*Arquivo inválido. Selecione uma imagem (jpg, png, gif, bmp, webp).';
}
