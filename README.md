# Gestão de Filmes (OMDb) — Teste Microkids

Monorepo **pnpm** com **Angular 19** (frontend), **NestJS 11** (API), **PostgreSQL** e **Prisma 6**. Autenticação **JWT**, perfis **ADMIN** e **COMUM**, integração com **OMDb API** e UI com **DevExtreme**.

## Pré-requisitos

- Node.js **20 LTS** (recomendado; evite versões ímpares em produção)
- pnpm **10+**
- Docker (para PostgreSQL local) — opcional se você já tiver um Postgres

## Configuração

1. Copie variáveis de ambiente da API:

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

2. Preencha **`OMDB_API_KEY`** em `apps/api/.env` ([OMDb API key](https://www.omdbapi.com/apikey.aspx)).

3. Ajuste **`JWT_SECRET`** (string longa e aleatória).

4. Suba o banco e aplique migrations:

   ```bash
   pnpm db:up
   pnpm db:migrate
   pnpm db:seed
   ```

   O seed cria o **administrador de teste** (sem esse passo o login admin falha):

   - **E-mail:** `admin@microkids.test`
   - **Senha:** `admin123`

   O login ignora maiúsculas/minúsculas no e-mail. Na interface, **ADMIN** só acessa **Rankings** e **Usuários**; busca, favoritos e assistidos ficam só para **COMUM** (e a API bloqueia essas rotas para não-admin).

## Como rodar

Na raiz do repositório:

```bash
pnpm install
pnpm dev
```

- **API:** `http://localhost:3000/api`  
- **Web:** `http://localhost:4200`

Ou em terminais separados:

```bash
pnpm dev:api
pnpm dev:web
```

### Build de produção

```bash
pnpm build
```

## Estrutura

| Pasta        | Descrição                                      |
| ------------ | ---------------------------------------------- |
| `apps/api`   | NestJS + Prisma + JWT + integração OMDb        |
| `apps/web`   | Angular (rotas, guards, DevExtreme)           |

## API (resumo)

Todas as rotas abaixo do prefixo **`/api`**.

| Método | Rota | Autenticação | Descrição |
| ------ | ---- | ------------ | --------- |
| POST | `/auth/register` | — | Cadastro (sempre **COMUM**) |
| POST | `/auth/login` | — | Login, retorna JWT |
| GET | `/movies/search?title=` | JWT **COMUM** | Busca na OMDb (via backend) |
| POST | `/favorites` | JWT **COMUM** | Body `{ "imdbId": "tt..." }` — favoritar |
| GET | `/favorites` | JWT **COMUM** | Lista favoritos do usuário |
| POST | `/watched` | JWT **COMUM** | Body `{ "imdbId": "tt..." }` — assistido |
| GET | `/watched` | JWT **COMUM** | Lista assistidos do usuário |
| GET | `/admin/users` | JWT **ADMIN** | Lista usuários |
| GET | `/admin/users/:id` | JWT **ADMIN** | Detalhe + favoritos + assistidos |
| GET | `/admin/rankings/favorites` | JWT **ADMIN** | Ranking mais favoritados |
| GET | `/admin/rankings/watched` | JWT **ADMIN** | Ranking mais assistidos |

Validação de entrada com **Zod** (`nestjs-zod` + `ZodValidationPipe` global).

## Tecnologias

- **Frontend:** Angular 19, RxJS, DevExtreme 25, `@angular/animations`
- **Backend:** NestJS, Passport JWT, bcryptjs, Axios (OMDb), Zod
- **Dados:** PostgreSQL, Prisma ORM
- **Infra local:** Docker Compose (`docker-compose.yml`)

## Decisões técnicas

1. **OMDb só no backend** — chave de API não exposta no browser; tratamento centralizado de timeout/erros HTTP e `Response: False` da OMDb.
2. **Filme persistido após validação OMDb** — `imdbId` é confirmado com `i=` antes de criar favorito/assistido; `Movie` é *upsert* com dados atualizados.
3. **Duplicidade** — regra na aplicação + índice único `(userId, movieId)` em `Favorite` e `Watched`.
4. **Autorização** — `JwtStrategy` recarrega usuário no banco; `RolesGuard` + `@Roles()`: rotas **admin** só `ADMIN`; busca/favoritos/assistidos só `COMUM`, alinhado ao enunciado (papéis separados).
5. **Arquitetura em estilo Transaction Script** — serviços por caso de uso (`AuthService`, `MoviesService`, `FavoritesService`, `WatchedService`, `AdminService`, `OmdbService`) com fluxos sequenciais explícitos.
6. **Prisma 6** — mantida conexão direta a Postgres sem *driver adapter* exigido pelo Prisma 7, simplificando o teste local.

## GitFlow (recomendado na entrega)

- `main` — estável / entrega do teste  
- `develop` — integração  
- *Features:* `feature/nome` a partir de `develop`  
- *Releases:* `release/x.y.z` quando for fechar a entrega  

Commits com mensagens claras (`feat:`, `fix:`, `chore:`) facilitam a avaliação.

## Licença

Código produzido para processo seletivo — uso conforme política da empresa avaliadora.
