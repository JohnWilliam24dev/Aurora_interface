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

## Estrutura de pastas

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
- [ ] **Fase 3 — Shell/Shared UI**: `HeaderComponent` (com popups como
      componentes filhos: consumidor logado/deslogado, funcionário por
      cargo, suporte, carrinho), `FooterComponent`, layout raiz (`app.html`).
- [ ] **Fase 4 — Autenticação/Cadastro**: login consumidor, login
      funcionário, cadastro consumidor, cadastro funcionário.
- [ ] **Fase 5 — Produtos**: listagem (com filtro de categoria),
      detalhe/consumidor, adicionar (admin), editar (admin).
- [ ] **Fase 6 — Carrinho & Pedidos**.
- [ ] **Fase 7 — Endereço**.
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
| `Infrastructure/Interacoes/HeaderPopUp.js` + `Components/Popups/*.html` | `shared/components/header` + `shared/components/popups/*` | ⏳ |
| `Infrastructure/Application/LoginConsumidorApplication.js` | `features/auth/pages/login-consumidor` | ⏳ |
| `Infrastructure/Application/LoginFuncionarioApplication.js` | `features/auth/pages/login-funcionario` | ⏳ |
| `Infrastructure/Application/CadastroConsumidorApplication.js` | `features/auth/pages/cadastro-consumidor` | ⏳ |
| `Infrastructure/Application/CadastroFuncionarioApplication.js` | `features/auth/pages/cadastro-funcionario` | ⏳ |
| `Infrastructure/Application/EnderecoConsumidorApplication.js` | `features/endereco/pages/cadastro-endereco` | ⏳ |
| `Infrastructure/Application/AdicionarProdutoApplication.js` | `features/produtos/pages/adicionar-produto` | ⏳ |
| `Infrastructure/Application/EdicaoProdutoApplication.js` + `Interacoes/EdicaoProduto.js` + `DeletarProdutoApplication.js` | `features/produtos/pages/editar-produto` | ⏳ |
| `Infrastructure/Application/ProdutoConsumidorApplication.js` | `features/produtos/pages/produto-detalhe` | ⏳ |
| `Infrastructure/Application/ListarProdutosApplication.js` + `Interacoes/VitrineProduto.js` | `features/produtos/pages/listar-produtos` + `home` | ⏳ |
| `pages/consumer.tela_carrinho.html` | `features/carrinho/pages/carrinho` | ⏳ |
| `pages/consumer.tela_pedidos.html` | `features/pedidos/pages/pedidos` | ⏳ |
| `pages/acesso-negado.html` + `RedirecionarIndex.js` | `features/erro/pages/acesso-negado` | ⏳ |
| `index.html` | `features/home/pages/home` | ⏳ |
