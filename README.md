# Dynatrace Backstage Plugins

This repository contains a collection of Backstage plugins for Dynatrace.

- [Dynatrace Backstage Plugins](#dynatrace-backstage-plugins)
  - [Plugins](#plugins)
  - [Getting Started](#getting-started)
  - [Development](#development)
    - [(Conventional) Commit Messages](#conventional-commit-messages)

## Plugins

- [DQL](./plugins/dql/README.md) - A plugin showing DQL query results from
  Dynatrace in Backstage.
- [DQL Backend](./plugins/dql-backend/README.md) - The backend for the DQL
  plugin.
- [DQL Common](./plugins/dql-common/README.md) - Common functionality shared
  between the DQL frontend and backend plugin.

## Getting Started

The repository contains a full Backstage installation at its root, with the
individual plugins in the `plugins` directory. Backstage is configured to
include the plugins, so you can start the app and see them in action.

Create a `app-config.local.yaml` file (excluded by .gitignore) configuring the
connection to the Dynatrace environment:

```yaml
dynatrace:
  environments:
    - name: xxxxxxxx
      url: https://xxxxxxxx.sprint.apps.dynatracelabs.com
      tokenUrl: https://sso-sprint.dynatracelabs.com/sso/oauth2/token
      accountUrn: <accountUrn>
      clientId: <clientId>
      clientSecret: <clientSecret>
```

Kubernetes pods with a `backstage.io/component` label will be listed for the
corresponding backstage component:

```yaml
backstage.io/component: <backstage-component-name>.<backstage-namespace>
```

You can also register your own custom queries:

```yaml
dynatrace:
  queries:
    my-custom-query: >
      fetch events | filter event.kind == "DAVIS_EVENT" | fields event.kind,
      timestamp
```

To include the result table for your custom query, you would reference the query
by its ID with the `custom.` prefix:

```jsx
<EntityDqlQueryCard
  title="My Custom Query Results"
  queryId="custom.my-custom-query"
/>
```

To start the app, run:

```sh
yarn install
yarn dev
```

Backstage is configured to be self documenting, it includes the catalog
information for the plugins. You can see the catalog at
[http://localhost:3000/catalog](http://localhost:3000/catalog).

## Development

After your initial checkout, run `yarn install` to get the project set up. This
also installs Husky hooks, which will run on every commit. If the Husky
installation fails, use `yarn prepare` to install the hooks manually.

We use a small set of tools to keep the repository tidy and promote best
practices:

- [Prettier](https://prettier.io/) - Code formatter
- [ESLint](https://eslint.org/) - Linter
- [Lerna](https://lerna.js.org/) - Monorepo management
- [Lint Staged](https://github.com/lint-staged/lint-staged#readme) - Run linters
  on staged files
- [Husky](https://typicode.github.io/husky/#/) - Git hooks
- [Commitlint](https://commitlint.js.org/#/) - Commit message linting
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) -
  Commit message format
- Automated versioning and changelog generation (pending, either using
  [Commitizen](https://github.com/commitizen/cz-cli) or
  [Semantic Release](https://github.com/semantic-release/semantic-release) or
  even just Lerna)

### (Conventional) Commit Messages

To simplify semantic versioning and changelog generation, we use
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This
means that commit messages should follow a specific format:

```commit
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

To keep it simple, we recommend a reduced set of allowed types (though, all
[conventional commit types](https://www.conventionalcommits.org/en/v1.0.0/#summary)
are allowed):

- `fix` or `fix!`: A (breaking) bug fix; influences the patch version (resp.
  major version, if breaking)
- `feat` or `feat!`: A (breaking) new feature; influences the minor version
  (resp. major version, if breaking)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `docs`: Documentation only changes
- `chore`: Anything else

The optional scope should be the name of the package affected by the change.
E.g. `fix(dql): fix a bug in the DQL plugin`.

Commitlint ensures that the package is one of the known Lerna packages.

### Code Style and ADRs

We aim to adhere to the
[Architecture Decision Records](https://github.com/backstage/backstage/tree/master/docs/architecture-decisions)
compiled by the Backstage team.

The ADRs with the most impact on development are:

- [ADR003](https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr003-avoid-default-exports.md):
  Avoid default exports
- [ADR004](https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr004-module-export-structure.md):
  Export components using traceable `index.ts` files.
- [ADR006](https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr006-avoid-react-fc.md):
  Avoid `React.FC` and `React.SFC`.
- [ADR007](https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr007-use-msw-to-mock-service-requests.md):
  Use [msw](https://mswjs.io/) to mock service requests (avoid mocking of
  `fetch`).
- [ADR010](https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr010-luxon-date-library.md):
  Use [Luxon](https://moment.github.io/luxon/) for date/time handling.
- [ADR012](https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr012-use-luxon-locale-and-date-presets.md):
  Use Luxon's `toLocaleString` when formatting dates.
- [ADR011](https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr011-plugin-package-structure.md):
  Use a specific package structure for plugins.
- [ADR013](https://github.com/backstage/backstage/blob/master/docs/architecture-decisions/adr013-use-node-fetch.md):
  Use [node-fetch](https://www.npmjs.com/package/node-fetch) in Backend
  packages, stick to `fetchApiRef` in Frontend packages.

Besides that, we aim to provide a consistent codebase, thus we add the following
soft-rules:

- Prefer `type` over `interface` for type definitions.
- Prefer fat arrow functions over `function` keyword.
