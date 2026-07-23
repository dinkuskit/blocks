# Compatibility covenant

Dinkus blocks are stored content, not disposable component props. Once a site
has saved a block, an upgrade must not orphan its content or silently change
its meaning.

This covenant starts during dogfood, while the package is still private at
`0.0.0`. It covers:

- `dinkus.*` block type IDs;
- field action IDs, field types, and their documented semantics;
- exported package symbols and node types;
- `data-dinkus-block`, documented `dinkus-*` classes, and documented
  `--dinkus-*` custom properties;
- published pattern IDs and template-slot names once consumers adopt them.

## Change rules

Additive optional fields and new documented styling hooks are compatible.
Renaming, removing, retyping, or changing the meaning of stored fields is a
schema change.

Every schema-changing pull request must ship all of the following together:

1. a deterministic migration from every supported stored shape;
2. an old-shape fixture and a migrated golden fixture;
3. idempotency and round-trip coverage proving that a second migration is a
   no-op and no saved content is lost;
4. a rollback or legacy-render path when automatic migration is unsafe; and
5. a changelog entry naming the affected block types and operator action.

If those artifacts are missing, preserve the old shape and renderer. Do not
make a breaking schema change and promise the migration later.

## Platform range

EmDash is pre-1.0. Fixture versions stay exact, and the peer range names only
versions proven by the compatibility suite. A wider range requires current
admin edit/save/publish and public SSR proof.

The first schema-changing release must also add the package's machine-readable
schema-version manifest and migration command. Until then, the current field
contracts and their unit/e2e fixtures are the version-one baseline.

## Release gate

No npm, marketplace, or registry release is compatible merely because it
builds. It must pass the stored-content migrations, exact supported EmDash
matrix, package checks, and real-site dogfood gate.
