export interface Tamanho {
  tamanho: string;
}

/** Formato bruto recebido/enviado pela API (equivalente ao Produto.toJSON/fromJSON legado). */
export interface ProdutoDTO {
  id: number | null;
  nome: string;
  descricao: string;
  precoUnitario: number;
  categoria: string;
  imagem: number[];
  tamanhos: Tamanho[];
}

/** Modelo usado internamente na aplicação Angular. */
export interface Produto {
  id: number | null;
  nome: string;
  descricao: string;
  precoUnitario: number;
  categoria: string;
  imagem: number[];
  tamanhos: string[];
}

export function produtoFromDTO(dto: ProdutoDTO): Produto {
  return {
    id: dto.id,
    nome: dto.nome,
    descricao: dto.descricao,
    precoUnitario: dto.precoUnitario,
    categoria: dto.categoria,
    imagem: dto.imagem,
    tamanhos: dto.tamanhos?.map((t) => t.tamanho) ?? [],
  };
}

export function produtoToDTO(produto: Produto): ProdutoDTO {
  return {
    id: produto.id,
    nome: produto.nome,
    descricao: produto.descricao,
    precoUnitario: produto.precoUnitario,
    categoria: produto.categoria,
    imagem: produto.imagem,
    tamanhos: produto.tamanhos.map((tamanho) => ({ tamanho })),
  };
}
