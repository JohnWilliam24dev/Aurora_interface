/**
 * Formato aceito/retornado pela API (snake_case — ver `Endereco.toJSON()`
 * no legado). Diferente de Produto/Cliente/Funcionario, que usam camelCase.
 */
export interface EnderecoDTO {
  id?: number;
  cliente_id: number;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

/** Modelo usado internamente na aplicação Angular. */
export interface Endereco {
  id?: number;
  clienteId: number;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export function enderecoFromDTO(dto: EnderecoDTO): Endereco {
  return {
    id: dto.id,
    clienteId: dto.cliente_id,
    rua: dto.rua,
    numero: dto.numero,
    complemento: dto.complemento,
    bairro: dto.bairro,
    cidade: dto.cidade,
    estado: dto.estado,
    cep: dto.cep,
  };
}

export function enderecoToDTO(endereco: Endereco): EnderecoDTO {
  return {
    id: endereco.id,
    cliente_id: endereco.clienteId,
    rua: endereco.rua,
    numero: endereco.numero,
    complemento: endereco.complemento,
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    estado: endereco.estado,
    cep: endereco.cep,
  };
}
