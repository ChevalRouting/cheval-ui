# Development

## Prerequisites

- Docker with Compose support for the container workflow.

## Package loop

```bash
make typecheck
make build
```

The generated package is written to `dist/`. Applications can consume a packed
tarball for reproducible local builds, or use a file dependency pointing to a
sibling checkout during development.

## Workbench loop

Run the source-linked development server in Docker:

```bash
make dev
```

Open <http://localhost:6006>. In serve mode, Vite maps the public package entry points to the
library source. Changes under `src/` and `showcase/src/` therefore update without rebuilding
`dist/`. The production showcase build does not use these aliases and verifies the package
boundary.

Run the auto-reloading container loop:

```bash
make showcase
```

Open <http://localhost:6006>. Use another port with `make showcase PORT=6007`.
Source directories are mounted into the Vite container and polling is enabled so file changes are
detected reliably through Docker Desktop. Use `make showcase-build` for the isolated production
image check.

## Verification

Before committing, run the same checks as CI:

```bash
make check
```

This checks repository style, package types and output, the package-boundary showcase build, and
the contents of the generated npm archive. All Node and npm commands execute inside the builder
image. Use `make archive` to keep the versioned package in the repository root.
