import { parsePrecoBr } from './preco';

describe('parsePrecoBr', () => {
  it('converte preço com vírgula decimal corretamente', () => {
    expect(parsePrecoBr('108,50')).toBe(108.5);
  });

  it('não descarta a parte decimal (bug do parseFloat direto sobre vírgula)', () => {
    // Regressão: `parseFloat('108,50')` sozinho retorna 108, perdendo os centavos.
    expect(parsePrecoBr('108,50')).not.toBe(108);
  });

  it('converte preço sem centavos', () => {
    expect(parsePrecoBr('108')).toBe(108);
  });

  it('converte preço com um dígito de centavo', () => {
    expect(parsePrecoBr('99,9')).toBe(99.9);
  });
});
