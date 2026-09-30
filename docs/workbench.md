# Component workbench

The workbench is a Storybook-like visual catalog served as a standalone static
application. It depends on the component library without requiring a consuming
application or backend.

## Docker Compose

```bash
docker compose up --build
```

The service is available at <http://localhost:6006>. Override the published
port with `CHEVAL_UI_PORT=6007 docker compose up --build`.

The default Compose service runs Vite with mounted library and showcase sources. Polling is enabled
so edits trigger hot module replacement across Docker Desktop filesystems. Dependencies remain in
the image and do not overwrite host `node_modules`.

Build the isolated production nginx image with:

```bash
make showcase-build
```

The production image uses a multi-stage build:

1. Install and build the root Cheval UI package.
2. Install the built package into the independent `showcase` application.
3. Build the Vite application.
4. Serve static assets from nginx.

## Source-linked development

From the repository root:

```bash
make dev
```

The development server is available at <http://localhost:6006>. It preserves public
`cheval-ui`, `cheval-ui/charts`, `cheval-ui/terminal`, and `cheval-ui/styles.css` imports while
resolving them to library source. This keeps the example honest and gives component changes hot
reload. The production showcase build deliberately consumes `dist/` instead, catching missing exports
or package files before release.

## Adding a component example

Add the component to the appropriate category under `showcase/src/`. A
component example should display meaningful variants, interactive states, disabled
states where relevant, and both light and dark mode behavior. Import only from
the public `cheval-ui` entry points.

Keep product examples generic. A component belongs in the kit only when more
than one application can use it without carrying product-specific language or
behavior.
