# Architecture

## Package boundary

Applications consume `cheval-ui` through its public exports. They must not
import files from `src/` or depend on another application's implementation details.
The main entry point contains primitives, composites, layouts, hooks, and
formatters. Charts and terminal support use separate optional entry points so
applications only install those peers when needed.

Product identity and behavior remain outside the kit. Applications pass logos,
navigation, banners, footer content, API callbacks, and authentication behavior
into neutral components.

## Repository layout

| Path | Responsibility |
|------|----------------|
| `src/components/ui/` | visual primitives |
| `src/components/` | reusable composite components |
| `src/layouts/` | application-neutral layout shells |
| `src/lib/` | hooks, formatters, and class utilities |
| `src/styles/` | semantic theme tokens |
| `showcase/` | independent package consumer and component workbench |
| `docs/` | design system documentation |

## Workbench isolation

The showcase is deliberately a separate package. During the container build,
Cheval UI is built first and installed into `showcase` through `file:..`. The
showcase never imports source files directly. A successful workbench build
therefore verifies package exports, generated declarations, styles, Tailwind
integration, and local unpublished consumption.

