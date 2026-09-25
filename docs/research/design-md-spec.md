# What the DESIGN.md `alpha` spec allows

Research for [#5](https://github.com/amerfathullah/myds/issues/5). Researched 2026-09-25 for the MYDS `DESIGN.md`, which is planned in the same format as [`DESIGN-claude.md`](../../DESIGN-claude.md).

**Sources.** Every spec claim below links to a line range in the upstream repository, pinned to commit [`9bf8eae`][commit] (the `release: 0.4.0` commit of 2026-07-27, currently the head of `main`). Tooling claims also cite the published npm package [`@google/design.md@0.4.0`][npm]. Where I ran the CLI to check behaviour, the section says **Observed (CLI 0.4.0)** and the probe files are listed in the [appendix](#appendix-probe-results).

**Not reachable from this environment:** `stitch.withgoogle.com` and `blog.google` are blocked by the network egress proxy. The Stitch-hosted copy of the spec could not be compared against the repository copy. The Google blog post is cited from its search-index title and summary only.

---

## TL;DR

| # | Question | Answer |
|---|---|---|
| 1 | Where is the canonical spec, and who maintains it? | [`google-labs-code/design.md`][repo], file [`docs/spec.md`][spec]. It is Google Labs' Stitch format, open-sourced under Apache-2.0. The CLI is published as `@google/design.md` on npm. |
| 2 | Top-level keys | `version`, `name`, `description`, `omitted`, `colors`, `typography`, `rounded`, `spacing`, `components`. There are **no** slots for shadows/elevation, motion, breakpoints or icons. Custom keys are allowed but ignored by export, and components cannot reference them. |
| 3 | Colour aliases and alpha | Both are allowed. A `colors` value may be `{colors.other}` (chains are resolved and cycles detected). Any CSS colour works, including `rgba()`, `#RRGGBBAA`, `oklch()` and `color-mix()`. |
| 4 | Themes / dark mode | Not specified. There is one flat `colors` map and no theme or mode concept. Nested groups such as `bg.light`/`bg.dark` parse, but only as token names. |
| 5 | State suffixes; "never document hover" | Suffixes are an example naming pattern, not a defined vocabulary, and the linter does not check them. The spec's own example is `button-primary-hover`. "Never document hover" is a convention of the Claude example, not a spec rule. |
| 6 | Prose sections | Eight known `##` sections, in this order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. All are optional, and those present should keep this order (the linter warns). Extra sections are allowed. |
| 7 | Linter / CLI | `npx @google/design.md lint DESIGN.md` (on Windows: `npx -p @google/design.md designmd lint DESIGN.md`). Exit code 1 on errors. Other commands are `diff`, `export` and `spec`. |

---

## 1. Canonical spec and maintainer

- **Repository:** [`github.com/google-labs-code/design.md`][repo]. The README says it is "A format specification for describing a visual identity to coding agents" ([README L1-L3][readme-1-3]).
- **Normative text:** [`docs/spec.md`][spec]. That file is generated: its header says "Generated from spec.mdx + spec-config.ts … Do not edit directly" ([spec L1-L2][spec-1-2]). The single source of truth for the machine-checked parts is [`packages/cli/src/linter/spec-config.yaml`][cfg-15-19], whose comment says "This file is the single source of truth for the DESIGN.md format specification". The README calls itself "a condensed reference" and points to `docs/spec.md` for the full spec ([README L97-L99][readme-97-99]).
- **Maintainer: Google (Google Labs / Stitch).**
  - Source files carry a `Copyright 2026 Google LLC` / Apache-2.0 header ([spec-config.yaml L1-L13][cfg-1-13]).
  - Contributions require the Google CLA ([CONTRIBUTING.md][contrib]).
  - The package is published under the `@google` npm scope, with maintainers `google-wombot` (Google's npm publishing bot), `ofrobots` and `mrdoob` ([npm registry metadata][npm-reg]).
  - The GitHub repo's homepage field is `stitch.withgoogle.com/docs/design-md/specification` ([repo page][repo]). That page was not fetchable from here.
  - Google's blog announced "Stitch's DESIGN.md format is now open-source so you can use it across platforms" ([blog.google][blog]; title and search summary only, body not fetched).
- **Status:** "The DESIGN.md format is at version `alpha`. The spec, token schema, and CLI are under active development. Expect changes to the format as it matures." ([README L358-L360][readme-358-360]). `version: alpha` is the only version value defined ([spec-config.yaml L19][cfg-15-19]). The CLI has shipped 0.1.0 → 0.4.0 since 2026-04-21 ([npm registry metadata][npm-reg]).
- **Stated philosophy.** Prose is primary and tokens are context, not rendering instructions. "The prose is the most vital part of the specification." ([PHILOSOPHY L21][phil-21]) "Generally, we do not accept or recommend token requirements in the specification." ([PHILOSOPHY L42][phil-42])

## 2. Top-level front-matter keys

The spec schema ([spec L43-L59][spec-43-59]; mirrored in [README L110-L128][readme-110-128]):

```yaml
version: <string>          # optional, current version: "alpha"
name: <string>
description: <string>      # optional
omitted: <string[]|OmittedSection[]> # optional
colors:      { <token-name>: <Color> }
typography:  { <token-name>: <Typography> }
rounded:     { <scale-level>: <Dimension> }
spacing:     { <scale-level>: <Dimension | number> }
components:  { <component-name>: { <token-name>: <string|token reference> } }
```

- The parser's list of known keys is exactly these nine: `SCHEMA_KEYS` in [parser/spec.ts L65-L76][schema-keys].
- **Required keys:** `version`, `description` and `omitted` are marked optional; `name` is not ([spec L44-L47][spec-43-59]). **Observed (CLI 0.4.0):** a file with no `name` produces no finding, and `version: beta` produces no finding either ([probe2](#appendix-probe-results)). The front matter itself is optional: "An optional YAML frontmatter" ([spec L8][spec-8]).
- **`omitted`** lists token groups intentionally left out, either as strings or as `{section, reason}`. It suppresses missing-section lint findings ([spec L87-L96][spec-87-96]). Only `colors`, `typography`, `spacing`, `rounded` and `components` are valid entries; anything else is flagged `unknown-omission` ([omitted.ts][omitted]).
- **Typography properties:** `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature` and `fontVariation` ([spec L75-L83][spec-63-85]). Unknown typography properties raise a warning and are dropped ([model/handler.ts L407-L418][model-407-418]).
- **Dimension units:** `px`, `em` and `rem` only ([spec L85][spec-63-85]). Other CSS units in `rounded`/`typography` are errors ([model/handler.ts L96-L105][model-96-105]).
- **Component sub-tokens:** `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height` and `width` ([spec L330-L341][spec-330-341]; [spec-config.yaml L85-L101][cfg-85-101]). Any other property (for example `borderColor`) is "Accept with warning" ([spec L376][spec-366-377]).

### Shadows / elevation, motion, breakpoints, icons: no token slots

- None of these is a schema key ([parser/spec.ts L65-L76][schema-keys]).
- **Elevation** exists only as a prose section, "Elevation & Depth". That section "defines the required styling (spread, blur, color)" in prose, and the spec gives it no `Design Tokens` subsection ([spec L254-L267][spec-254-267]).
- **Motion, iconography and elevation** are explicitly left open: "It leaves open the categories where flexibility helps more: motion, iconography, elevation, text casing, paragraph measure … the format already lets you define it" ([PHILOSOPHY L88-L110][phil-88-110]). The example shows a custom `motion:` YAML block. The schema is "intentionally extensible (custom keys are allowed)" ([unknown-key.ts L20-L28][unknown-key]).
- **Breakpoints** are not mentioned anywhere in the spec ([spec][spec]). Layout guidance lives in the Layout prose section ([spec L216-L252][spec-216-252]).
- **Caveats for custom keys. Observed (CLI 0.4.0):**
  - A custom top-level key whose values look like tokens (a hex colour or a CSS dimension such as `150ms` or `768px`) raises the `token-like-ignored` **warning**: "will be silently ignored by export commands" ([token-like-ignored.ts L79-L97][tli]). This fired for `motion`, `breakpoints`, `elevation` and `themes`. It did not fire for `shadows: {card: "0 1px 3px rgba(...)"}` (a multi-value string does not match the pattern) or for `icons: {set: "..."}`.
  - A **component** reference to a custom key, such as `boxShadow: "{shadows.card}"`, is a `broken-ref` **error** (exit code 1). Only `colors`, `typography`, `rounded` and `spacing` enter the reference symbol table ([model/handler.ts L55-L136][model-55-136]).

## 3. Colour values: aliases and alpha

- **Aliases are allowed.**
  - The spec says token references use the `{path.to.token}` syntax. "For most token groups, the reference must point to a primitive value (e.g., `colors.primary-60`), not a group" ([spec L98][spec-98]). References are therefore allowed inside token groups, not only inside `components`.
  - In the implementation, a `colors` entry whose value is a reference is stored and then resolved in a second pass ([model/handler.ts L62-L64][model-55-79], [L138-L159][model-138-159]). Chains are followed up to `max_reference_depth: 10`, and cycles are detected ([model/handler.ts L423-L447][model-423-447]; [spec-config.yaml L22-L24][cfg-22-24]).
  - Upstream tests assert `primary: '{colors.brand}'` resolves to the brand hex, and cycles `a → b → a` are recorded as unresolved ([model/handler.test.ts L350-L404][test-350-400]).
  - **Observed (CLI 0.4.0):** `primary: "{colors.primary-600}"` lints clean. On `export`, aliases are **flattened to resolved values**; the css-vars output emits `--color-primary: #2563eb` ([probe](#appendix-probe-results)). The DTCG exporter likewise writes resolved `$value`s, not DTCG alias syntax ([dtcg/handler.ts L49-L58][dtcg]).
- **Alpha is allowed.**
  - Color is "any valid CSS color string": hex `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`; named colours including `transparent`; `rgb()`, `rgba()`, `hsl()`, `hsla()`, `hwb()`; `oklch()`, `oklab()`, `lch()`, `lab()`; and `color-mix(in srgb, …)` ([spec L63-L73][spec-63-85]).
  - The spec recommends hex `#RRGGBB` ([spec L73][spec-63-85]). Tests cover `#RGBA` and `#RRGGBBAA` alpha extraction ([model/handler.test.ts L60-L77][test-60-77]).
- **Alpha caveats. Observed (CLI 0.4.0):**
  - `rgba(0, 0, 0, 0.5)` is exported as `#00000080`, even though the spec says the original format is preserved for display and export ([spec L71][spec-63-85]).
  - The `contrast-ratio` rule compares luminance only and ignores alpha. `transparent` is checked as `#00000000`, which gives false contrast warnings for text on transparent backgrounds. `DESIGN-claude.md`'s `button-text-link` and `category-tab` hit this ([contrast-ratio.ts][contrast]).

## 4. Themes / dark mode

- **Not specified.** The spec defines a single `colors` map (`map<string, Color>`) ([spec L148-L161][spec-148-161]). There is no theme, mode or colour-scheme key, and no rule for how a second colour set applies ([spec][spec], [parser/spec.ts L65-L76][schema-keys]). The words "dark" and "theme" do not appear in `docs/spec.md` in this sense.
- **Nested colour groups parse.** `colors: {background: {light: '#fbfaf1', dark: '#11140e'}}` becomes the tokens `background.light` and `background.dark`, and `{colors.background.light}` resolves (upstream Issue #102; [model/handler.test.ts L79-L94][test-79-94], [L372-L385][test-350-400]; walker at [model/handler.ts L458-L491][model-458-491]). These are **only token names**: no consumer is told that `.dark` means a dark theme. **Observed:** export flattens them to `--color-bg-light` and `--color-bg-dark`.
- **A custom `themes:` key** is accepted but raises the `token-like-ignored` warning and is dropped by export ([probe](#appendix-probe-results)).
- **Consequence for MYDS.** MYDS has a light and a dark **Theme**, each a full mapping of **semantic tokens** to **primitive colours** ([CONTEXT.md](../../CONTEXT.md)). A second theme can only be expressed through naming (nested groups or suffixes) plus prose. How to do that is a design decision for MYDS; the spec does not settle it.

## 5. Component states and variant suffixes

- **The spec text** says: "A component may have a variant for different UI states such as active, hover, pressed, etc. Those variant components may be defined under a different but related key, for example, "button-primary", "button-primary-hover", "button-primary-active". The agent will consider all variants and make the appropriate styling decisions." ([spec L317-L328][spec-313-328]). The README says the same: "Variants (hover, active, pressed) are expressed as separate component entries with a related key name." ([README L171][readme-154-171])
- **The suffixes are examples, not a vocabulary.** There is no list of allowed states, and nothing mentions `-disabled` or `-focused`. The linter never inspects component key names: it checks sub-tokens, references and contrast only ([broken-ref.ts][broken-ref], [contrast-ratio.ts][contrast]). **Observed:** `button-primary-focused` produced no finding.
- **"Never document hover" is not a spec rule.**
  - It comes from `DESIGN-claude.md`'s own Iteration Guide ("4. Never document hover. Default and Active/Pressed states only.") and its Don'ts ([DESIGN-claude.md](../../DESIGN-claude.md)).
  - The spec does the opposite. Its example variant is `button-primary-hover` ([spec L326-L328][spec-313-328]; [spec-config.yaml examples][cfg-examples]).
  - All three official examples define `-hover` components: [atmospheric-glass L116][ex-ag], [paws-and-paths L118][ex-pp] and [totality-festival L109][ex-tf].
- **Components is still evolving:** "The components specification is actively evolving. The current structure provides intentional flexibility for domain-specific component definitions while the spec matures." ([spec L311][spec-299-311])

## 6. Prose sections: required, optional, order

- **All sections are optional.** "Sections can be omitted if they're not relevant to your project, but those present should appear in the sequence listed below. All sections use `<h2>` (`##`) headings. An optional `<h1>` heading may appear for document titling purposes but is not parsed as a section." ([spec L102][spec-102-113])
- **Canonical order and aliases** ([spec L104-L113][spec-102-113]; [spec-config.yaml L49-L64][cfg-49-64]):
  1. Overview (alias "Brand & Style")
  2. Colors
  3. Typography
  4. Layout (alias "Layout & Spacing")
  5. Elevation & Depth (alias "Elevation")
  6. Shapes
  7. Components
  8. Do's and Don'ts
- **Strength of the ordering rule:** the spec says "should" ([spec L102][spec-102-113]) and the README says "must" ([README L141][readme-139-152]). The linter enforces it only as a **warning** (`section-order`), stopping at the first out-of-order pair ([section-order.ts L27-L64][section-order]).
- **Unknown sections** such as `## Iconography` are "Preserve; do not error" ([spec L372][spec-366-377]). The order check ignores them: sections not in the canonical list are filtered out before comparison ([section-order.ts][section-order]). **Observed:** `DESIGN-claude.md`'s extra sections (Responsive Behavior, Iteration Guide, Known Gaps) raise no findings, and neither does an `## Iconography` or `## Motion` placed between canonical ones.
- **One content requirement inside a section:** "At least the `primary` color palette must be defined" ([spec L127][spec-127]). The linter enforces this as the warning `missing-primary` ([README L318-L334][readme-318-334]).
- **Duplicate headings:** the spec says "Duplicate section heading | Error; reject the file" ([spec L377][spec-366-377]; [README L181][readme-173-181]). **Observed (CLI 0.4.0): not enforced.** A file with two `## Colors` headings linted with exit 0 and no duplicate finding ([probe2](#appendix-probe-results)).
- **Implementation gotcha, beyond the spec text.** The parser also reads ` ```yaml ` fenced code blocks in the body as token sources and merges them with the front matter ([parser/handler.ts L25][parser-25], [L52-L61][parser-52-61]). If such a block redefines a top-level key (for example `colors:`), parsing fails with `DUPLICATE_SECTION` ([parser/handler.ts L160-L176][parser-160-176]). **Observed:** the whole lint then collapses to a single warning with exit code 0 and every other check is skipped. Avoid ` ```yaml ` examples that contain schema keys in the prose, or fence them as something else.

## 7. Official linter / CLI

- **Package:** [`@google/design.md`][npm] (latest `0.4.0`), Node ≥ 18. The binaries are `design.md` and `designmd` ([packages/cli/package.json L2-L3, L22-L28][pkg]).
- **Run without installing:**
  ```bash
  npx @google/design.md lint DESIGN.md
  # Windows / PowerShell (the ".md" bin name collides with the Markdown file association):
  npx -p @google/design.md designmd lint DESIGN.md
  # stdin:
  cat DESIGN.md | npx @google/design.md lint -
  ```
  ([README L52-L57][readme-52-57], [L185-L243][readme-185-243], [L245-L260][readme-245-260])
- **Install:** `npm install @google/design.md`. A `package.json` script should use `designmd lint DESIGN.md` so it also works on Windows ([README L185-L243][readme-185-243]).
- **Output:** JSON `{findings[], summary{errors,warnings,infos}}`. "Exit code `1` if errors are found, `0` otherwise." ([README L245-L260][readme-245-260]) Warnings do not fail the command.
- **Other commands** ([README L262-L316][readme-262-316]):
  - `diff before.md after.md`: exits 1 on regression.
  - `export --format json-tailwind|css-tailwind|tailwind|dtcg`: CLI 0.4.0 also accepts `css-vars` with `--prefix`. That format is not yet listed in the README ([export.ts L20][export-20]).
  - `spec [--rules|--rules-only] [--format markdown|json]`: prints the spec for agent context.
- **Rules (11):**

  | Rule | Severity |
  |---|---|
  | `broken-ref` | error (unknown component sub-tokens are downgraded to warning) |
  | `missing-primary` | warning |
  | `contrast-ratio` | warning (WCAG AA 4.5:1 on component `backgroundColor`/`textColor` pairs) |
  | `orphaned-tokens` | warning (colours no component references; MD3 families exempt) |
  | `token-summary` | info |
  | `missing-sections` | info (only `spacing`/`rounded`) |
  | `missing-typography` | warning |
  | `section-order` | warning |
  | `unknown-key` | warning (typos within edit distance 2 of a schema key) |
  | `token-like-ignored` | warning |
  | `omitted-rules` | info |

  ([README L318-L334][readme-318-334]; [rules/index.ts][rules-index]; [orphaned-tokens.ts][orphaned])
- **Programmatic use:** `import { lint } from '@google/design.md/linter'` ([README L336-L348][readme-336-348]).
- **Observed baseline:** `npx @google/design.md@0.4.0 lint DESIGN-claude.md` gives **0 errors, 19 warnings** (12 `orphaned-tokens`, 7 `contrast-ratio`) and 1 info, exit 0.

---

## Appendix: probe results

All probes were run with `@google/design.md@0.4.0` installed from the npm registry, using Node 22.

| Probe | Input | Result |
|---|---|---|
| `DESIGN-claude.md` | The repo's example file | 0 errors / 19 warnings / 1 info, exit 0. The `contrast-ratio` hits include `transparent` backgrounds, where alpha is ignored. |
| probe | `primary: "{colors.primary-600}"`; `rgba(0,0,0,0.5)`; `#2563EB33`; `colors.bg.{light,dark}`; custom `shadows`, `elevation`, `motion`, `breakpoints`, `icons`, `themes`; component props `borderColor` and `boxShadow: "{shadows.card}"`; component `button-primary-focused`; sections Overview → Colors → Iconography → Motion → Typography → Responsive Behavior | The colour alias, rgba, 8-digit hex and nested groups are all accepted. `token-like-ignored` warns on `elevation`, `motion`, `breakpoints` and `themes`; `shadows` and `icons` are silent. `{shadows.card}` is a **broken-ref error** (exit 1). `borderColor` and `boxShadow` get unknown-sub-token warnings. `-focused` and the extra sections get no finding. |
| probe (export) | Same file with `boxShadow` removed, `export --format css-vars` / `dtcg` | Aliases resolved (`--color-primary: #2563eb`), `rgba` becomes `#00000080`, nested groups become `--color-bg-light`/`--color-bg-dark`, and custom keys are absent. |
| probe2 | No `name`; `version: beta`; sections Colors → Overview → Colors (duplicate) | No finding for the missing name, the version or the duplicate heading. There is one `section-order` warning. Exit 0. |
| probe3 | Components before Colors | `section-order` warning, exit 0. |
| probe4 | Front matter `colors:` plus a ` ```yaml ` block in the prose that also has `colors:` | A single warning, "Section 'colors' is defined in both frontmatter and code block 1." All other checks are skipped. Exit 0. |

[commit]: https://github.com/google-labs-code/design.md/commit/9bf8eae67128b6cc55ad9bf86665767deb4c11cd
[repo]: https://github.com/google-labs-code/design.md
[spec]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md
[spec-1-2]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L1-L2
[spec-8]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L8
[spec-43-59]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L43-L59
[spec-63-85]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L63-L85
[spec-87-96]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L87-L96
[spec-98]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L98
[spec-102-113]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L102-L113
[spec-127]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L127
[spec-148-161]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L148-L161
[spec-216-252]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L216-L252
[spec-254-267]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L254-L267
[spec-299-311]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L299-L311
[spec-313-328]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L313-L328
[spec-330-341]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L330-L341
[spec-366-377]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/docs/spec.md?plain=1#L366-L377
[readme-1-3]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L1-L3
[readme-52-57]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L52-L57
[readme-97-99]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L97-L99
[readme-110-128]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L110-L128
[readme-139-152]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L139-L152
[readme-154-171]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L154-L171
[readme-173-181]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L173-L181
[readme-185-243]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L185-L243
[readme-245-260]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L245-L260
[readme-262-316]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L262-L316
[readme-318-334]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L318-L334
[readme-336-348]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L336-L348
[readme-358-360]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/README.md?plain=1#L358-L360
[phil-21]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/PHILOSOPHY.md?plain=1#L21
[phil-42]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/PHILOSOPHY.md?plain=1#L42
[phil-88-110]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/PHILOSOPHY.md?plain=1#L88-L110
[contrib]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/CONTRIBUTING.md
[cfg-1-13]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/spec-config.yaml#L1-L13
[cfg-15-19]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/spec-config.yaml#L15-L19
[cfg-22-24]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/spec-config.yaml#L22-L24
[cfg-49-64]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/spec-config.yaml#L49-L64
[cfg-85-101]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/spec-config.yaml#L85-L101
[cfg-examples]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/spec-config.yaml#L161-L167
[schema-keys]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/parser/spec.ts#L65-L76
[parser-25]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/parser/handler.ts#L25
[parser-52-61]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/parser/handler.ts#L52-L61
[parser-160-176]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/parser/handler.ts#L160-L176
[model-55-79]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.ts#L55-L79
[model-55-136]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.ts#L55-L136
[model-96-105]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.ts#L96-L105
[model-138-159]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.ts#L138-L159
[model-407-418]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.ts#L407-L418
[model-423-447]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.ts#L423-L447
[model-458-491]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.ts#L458-L491
[test-60-77]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.test.ts#L60-L77
[test-79-94]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.test.ts#L79-L94
[test-350-400]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/model/handler.test.ts#L350-L404
[dtcg]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/dtcg/handler.ts#L49-L58
[export-20]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/commands/export.ts#L20
[pkg]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/package.json
[rules-index]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/linter/rules/index.ts
[unknown-key]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/linter/rules/unknown-key.ts#L20-L28
[tli]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/linter/rules/token-like-ignored.ts#L79-L97
[broken-ref]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/linter/rules/broken-ref.ts
[contrast]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/linter/rules/contrast-ratio.ts
[orphaned]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/linter/rules/orphaned-tokens.ts
[section-order]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/linter/rules/section-order.ts#L27-L64
[omitted]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/packages/cli/src/linter/linter/rules/omitted.ts
[ex-ag]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/examples/atmospheric-glass/DESIGN.md?plain=1#L116
[ex-pp]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/examples/paws-and-paths/DESIGN.md?plain=1#L118
[ex-tf]: https://github.com/google-labs-code/design.md/blob/9bf8eae67128b6cc55ad9bf86665767deb4c11cd/examples/totality-festival/DESIGN.md?plain=1#L109
[npm]: https://www.npmjs.com/package/@google/design.md/v/0.4.0
[npm-reg]: https://registry.npmjs.org/@google/design.md
[blog]: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
