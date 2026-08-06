# The durable fix is server-side: revision CAS + idempotent mutations

The #2160 client fix removes one known double-dispatch, and every
0.29.0 consumer should want it. It is still only a client fix: it makes
the well-behaved client stop racing itself. Nothing prevents the next
client bug, a second tab, a slow retry, an importer, or an agent writer
from replaying the same lost-update shape, because the content write API
accepts whatever arrives last.

The durable contract — the same one battle-tested by payment APIs — is:

1. **`expectedRevision` compare-and-swap.** Every manual save carries the
   revision the client started from. The server compares under the write
   transaction and rejects a stale base instead of letting the last
   writer win.
2. **Per-action `mutationId` idempotency.** The client mints one id per
   user action (one Save click, one autosave tick). Retries and duplicate
   dispatches carry the same id; the server executes the action once and
   replays the stored receipt for duplicates. A #2160-style double
   dispatch then converges to one write even on an unpatched client.
3. **`409 Conflict` as a first-class response.** On a CAS miss the client
   gets the current revision and document back and must rebase or prompt
   — visibly. A refused save the user can see beats a silent revert every
   time.
4. **Immutable revisions as receipts.** Each accepted write yields a new
   immutable revision id; history is append-only, so "which write won and
   what did it contain" is always answerable after the fact.

Why each half needs the other: CAS without idempotency turns benign
duplicate dispatches into user-visible 409 noise; idempotency without CAS
dedupes duplicates but still lets two genuinely different stale writes
overwrite each other. Together they make the save path safe against
client bugs, concurrency, and replays at once.

An advisory presence badge or entry lock ("someone is editing this
entry") is a worthwhile UX layer on top, but it is not a substitute:
locks are advisory for crashed tabs and for the same user twice, agent
writers do not look at lock symbols, and the 0.29.0 race fires from a
single person's single Save. Only the server-side version check is a
guarantee.

Placement note for this kit: the write discipline belongs in upstream
EmDash core (content API + admin client). The kit's lane is to keep the
canary as the regression instrument, validate stored content at its own
boundaries (`src/schema.ts`), and route agent writers through
revision-safe helpers when upstream exposes the contract. No parallel
persistence path in this repo.
