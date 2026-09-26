# .NET front-end integration

MYDS doesn't offer an installation guide or components for .NET front ends such as Blazor or Razor Pages.

## Why this is out of scope

MYDS is a React component library on a Tailwind preset. .NET is a back-end platform: a .NET developer who wants MYDS puts a React front end in front of their .NET API, and at that point the existing React installation guides (Vite, Next.js) already apply. A ".NET installation" guide would either duplicate those guides or promise Blazor support that doesn't exist. Supporting Blazor natively would mean a second component implementation outside React, which this project can't maintain.

Upstream reached the same conclusion and marked its request `wontfix`, proposing a React + .NET Core boilerplate instead. That boilerplate is itself out of scope; see [backend-boilerplates.md](backend-boilerplates.md) and [ADR-0003](../docs/adr/0003-one-implementation-react-on-the-preset.md).

## Prior requests

- #19: "DOCS: .NET Installation / Integrations"
