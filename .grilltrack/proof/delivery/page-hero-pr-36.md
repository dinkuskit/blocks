# Page Hero delivery record

## Authorized delivery

- Pull request: https://github.com/dinkuskit/blocks/pull/36
- Title: `Prove Page Hero as the second feature-local pilot`
- Base: `main` at `fcd539aa08fbce708761361832e4ff12fd33a761`
- Branch: `grilltrack/page-hero-pilot`
- Delivered and reviewed head: `2d671b86c0757879cad2b058aa1aa7722e526ed5`
- State: open, non-draft, mergeable, and not merged

The user separately authorized the branch push and focused pull request, then authorized immutable browser-proof publication and the resulting PR proof update and re-review request. No merge, package publication, deployment, credential change, or next-feature implementation was authorized or performed.

## CI and review channels

The initial `CI / verify` check passed in 8m58s. `bin/verify-blocks full` passed in 486.67s on the delivered head with all 12 Playwright scenarios counted as passed, including Page Hero and cumulative CTA Band coverage. The known EmDash modal-submit race remained the expected-failure canary.

At terminal CI inspection, the PR had no submitted reviews, issue comments, inline review comments, or commit statuses. The check-run annotation channel contained one warning that Node.js 20-targeting action versions are being forced to Node.js 24. This is the baseline-existing annotation already excluded from the Page Hero lock and is adjudicated `defer` to separate CI dependency maintenance; it is not a Page Hero required fix.

GitHub Actions produced short-retention workflow artifacts, which are not claimed as repository-policy screenshot proof. After the initial ClawSweeper review identified the missing observable proof, the user authorized publication of three directly inspected captures from an exact-head focused replay that passed in 19.5 seconds on `2d671b86c0757879cad2b058aa1aa7722e526ed5`. The captures required no redaction and are published as immutable assets in [`blocks-pr-36-page-hero-2d671b8`](https://github.com/saari-co/swarm-pr-assets/releases/tag/blocks-pr-36-page-hero-2d671b8):

- [`unsafe-admin-modal.png`](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-36-page-hero-2d671b8/unsafe-admin-modal.png), 124800 bytes, SHA-256 `571a1c751f40ecc44971bc88b57194243a0d5202405873812a03489a91b61cd1`
- [`safe-admin-modal.png`](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-36-page-hero-2d671b8/safe-admin-modal.png), 104146 bytes, SHA-256 `aef6d13e1c377536482a75c4e35ead6004c0a71f684cafa79d35481c47b32dc2`
- [`rendered-safe-unsafe.png`](https://github.com/saari-co/swarm-pr-assets/releases/download/blocks-pr-36-page-hero-2d671b8/rendered-safe-unsafe.png), 54336 bytes, SHA-256 `8a96430ddf1e0161afbfea2feb1bca4b88cfe639387e746dabde5a734093e0be`

GitHub's reported release-asset sizes and SHA-256 digests match the inspected local files. The images remain outside the Git tree.

## Exact-source history

Initial implementation commit `9a00651591570ffe240655131b79e61a9174c2a1` received one `required_fix` because retained text proof incorrectly described the implementation as uncommitted. Commit `2d671b86c0757879cad2b058aa1aa7722e526ed5` repaired that proof without product-source changes, passed proportionate re-verification, and received a clean two-axis exact-source review with no remaining source classifications.

The Page Hero track remains open. Delivery does not confirm closure or authorize Gallery Hero.
