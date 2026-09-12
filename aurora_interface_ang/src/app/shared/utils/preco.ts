/**
 * Converte um preço digitado no formato brasileiro ("108,50") para número
 * (108.5).
 *
 * ⚠️ Correção de bug do legado: `Produto.js` fazia
 * `parseFloat(precoUnitario)` diretamente sobre a string com vírgula
 * (ex.: "108,50"). Como `parseFloat` não entende vírgula como separador
 * decimal, ele parava de ler no primeiro caractere não numérico e retornava
 * `108` — a parte decimal era descartada silenciosamente. Aqui trocamos a
 * vírgula por ponto antes do parse.
 */
export function parsePrecoBr(valor: string): number {
  return parseFloat(valor.replace(',', '.'));
}
