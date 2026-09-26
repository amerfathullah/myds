# Boilerplates for non-JavaScript back ends

This project ships no **boilerplates** (see `CONTEXT.md`) built around a non-JavaScript back end: no .NET Core, Laravel/PHP or Go starters.

## Why this is out of scope

A boilerplate isn't a one-off deliverable. It carries a whole stack that has to keep building, keep passing its Lighthouse targets and keep taking security patches. This repository is maintained by one person (ADR-0002), and every extra stack adds a toolchain, a dependency tree and a release cadence to follow for ever. Three non-JavaScript stacks would take up that maintenance budget and add nothing to the design system itself.

The developers these would serve are already covered:

- The React starters under `template/` are back-end agnostic: they build static assets any server can serve behind its API.
- The Laravel installation guide covers wiring MYDS into a Laravel app (Inertia is a common route, as upstream commenters suggested).
- The one boilerplate in scope is Next.js (#21), which stays in the repo's own JavaScript toolchain.

## What would change this

A co-maintainer who owns a given stack, or clear demand from agencies building on that stack. A closed request can be reopened.

## Prior requests

- #20: "DOCS: Create Boilerplate for .NET Core + React"
- #22: "DOCS: Create Boilerplate for Laravel + React"
- #23: "FEAT: Create Boilerplate for React + Golang"
