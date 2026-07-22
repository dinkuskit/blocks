# Architecture contracts

## Two grains: blocks and patterns

Dinkus has a deliberately small vocabulary of editable section blocks.
Patterns create page-level variety by composing and pre-filling those blocks.
They are copied on insert and are not synchronized afterward.

A proposed block must include an admission note answering:

1. Which existing blocks and pattern composition were tried?
2. What data, behavior, accessibility, or runtime contract could not be
   expressed?
3. Is the proposal reusable across unrelated sites?
4. What stored-content migration obligation does it introduce?

Layout novelty, a named page kind, or a single site's visual design is not
enough. Querying, iteration, forms, and other specialist runtime behavior can
justify a block when composition cannot supply that behavior.

## Rendering and theming

Block fields own content semantics. Renderers provide accessible neutral
markup. Templates own branding through the public contract:

- the root `data-dinkus-block` value;
- documented `dinkus-*` class hooks;
- documented `--dinkus-*` custom properties; and
- a low-priority `dinkus-blocks` cascade layer.

Templates should set tokens or write unlayered class overrides. They should not
fork field schemas or copy a renderer solely to change colors and spacing.
Undocumented internal markup can change; documented hooks follow `COMPAT.md`.

## Template slots

Templates, not blocks, own page furniture. The initial named-slot convention
is:

| Slot | Location |
| --- | --- |
| `before-header` | Immediately inside the page body, before site header chrome |
| `after-header` | After site header chrome, before route content |
| `before-content` | Immediately before the route's primary content |
| `after-content` | Immediately after the route's primary content |
| `before-footer` | Before site footer chrome |
| `end-of-body` | After footer chrome, before the closing body |

Slots are optional insertion points, not new block types. A template may omit a
slot only when its README says so. Slot content remains ordinary CMS-managed
content and follows the same copy-on-insert pattern semantics.

Display conditions are deliberately not implemented here. A later conditions
engine may target these names, with include rules ORed together and explicit
exclusions winning, only after a real template proves the consumer contract.
