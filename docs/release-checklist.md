# Release checklist

- [ ] Version follows semantic versioning and matches the planned tag.
- [ ] `make check` passes from a clean checkout.
- [ ] New and changed components have showcase coverage.
- [ ] Public exports, optional peer dependencies, and consumer documentation are accurate.
- [ ] Light, dark, keyboard, disabled, empty, loading, error, and responsive states were reviewed
      where relevant.
- [ ] The generated `.tgz` installs and builds in at least one consumer application.
- [ ] The release commit and all pull request commits follow the repository commit style.
- [ ] The annotated `v<version>` tag points at the reviewed release commit.
- [ ] The GitHub release contains generated notes and the versioned `.tgz` asset.
