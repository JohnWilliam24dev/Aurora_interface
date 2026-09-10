export type Cargo =
  | 'ADMINISTRADOR_GERAL'
  | 'GERENCIADOR_FUNCIONARIOS'
  | 'GERENCIADOR_ROUPAS';

export interface Funcionario {
  id: number | null;
  nomeCompleto: string;
  email: string;
  senha: string;
  cpf: string;
  cargo: Cargo;
  status: string | null;
}
