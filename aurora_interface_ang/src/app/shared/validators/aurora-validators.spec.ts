import { FormControl, FormGroup } from '@angular/forms';
import {
  checkImagem,
  checkPreco,
  checkTamanhoTexto,
  cepValidator,
  cpfValidator,
  emailValidator,
  imagemValidator,
  nomeValidator,
  numeroCasaValidator,
  precoValidator,
  senhaConfirmadaValidator,
  senhaValidator,
} from './aurora-validators';

describe('aurora-validators', () => {
  describe('nomeValidator', () => {
    const validator = nomeValidator();

    it('rejeita valor vazio', () => {
      expect(validator(new FormControl(''))).toEqual({ required: '*Campo obrigatório' });
    });

    it('rejeita nome muito curto', () => {
      const erro = validator(new FormControl('A'));
      expect(erro?.['minlength']).toContain('mínimo');
    });

    it('aceita nome válido', () => {
      expect(validator(new FormControl('Roberto'))).toBeNull();
    });
  });

  describe('checkTamanhoTexto (usado na edição de produto)', () => {
    it('valida o comprimento normalmente — quem decide pular a validação quando vazio é o componente chamador (EditarProduto), não esta função', () => {
      expect(checkTamanhoTexto('', 2, 100)).toContain('mínimo');
    });

    it('rejeita texto acima do máximo', () => {
      expect(checkTamanhoTexto('a'.repeat(101), 2, 100)).toContain('máximo');
    });
  });

  describe('emailValidator', () => {
    const validator = emailValidator();

    it('rejeita email sem @', () => {
      expect(validator(new FormControl('invalido'))).toEqual({ email: '*Email inválido!' });
    });

    it('aceita email válido', () => {
      expect(validator(new FormControl('a@b.com'))).toBeNull();
    });
  });

  describe('senhaValidator', () => {
    const validator = senhaValidator();

    it('rejeita senha sem maiúscula', () => {
      expect(validator(new FormControl('abcdefg1!'))?.['maiuscula']).toBeTruthy();
    });

    it('rejeita senha sem caractere especial', () => {
      expect(validator(new FormControl('Abcdefg1'))?.['especial']).toBeTruthy();
    });

    it('rejeita senha curta', () => {
      expect(validator(new FormControl('Ab1!'))?.['minlength']).toBeTruthy();
    });

    it('aceita senha válida', () => {
      expect(validator(new FormControl('Abcdefg1!'))).toBeNull();
    });
  });

  describe('senhaConfirmadaValidator (validador de grupo)', () => {
    it('detecta senhas diferentes', () => {
      const grupo = new FormGroup({
        senha: new FormControl('Abcdefg1!'),
        senha_confi: new FormControl('Outra1!'),
      });
      expect(senhaConfirmadaValidator()(grupo)?.['senhaConfirmada']).toBeTruthy();
    });

    it('aceita senhas iguais', () => {
      const grupo = new FormGroup({
        senha: new FormControl('Abcdefg1!'),
        senha_confi: new FormControl('Abcdefg1!'),
      });
      expect(senhaConfirmadaValidator()(grupo)).toBeNull();
    });
  });

  describe('cpfValidator', () => {
    const validator = cpfValidator();

    it('rejeita CPF com todos os dígitos iguais', () => {
      expect(validator(new FormControl('11111111111'))).toEqual({ cpf: '*CPF inválido!' });
    });

    it('rejeita CPF com tamanho errado', () => {
      expect(validator(new FormControl('123'))).toEqual({ cpf: '*CPF inválido!' });
    });

    it('aceita CPF com 11 dígitos distintos', () => {
      expect(validator(new FormControl('08526523654'))).toBeNull();
    });
  });

  describe('cepValidator', () => {
    it('rejeita CEP com tamanho errado', () => {
      expect(cepValidator()(new FormControl('123'))).toEqual({ cep: '*Cep inválido!' });
    });

    it('aceita CEP de 8 dígitos', () => {
      expect(cepValidator()(new FormControl('44001000'))).toBeNull();
    });
  });

  describe('numeroCasaValidator', () => {
    const validator = numeroCasaValidator();

    it('rejeita vazio', () => {
      expect(validator(new FormControl(''))?.['required']).toBeTruthy();
    });

    it('rejeita número <= 0', () => {
      expect(validator(new FormControl('0'))?.['numeroCasa']).toBeTruthy();
    });

    it('aceita número válido', () => {
      expect(validator(new FormControl('123'))).toBeNull();
    });
  });

  describe('checkPreco / precoValidator', () => {
    it('aceita preço com vírgula decimal', () => {
      expect(checkPreco('108,50')).toBeNull();
    });

    it('aceita preço sem centavos', () => {
      expect(checkPreco('108')).toBeNull();
    });

    it('rejeita preço com ponto decimal (o formato esperado é vírgula)', () => {
      expect(checkPreco('108.50')).toContain('inválido');
    });

    it('precoValidator delega para checkPreco', () => {
      expect(precoValidator()(new FormControl('108,50'))).toBeNull();
      expect(precoValidator()(new FormControl('abc'))?.['preco']).toBeTruthy();
    });
  });

  describe('checkImagem / imagemValidator', () => {
    it('aceita tipos de imagem permitidos', () => {
      const arquivo = new File([''], 'foto.png', { type: 'image/png' });
      expect(checkImagem(arquivo)).toBeNull();
    });

    it('rejeita tipos não permitidos', () => {
      const arquivo = new File([''], 'documento.pdf', { type: 'application/pdf' });
      expect(checkImagem(arquivo)).toContain('inválido');
    });

    it('imagemValidator rejeita quando nenhum arquivo foi selecionado', () => {
      expect(imagemValidator()(new FormControl(null))?.['required']).toBeTruthy();
    });
  });
});
