# Agent Contract

This public repository owns the reusable Dinkus section-block plugin for
EmDash. Keep the package generic: site copy, customer data, Smoky branding,
credentials, and production configuration do not belong here.

## Layout

- `src/` contains the publishable plugin and Astro renderers.
- `tests/fixture-site/` is a disposable local acceptance harness, not a
  supported starter template.
- `tests/unit/` and `tests/e2e/` contain deterministic regression coverage.
- `docs/spikes/` records durable compatibility verdicts.
- Generated databases, uploads, traces, reports, and package archives stay
  ignored.

## Required checks

Run `pnpm check` before closeout. Browser acceptance additionally requires
`pnpm test:e2e`.

## Gates

Do not publish to npm, list in an EmDash marketplace or registry, deploy,
merge, or mutate a production site without Bobby's explicit approval.
Upstream issue comments and pull requests require a separate approved route
with a minimal reproducer, proof, and review.

Keep EmDash pre-1.0 fixture versions exact. Widen the package's tested peer
range only after compatibility proof.
