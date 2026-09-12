# Plano de Migração — Aurora Interface → Angular

Este documento acompanha a migração incremental do front-end legado
(`/` — HTML + JS vanilla + Axios) para o novo projeto Angular
`aurora_interface_ang`, mantido no **mesmo repositório** durante a transição.

O legado continua rodando normalmente enquanto migramos; nenhuma página
antiga é removida até que sua contraparte em Angular esteja validada.

## Padrões adotados

- **Standalone components** (sem NgModules), estilo do Angular 21.
- **SCSS** com tokens compartilhados em `src/styles/_tokens.scss`
  (`@use "styles/tokens" as t;`, disponível em qualquer componente via
  `includePaths: ["src"]` no `angular.json`) e mixins de breakpoint em
  `_mixins.scss`.
- **Reactive Forms** + `ValidatorFn` customizados em `shared/validators/`
  (substituem `Validators/ValidarUsuario.js`).
- **Guards funcionais** (`CanActivateFn`) com permissão declarada via
  `route.data['allow']`, substituindo o mapa `pageName -> permissões` do
  `VericacaoAcesso.js`.
- **Sessão compatível**: `AuthService` usa as mesmas chaves de
  `sessionStorage` (`userType`, `clienteInfo`) do app legado, então o login
  feito em uma versão continua válido na outra durante a transição.
- Nomenclatura de arquivos: `kebab-case`, sufixo por tipo
  (`.model.ts`, `.service.ts`, `.guard.ts`, `.interceptor.ts`).

## Simplificações conscientes (Fase 3)

- **Posicionamento dos popups**: no legado, cada popup era injetado solto no
  `<body>` e posicionado com coordenadas fixas (`top: 5.5em; left: 65%`),
  recalculadas em 4 breakpoints diferentes. Na versão Angular, cada popup
  vive dentro do próprio `<li>` do ícone (`position: relative` no `<li>`,
  `position: absolute` no popup via `styles/_popup.scss`), então não precisa
  mais de coordenadas mágicas por breakpoint.
- **`body { display: none }` até checar permissão** (`style_gerais_permissao_acesso.css`
  + `VericacaoAcesso.js` fazendo `document.body.style.display = 'block'`): não
  foi portado. Esse hack existia porque o legado só sabia se a página era
  permitida *depois* de montar o DOM. Com `authGuard` (`CanActivateFn`), a
  permissão é resolvida *antes* da rota ativar — o componente nunca chega a
  renderizar se não tiver permissão, então o "flash de conteúdo proibido" que
  o hack evitava não ocorre mais.

## Bugs do legado corrigidos (Fase 5)

- **Parte decimal do preço descartada silenciosamente**: `Produto.js` fazia
  `parseFloat(precoUnitario)` diretamente sobre a string digitada com
  vírgula (ex.: `"108,50"`). Como `parseFloat` não entende vírgula como
  separador decimal, ele parava de ler no primeiro caractere não numérico e
  retornava `108` — a parte decimal era perdida em TODO produto cadastrado
  ou editado com centavos. Corrigido em `shared/utils/preco.ts`
  (`parsePrecoBr`), que troca vírgula por ponto antes do parse. Usado tanto
  em `adicionar-produto` quanto em `editar-produto`.
- **Assimetria do campo `imagem` esclarecida**: a API retorna `imagem` como
  string base64 em `GET`, mas espera um array de bytes em `POST`/`PUT`. O
  legado não documentava isso (funcionava "por acidente"); o modelo
  (`core/models/produto.model.ts`) agora expõe essa assimetria
  explicitamente com tipos e funções de conversão (`base64ParaBytes`,
  `arquivoParaBytes`) em vez de reutilizar o mesmo tipo para os dois casos.
- **Confirmação antes de apagar produto**: o legado apagava o produto
  imediatamente ao clicar em "Apagar Produto", sem confirmação. Adicionado
  um `confirm()` antes de chamar `ProdutoService.remover()` — melhoria de
  baixo risco para evitar exclusão acidental.

## Pendência de produto, não de migração (Fase 6)

`consumer.tela_carrinho.html` e `consumer.tela_pedidos.html` **nunca tiveram
lógica real no legado** — nenhum dos dois tinha um `Application.js`
associado; eram apenas shells estáticos ("carrinho vazio", "R$ 0" fixo,
"lista de pedidos vazia"). Portamos exatamente esse comportamento
(`features/carrinho`, `features/pedidos`).

Implementar carrinho/pedidos de verdade — adicionar item, atualizar
quantidade, fechar pedido (`SimulacaoCompra`) — é uma decisão de **produto**,
não uma tarefa de migração: precisa de definição de fluxo (como o item entra
no carrinho a partir da tela de produto? o carrinho é persistido no backend
a cada alteração ou só no checkout? etc.). Os services já existem desde a
Fase 2 (`CarrinhoService`, `ItemCarrinhoService`, `SimulacaoCompraService`,
`ItemSimulacaoService`) prontos para quando essa funcionalidade for definida.

## Bugs do legado corrigidos (Fase 7)

- **`cliente_id` hardcoded em 1**: `EnderecoConsumidorApplication.js` fazia
  `const cliente_id = 1;` — todo endereço cadastrado, de qualquer
  consumidor logado, era salvo associado ao cliente de id `1`. Corrigido
  para usar o id do consumidor da sessão real (`AuthService`).
- **Inconsistência de casing entre camelCase e snake_case no backend**:
  conferindo o `toJSON()` de cada entidade legada, `Produto`/`Cliente`/
  `Funcionario` usam camelCase (`precoUnitario`, `nomeCompleto`), mas
  `Endereco`/`Carrinho`/`ItemCarrinho`/`SimulacaoCompra`/`ItemSimulacao`
  usam snake_case (`cliente_id`, `valor_total`, `preco_unitario`...). Os
  services desse segundo grupo, criados na Fase 2, mandavam os campos em
  camelCase direto pro backend — **estavam quebrados** (nunca tinham sido
  exercitados por uma tela real até agora). Corrigido com o mesmo padrão
  DTO↔domínio já usado em Produto/Cliente: `EnderecoDTO`, `CarrinhoDTO`,
  `ItemCarrinhoDTO`, `SimulacaoCompraDTO`, `ItemSimulacaoDTO` (snake_case) +
  funções `fromDTO`/`toDTO` convertendo para os modelos camelCase
  (`Endereco`, `Carrinho`, etc.) usados no resto da aplicação.
- **Mapeamento de campo preservado (não é bug, é comportamento intencional
  mantido)**: o formulário do legado tinha um campo rotulado "logradouro"
  que, na hora de montar o `Endereco`, ia parar no campo `complemento` da
  entidade (`new Endereco(cliente_id, rua, numero_casa, logradouro, ...)`
  vs. construtor `(cliente_id, rua, numero, complemento, ...)`). Mantido
  assim na migração para não incompatibilizar com dados já salvos.

## Rotas planejadas (usadas nos `routerLink` do Header/popups)

Ainda não implementadas (entram nas Fases 4–8), mas os componentes já
referenciam estes paths para não travar o trabalho:

| Path | Página (legado) |
|---|---|
| `/` | `index.html` |
| `/login` | `tela_login_consumidor.html` |
| `/cadastro` | `tela_cadastro_consumidor.html` |
| `/funcionario/login` | `tela_login_funcionario.html` |
| `/funcionario/cadastro` | `employer.tela_cadastro_funcionario.html` |
| `/produtos` | `tela_listar_produto.html` |
| `/produtos/:id` | `tela_produto_consumidor.html` |
| `/produtos/adicionar` | `employer.tela_adicionar_produto.html` |
| `/produtos/:id/editar` | `employer.tela_edicao_produto.html` |
| `/carrinho` | `consumer.tela_carrinho.html` |
| `/pedidos` | `consumer.tela_pedidos.html` |
| `/endereco/cadastro` | (formulário de endereço) |
| `/acesso-negado` | `acesso-negado.html` |



```
src/
  styles/          # tokens e mixins SCSS globais (fora de app/, usados por src/styles.scss)
  app/
    core/            # infraestrutura transversal (sem UI)
      services/       # ProdutoService, AuthService, (a criar: Cliente/Funcionario/Endereco/Carrinho...)
      guards/         # authGuard
      interceptors/   # errorLoggingInterceptor
      models/         # equivalentes às Entities/*.js do legado
    shared/          # reutilizável entre features, com UI
      components/     # header, footer, popups
      validators/     # equivalente a Validators/ValidarUsuario.js
    features/        # 1 pasta por domínio de página (pages "smart")
    auth/pages/{login-consumidor,login-funcionario,cadastro-consumidor,cadastro-funcionario}
    produtos/pages/{listar-produtos,produto-detalhe,adicionar-produto,editar-produto}
    carrinho/pages/carrinho
    pedidos/pages/pedidos
    endereco/pages/cadastro-endereco
    home/pages/home
    erro/pages/acesso-negado
```

## Fases

- [x] **Fase 1 — Fundação**: scaffold Angular + SCSS, tokens de design,
      `HttpClient` + `environment`, interceptor de erro, `ProdutoService`,
      `AuthService`, `authGuard`, validators customizados.
- [x] **Fase 2 — Core restante**: `ClienteService` (com `login(email, senha)`),
      `FuncionarioService` (com `login(cpf, senha)`), `EnderecoService`,
      `CarrinhoService`, `ItemCarrinhoService`, `SimulacaoCompraService`,
      `ItemSimulacaoService` (equivalentes aos demais `Gateway/*.js`).
- [x] **Fase 3 — Shell/Shared UI**: `HeaderComponent` (com os 8 popups como
      componentes filhos: consumidor logado/deslogado, funcionário por
      cargo, suporte, carrinho), `FooterComponent`, shell raiz (`app.html`),
      Bootstrap 5.3.6 instalado (grid `row`/`col-*` usada em todo o legado).
- [x] **Fase 4 — Autenticação/Cadastro**: login consumidor, login
      funcionário, cadastro consumidor, cadastro funcionário. Rotas com
      lazy loading (`loadComponent`) e `authGuard` (`guest-only` nos logins
      e cadastro de consumidor; `ADMINISTRADOR_GERAL`/`GERENCIADOR_FUNCIONARIOS`
      no cadastro de funcionário).
- [x] **Fase 5 — Produtos**: listagem (`/produtos`), detalhe/consumidor
      (`/produtos/:id`), adicionar (`/produtos/adicionar`, admin), editar
      (`/produtos/:id/editar`, admin, com o padrão "campo vazio mantém valor
      atual" do legado preservado). 2 bugs do legado corrigidos nesta fase
      (ver seção de correções abaixo).
- [x] **Fase 6 — Carrinho & Pedidos**: portados como shells estáticos, fiéis
      ao legado (nenhum dos dois tinha lógica real implementada — ver nota
      abaixo). Rotas `/carrinho` e `/pedidos`, restritas a `costumer`.
- [x] **Fase 7 — Endereço**: cadastro de endereço (`/endereco/cadastro`,
      restrito a `costumer`). 2 bugs do legado corrigidos (ver seção de
      correções).
- [ ] **Fase 8 — Home & páginas de erro** (`index`, `acesso-negado`).
- [ ] **Fase 9 — Polimento**: lazy loading de rotas, testes unitários,
      revisão de acessibilidade/responsividade, remoção do app legado.

## Mapeamento arquivo a arquivo (legado → Angular)

| Legado | Novo | Status |
|---|---|---|
| `Config/AxiosClient.js` | `provideHttpClient` + `environment.ts` | ✅ |
| `Infrastructure/Entities/*.js` | `core/models/*.model.ts` | ✅ (Produto, Cliente, Funcionario, Endereco, Carrinho/Item*) |
| `Infrastructure/Gateway/ProdutoGateway.js` + `*ProdutoService.js` | `core/services/produto.service.ts` | ✅ |
| `Infrastructure/Gateway/ClienteGateway.js` + `Cadastro/LoginConsumidorService.js` | `core/services/cliente.service.ts` (`login(email, senha)`) | ✅ |
| `Infrastructure/Gateway/FuncionarioGateway.js` + `Cadastro/LoginFuncionarioService.js` | `core/services/funcionario.service.ts` (`login(cpf, senha)`) | ✅ |
| `Infrastructure/Gateway/EnderecoGateway.js` | `core/services/endereco.service.ts` | ✅ |
| `Infrastructure/Gateway/CarrinhoGateway.js` / `ItemCarrinhoGateway.js` | `core/services/carrinho.service.ts` / `item-carrinho.service.ts` | ✅ |
| `Infrastructure/Gateway/SimulacaoCompraGateway.js` / `ItemSimulacaoGateway.js` | `core/services/simulacao-compra.service.ts` / `item-simulacao.service.ts` | ✅ |
| `Infrastructure/Validators/ValidarUsuario.js` | `shared/validators/aurora-validators.ts` | ✅ |
| `Infrastructure/Persistence/VerificarPersistence.js` + `EncerrarSessao.js` | `core/services/auth.service.ts` | ✅ |
| `Infrastructure/Persistence/VericacaoAcesso.js` | `core/guards/auth.guard.ts` | ✅ |
| `Infrastructure/Interacoes/HeaderPopUp.js` + `Components/Popups/*.html` | `shared/components/header` + `shared/components/popups/*` (8 componentes) | ✅ |
| `Infrastructure/Application/LoginConsumidorApplication.js` | `features/auth/pages/login-consumidor` | ✅ |
| `Infrastructure/Application/LoginFuncionarioApplication.js` | `features/auth/pages/login-funcionario` | ✅ |
| `Infrastructure/Application/CadastroConsumidorApplication.js` | `features/auth/pages/cadastro-consumidor` | ✅ |
| `Infrastructure/Application/CadastroFuncionarioApplication.js` | `features/auth/pages/cadastro-funcionario` | ✅ |
| `Infrastructure/Application/EnderecoConsumidorApplication.js` | `features/endereco/pages/cadastro-endereco` | ✅ |
| `Infrastructure/Application/AdicionarProdutoApplication.js` | `features/produtos/pages/adicionar-produto` | ✅ |
| `Infrastructure/Application/EdicaoProdutoApplication.js` + `Interacoes/EdicaoProduto.js` + `DeletarProdutoApplication.js` | `features/produtos/pages/editar-produto` | ✅ |
| `Infrastructure/Application/ProdutoConsumidorApplication.js` | `features/produtos/pages/produto-detalhe` | ✅ |
| `Infrastructure/Application/ListarProdutosApplication.js` | `features/produtos/pages/listar-produtos` | ✅ |
| `Interacoes/VitrineProduto.js` | `home` (vitrine da página inicial) | ⏳ (Fase 8) |
| `pages/consumer.tela_carrinho.html` | `features/carrinho/pages/carrinho` (shell estático, fiel ao legado) | ✅ |
| `pages/consumer.tela_pedidos.html` | `features/pedidos/pages/pedidos` (shell estático, fiel ao legado) | ✅ |
| `pages/acesso-negado.html` + `RedirecionarIndex.js` | `features/erro/pages/acesso-negado` | ⏳ |
| `index.html` | `features/home/pages/home` | ⏳ |
