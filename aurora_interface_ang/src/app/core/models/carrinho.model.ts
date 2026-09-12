/**
 * Formatos DTO (snake_case) e domínio (camelCase) de Carrinho, ItemCarrinho,
 * SimulacaoCompra e ItemSimulacao — ver `toJSON()` de cada entidade no
 * legado. Diferente de Produto/Cliente/Funcionario, este grupo usa
 * snake_case na API.
 */

// ---------- ItemCarrinho ----------

export interface ItemCarrinhoDTO {
  id?: number;
  carrinho_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}

export interface ItemCarrinho {
  id?: number;
  carrinhoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export function itemCarrinhoFromDTO(dto: ItemCarrinhoDTO): ItemCarrinho {
  return {
    id: dto.id,
    carrinhoId: dto.carrinho_id,
    produtoId: dto.produto_id,
    quantidade: dto.quantidade,
    precoUnitario: dto.preco_unitario,
  };
}

export function itemCarrinhoToDTO(item: ItemCarrinho): ItemCarrinhoDTO {
  return {
    id: item.id,
    carrinho_id: item.carrinhoId,
    produto_id: item.produtoId,
    quantidade: item.quantidade,
    preco_unitario: item.precoUnitario,
  };
}

// ---------- Carrinho ----------

export interface CarrinhoDTO {
  id?: number;
  cliente_id: number;
  valor_total: number;
  list: ItemCarrinhoDTO[];
}

export interface Carrinho {
  id?: number;
  clienteId: number;
  valorTotal: number;
  list: ItemCarrinho[];
}

export function carrinhoFromDTO(dto: CarrinhoDTO): Carrinho {
  return {
    id: dto.id,
    clienteId: dto.cliente_id,
    valorTotal: dto.valor_total,
    list: (dto.list ?? []).map(itemCarrinhoFromDTO),
  };
}

export function carrinhoToDTO(carrinho: Carrinho): CarrinhoDTO {
  return {
    id: carrinho.id,
    cliente_id: carrinho.clienteId,
    valor_total: carrinho.valorTotal,
    list: carrinho.list.map(itemCarrinhoToDTO),
  };
}

// ---------- ItemSimulacao ----------

export interface ItemSimulacaoDTO {
  id?: number;
  simulacao_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}

export interface ItemSimulacao {
  id?: number;
  simulacaoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export function itemSimulacaoFromDTO(dto: ItemSimulacaoDTO): ItemSimulacao {
  return {
    id: dto.id,
    simulacaoId: dto.simulacao_id,
    produtoId: dto.produto_id,
    quantidade: dto.quantidade,
    precoUnitario: dto.preco_unitario,
  };
}

export function itemSimulacaoToDTO(item: ItemSimulacao): ItemSimulacaoDTO {
  return {
    id: item.id,
    simulacao_id: item.simulacaoId,
    produto_id: item.produtoId,
    quantidade: item.quantidade,
    preco_unitario: item.precoUnitario,
  };
}

// ---------- SimulacaoCompra ----------

export interface SimulacaoCompraDTO {
  id?: number;
  cliente_id: number;
  data_simulacao: string;
  valor_total: number;
  status: string;
  endereco_id: number;
  list: ItemSimulacaoDTO[];
}

export interface SimulacaoCompra {
  id?: number;
  clienteId: number;
  dataSimulacao: string;
  valorTotal: number;
  status: string;
  enderecoId: number;
  list: ItemSimulacao[];
}

export function simulacaoCompraFromDTO(dto: SimulacaoCompraDTO): SimulacaoCompra {
  return {
    id: dto.id,
    clienteId: dto.cliente_id,
    dataSimulacao: dto.data_simulacao,
    valorTotal: dto.valor_total,
    status: dto.status,
    enderecoId: dto.endereco_id,
    list: (dto.list ?? []).map(itemSimulacaoFromDTO),
  };
}

export function simulacaoCompraToDTO(simulacao: SimulacaoCompra): SimulacaoCompraDTO {
  return {
    id: simulacao.id,
    cliente_id: simulacao.clienteId,
    data_simulacao: simulacao.dataSimulacao,
    valor_total: simulacao.valorTotal,
    status: simulacao.status,
    endereco_id: simulacao.enderecoId,
    list: simulacao.list.map(itemSimulacaoToDTO),
  };
}
