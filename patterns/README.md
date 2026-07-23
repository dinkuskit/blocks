# Dinkus patterns

This directory is the home of the Dinkus pattern gallery.

A pattern is a pre-filled composition of existing `dinkus.*` blocks. Inserting
one copies its blocks into the page; it does not retain a live link to the
catalog. Editors own the inserted content afterward.

Patterns, not one-off block types, are the default way to add visual and
content variety. Before proposing a block, demonstrate why existing blocks
plus a pattern cannot express the required data, behavior, accessibility, or
runtime contract.

## Catalog entry contract

The first dogfood pattern will freeze the machine-readable format. Every entry
must then carry:

- a stable ID, title, description, category, and required package version;
- only public block types and fields;
- deterministic seed content with no customer data or house branding;
- desktop and mobile rendered proof;
- admin insert, edit, publish, and restore proof; and
- a compatibility note when it depends on a newly added block field.

Do not publish an unproven importer format merely to populate this directory.
The first format decision must round-trip through the EmDash Sections/seed path
used by a real Dinkus template. Until then this README is the admission and
ownership contract, not a claim that a gallery runtime exists.
