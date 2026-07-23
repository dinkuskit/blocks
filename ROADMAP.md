# Roadmap

This is the public kit trajectory for Dinkus **blocks** and the wider Dinkus
family. It is shaped by the Smoky **Business North Star** (agent-managed
multi-website commerce OS), not by feature tourism.

Package remains private at `0.0.0` until a real Smoky dogfood gate passes.
Building in the open is fine; shipping is release-gated.

## Foundation (current campaign — closes when done)

- [x] Small section vocabulary + patterns-for-variety rule (`docs/architecture.md`)
- [x] `--dinkus-*` theming contract + documented class hooks
- [x] `COMPAT.md` — schema changes ship with migrations
- [x] Core blocks proven in fixture e2e (hero, rails, CTA, …)
- [ ] `CONTRIBUTING.md` fences (“will not accept PRs for X until Y”)
- [ ] Smoky Works **P0** dogfood: admin-operable home thin trio (hero + mid + CTA)
- [ ] Campaign issue closed with proof links

## Next (pre-filed follow-ons — not infinite deferral)

Ordered for business value:

1. **Works home spine → full home parity** — remaining home sections as CMS streams  
2. **Second house site** (e.g. SmokyProduct) on the same blocks pin → unlocks starters  
3. **`dinkus.query` family** — admin-composable listings (archives, card grids)  
4. **Pattern catalog format** — first real pattern seed + gallery material *in this repo*  
5. **Dynamic tags** — only if EmDash still has no native tag language; blocks own syntax; commerce-sdk registers commerce tags  
6. **Templates** (`template-services` / marketing / store) after two house proofs  
7. **AICommerce essentials** dogfood on GFB → CBD (not marketing sites as fake stores)  
8. **Inventory / coupons / bundles** extensions after commerce kernel dogfood  
9. **Slots/conditions package** only if EmDash Widget Areas cannot meet real template demand  
10. **Kit assembly (S5)** when pieces have each shipped a real site  

## Hard deadlines that order commerce work

- Katana inventory exit / non-renewal boundary (see house commerce plans; ~2026-11-30)  
- GFB EmDash rehearsal before smokymountaincbd.com redesign/migrate (EOY 2026 target)  

## Will not do in this package

- Smoky branding, customer data, or production credentials  
- A parallel admin UI that abandons EmDash-native Portable Text blocks  
- One-dimensional blocks (testimonial/pricing/team) that should be patterns  
- Silent schema breaks without migrations  
