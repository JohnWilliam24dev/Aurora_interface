export interface ClienteDTO {
  id?: number;
  nomeCompleto: string;
  email: string;
  senha: string;
  carrinho_id?: number | null;
}

export interface Cliente {
  id?: number;
  nomeCompleto: string;
  email: string;
  senha: string;
  carrinhoId: number | null;
}

export function clienteFromDTO(dto: ClienteDTO): Cliente {
  return {
    id: dto.id,
    nomeCompleto: dto.nomeCompleto,
    email: dto.email,
    senha: dto.senha,
    carrinhoId: dto.carrinho_id ?? null,
  };
}

export function clienteToDTO(cliente: Cliente): Omit<ClienteDTO, 'carrinho_id'> {
  return {
    nomeCompleto: cliente.nomeCompleto,
    email: cliente.email,
    senha: cliente.senha,
  };
}
