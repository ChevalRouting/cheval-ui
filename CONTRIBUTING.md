# Contributing to cheval-ui

## Development process

Install Docker with Compose support, then start the workbench:

```sh
make dev
```

Develop reusable behavior under `src/` and add a meaningful component example under `showcase/src/`.
Applications must be able to use the component without product-specific routes, data access,
logos, or language. Import the component through a public `cheval-ui` entry point in the showcase.

Before opening a pull request, run:

```sh
make check
```

Review visual changes in light and dark themes. Exercise interactive, disabled, empty, loading,
error, and responsive states when they apply. Update the public export and consumer documentation
for additions or API changes.

## Code and commit style

Follow [docs/code-style.md](docs/code-style.md). Commit subjects use a lowercase imperative phrase
with an optional area, such as `showcase: add accordion component examples`. Do not use Conventional Commit
types or trailers. Pull requests validate every commit subject.

## Release process

Releases are tag-driven and use the version in `package.json`:

1. Update `package.json` and `package-lock.json` to the intended semantic version.
2. Run `make check` and inspect the showcase production build.
3. Commit with a subject such as `ui: prepare cheval-ui 1.1.0`.
4. Create and push the matching annotated tag, for example `v1.1.0`.
5. Run `make archive`, then verify the GitHub Release workflow and its `cheval-ui-1.1.0.tgz` asset.
6. Install that exact asset in a consumer and run its typecheck and production build.

The release workflow rejects a tag that does not match `package.json`, rebuilds the package, and
attaches an npm-compatible gzip-compressed tar archive to a GitHub release with generated notes.
