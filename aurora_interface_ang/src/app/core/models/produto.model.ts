export interface Tamanho {
  tamanho: string;
}

/**
 * Formato retornado pela API em `GET /produto` e `GET /produto/:id`.
 *
 * ⚠️ Peculiaridade herdada do backend: em respostas de LEITURA, `imagem` já
 * vem como string base64, pronta para `data:image/jpeg;base64,${imagem}`.
 * Em `POST`/`PUT`, porém, o backend espera um array de bytes (`number[]`) —
 * ver `ProdutoPayload` abaixo. O legado tinha essa mesma assimetria:
 * `Produto.fromJSON` não convertia `imagem` (ficava string, vinda do GET) e
 * `Produto.toJSON` sempre serializava como array — funcionava "por
 * acidente" porque, no fluxo de criar/editar, a imagem em memória vinha
 * sempre do `FileReader` (já um array), nunca da string lida do GET.
 */
export interface ProdutoDTO {
  id: number | null;
  nome: string;
  descricao: string;
  precoUnitario: number;
  categoria: string;
  imagem: string;
  tamanhos: Tamanho[];
}

/** Modelo usado internamente na aplicação Angular (para exibição). */
export interface Produto {
  id: number | null;
  nome: string;
  descricao: string;
  precoUnitario: number;
  categoria: string;
  /** Base64 (sem prefixo `data:`), pronto para `data:image/jpeg;base64,${imagem}`. */
  imagem: string;
  tamanhos: string[];
}

/** Payload aceito por `POST /produto` e `PUT /produto/:id` (imagem como array de bytes). */
export interface ProdutoPayload {
  id: number | null;
  nome: string;
  descricao: string;
  precoUnitario: number;
  categoria: string;
  imagem: number[];
  tamanhos: Tamanho[];
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

/**
 * Monta o payload de criação/edição a partir dos dados do formulário +
 * bytes da imagem (nova, vinda de `FileReader`, ou os bytes decodificados
 * da imagem atual quando o usuário não troca a foto — ver `base64ParaBytes`).
 */
export function produtoParaPayload(
  produto: Omit<Produto, 'imagem'>,
  imagemBytes: number[],
): ProdutoPayload {
  return {
    id: produto.id,
    nome: produto.nome,
    descricao: produto.descricao,
    precoUnitario: produto.precoUnitario,
    categoria: produto.categoria,
    imagem: imagemBytes,
    tamanhos: produto.tamanhos.map((tamanho) => ({ tamanho })),
  };
}

/** Converte uma imagem (base64, sem prefixo `data:`) em array de bytes. */
export function base64ParaBytes(base64: string): number[] {
  const binario = atob(base64);
  const bytes = new Array<number>(binario.length);
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }
  return bytes;
}

/** Converte um `File` (upload) em array de bytes, via `FileReader`. */
export function arquivoParaBytes(arquivo: File): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(Array.from(new Uint8Array(reader.result as ArrayBuffer)));
    reader.onerror = () => reject(new Error('Erro ao ler imagem'));
    reader.readAsArrayBuffer(arquivo);
  });
}
