# MYDS has one implementation: React on the Tailwind preset

MYDS is implemented once, as the React component library (`@govtechmy/myds-react`) on the Tailwind preset (`@govtechmy/myds-style`). Teams on other stacks get DESIGN.md, which describes that implementation token by token, and the preset, which works with plain HTML. We don't hand-port components or ship boilerplates for other stacks. This repository has one maintainer (ADR-0002), and every hand-kept copy of a component drifts from the preset the moment a token changes. DESIGN.md can't drift the same way, because it describes the code as built.

## Considered Options

- **Hand-written HTML/CSS components** ("transistory assistance", upstream's unmerged docs section): rejected. Upstream's drafts copied about 270 colour values by hand and already disagreed with the preset.
- **HTML/CSS generated from the preset**: rejected for now. It's a new build pipeline for an audience DESIGN.md and the preset already serve.
- **Boilerplates per back-end stack** (.NET, Laravel, Go): rejected. Each is a toolchain to keep patched for ever. Next.js stays in scope because it's the repo's own stack.

## Consequences

Requests for another stack's components, templates or boilerplates are out of scope by default (see `.out-of-scope/`). They come back into scope when someone commits to maintaining that stack.
