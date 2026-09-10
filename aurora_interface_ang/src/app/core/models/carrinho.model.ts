export interface ItemCarrinho {
  carrinhoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export interface Carrinho {
  clienteId: number;
  valorTotal: number;
  list: ItemCarrinho[];
}

export interface ItemSimulacao {
  simulacaoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export interface SimulacaoCompra {
  clienteId: number;
  dataSimulacao: string;
  valorTotal: number;
  status: string;
  enderecoId: number;
  list: ItemSimulacao[];
}
