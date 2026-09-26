# MYDS tracks latest stable dependencies, and the preset is Tailwind 4 only

Next.js 14 stopped getting patches, so we moved the whole monorepo to the latest stable release of every dependency (#32), not just to the next Next.js major. The docs sites run on Fumadocs, and Fumadocs 16 requires Tailwind 4, so the MYDS preset (`@govtechmy/myds-style`) moves to Tailwind 4 too. It becomes a CSS import, and the Tailwind 3 JS `preset` is removed rather than shipped next to it. Both published packages take a new major. `@govtechmy/myds-react` keeps its React peer range at `^18 || ^19`, even though it's developed and tested on React 19.

## Considered Options

- **Next.js 15 only**: rejected. It fits the current Fumadocs and Tailwind 3, but 15 gets backports only, so the Tailwind 4 move would just come later.
- **Ship the Tailwind 3 JS preset alongside the Tailwind 4 CSS**: rejected. Two implementations of the same tokens drift, and one maintainer can't keep both in step (ADR-0003).
- **Keep the preset on Tailwind 3 and load it through Tailwind 4's `@config` compatibility**: used only as a stopgap while the apps migrate, not as the end state. The compatibility layer is legacy, and consumers would still need Tailwind 4 to use Fumadocs 16 or current tooling.
- **Require React 19 in `@govtechmy/myds-react`**: rejected. Nothing in the library needs it, and it would break React 18 consumers for no gain.

## Consequences

- Consumers must be on Tailwind 4 to use the new major of `@govtechmy/myds-style` or `@govtechmy/myds-react`. Utility names (`bg-bg-white`, `text-txt-black-900`, …) don't change, and the migration guide in the changesets covers the setup change.
- There is no v1 maintenance line. v1 stays installable from npm, but fixes land on the new major only.
- DESIGN.md describes the Tailwind 4 form of the preset. Its token values and class rule are unchanged.
- The React library's types are checked against both React 18 and React 19 (#46), so the wide peer range stays honest.
