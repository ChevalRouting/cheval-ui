CONTAINER ?= docker
PORT ?= 6006
BUILDER_IMAGE ?= cheval-ui-builder
WORKSPACE := $(CURDIR)
BUILDER_RUN = $(CONTAINER) run --rm \
	-v "$(WORKSPACE):/workspace" \
	-v /workspace/node_modules \
	-v /workspace/showcase/node_modules \
	$(BUILDER_IMAGE)

.PHONY: archive build builder check clean dev lock typecheck showcase showcase-build showcase-down showcase-logs verify-tag help

help:
	@echo "make builder          build the Node development image"
	@echo "make build            build the cheval-ui package in Docker"
	@echo "make archive          build and keep the versioned .tgz package"
	@echo "make check            run all release-readiness checks in Docker"
	@echo "make dev              run the source-linked showcase with hot reload"
	@echo "make lock             refresh npm lockfiles in Docker"
	@echo "make typecheck        type-check the package"
	@echo "make showcase         run the auto-reloading workbench on :$(PORT)"
	@echo "make showcase-build   build the production workbench image"
	@echo "make showcase-down    stop the workbench"
	@echo "make showcase-logs    follow workbench logs"
	@echo "make clean            remove build output and packaged archives"

clean:
	rm -rf dist showcase/dist
	rm -f cheval-ui-*.tgz *.tsbuildinfo showcase/*.tsbuildinfo

builder:
	$(CONTAINER) build -f Dockerfile.builder -t $(BUILDER_IMAGE) .

build: builder
	$(BUILDER_RUN) npm run build

archive: builder
	$(BUILDER_RUN) sh -lc 'npm run build && npm pack --silent'

check: builder
	$(BUILDER_RUN) npm run check

dev:
	CHEVAL_UI_PORT=$(PORT) $(CONTAINER) compose up --build showcase

lock:
	$(CONTAINER) run --rm -v "$(WORKSPACE):/workspace" -w /workspace node:22-alpine \
		sh -lc 'npm install --package-lock-only --ignore-scripts --no-audit --no-fund && npm install --prefix showcase --package-lock-only --ignore-scripts --no-audit --no-fund'

typecheck: builder
	$(BUILDER_RUN) npm run typecheck

verify-tag: builder
	$(BUILDER_RUN) node scripts/check-version-tag.mjs "$(TAG)"

showcase:
	CHEVAL_UI_PORT=$(PORT) $(CONTAINER) compose up --build -d showcase

showcase-build:
	$(CONTAINER) build -f showcase/Dockerfile -t cheval-ui-showcase:check .

showcase-down:
	$(CONTAINER) compose down

showcase-logs:
	$(CONTAINER) compose logs -f showcase
