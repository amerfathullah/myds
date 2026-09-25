# MYDS

The Malaysian Government Design System: a design guideline and a component library for building consistent, accessible government digital services.

## Language

### Tokens

**Primitive colour**:
A raw, theme-independent colour value in a named scale (e.g. `gray-500`, `primary-600`).
_Avoid_: Base colour, raw colour, palette colour

**Semantic token**:
A role-named colour (`bg-*` background, `txt-*` text, `otl-*` outline, `fr-*` focus ring) that resolves to a primitive colour per theme.
_Avoid_: Alias, design token (too broad)

**Theme**:
One complete mapping of semantic tokens to primitive colours; MYDS ships a light and a dark theme.
_Avoid_: Mode, colour scheme

**Off-label pairing**:
A semantic token applied to a role other than the one its prefix names, e.g. an outline token (`otl-*`) used as a background.
_Avoid_: Token misuse, cross-role token

**Foundation**:
A system-wide design rule that isn't a component: colour, typography, grid, spacing, radius, shadow, motion, iconography.
_Avoid_: Base styles, globals

### Products

**Design guideline**:
The documented principles and per-component usage guidance aimed at designers.
_Avoid_: Design docs, style guide

**Component library**:
The React implementation of MYDS components that follows the design guideline.
_Avoid_: UI kit

**Page-level component**:
A component that frames a whole page rather than sitting inside content: Masthead, Navbar, Footer, AnnounceBar, SkipLink, CookieBanner.
_Avoid_: Layout, template, page pattern

**Template**:
A starter app scaffold wired to MYDS (`template/fe-template-*`); it carries no page design of its own.
_Avoid_: Page pattern, layout
