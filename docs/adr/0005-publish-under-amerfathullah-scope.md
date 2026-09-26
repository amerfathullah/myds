# MYDS is published as @amerfathullah/myds-*, continuing at 2.0.0

The `@govtechmy` npm scope belongs to upstream's MyDigital accounts, so this repository can't publish `@govtechmy/myds-react` or `@govtechmy/myds-style`. Nothing has been released from here since the fork (ADR-0002). We publish the two packages as `@amerfathullah/myds-react` and `@amerfathullah/myds-style`, the maintainer's personal npm scope. Their first release is 2.0.0, carrying the majors from ADR-0004, so it reads as the successor to `@govtechmy/*` 1.x.

## Considered Options

- **Keep the `@govtechmy` names and ask upstream to publish**: rejected. Upstream isn't maintained (ADR-0002), so releases would stall indefinitely.
- **Don't publish; use the code from this repository only**: rejected. Agencies couldn't `npm install` the fixes or the upgrades.
- **A new npm org scope**: not chosen for now. It lets co-maintainers publish, but there's only one maintainer. If that changes, moving to an org is a rename plus a deprecation notice on the personal-scope packages.
- **Restart numbering at 1.0.0 under the new name**: rejected. It would hide that the packages continue `@govtechmy/*` 1.x, and 2.0.0 is a breaking release anyway.

## Consequences

- Consumers switch package names as part of the 2.0.0 migration guide. The `@govtechmy` 1.x packages can't be deprecated from here, so the READMEs and docs say where development continues.
- Private workspace packages (the apps and the internal configs) keep their names. Only the published packages are renamed.
- Publishing needs an `NPM_TOKEN` secret for the `amerfathullah` account, or npm trusted publishing once the packages exist.
- ADR-0004's references to `@govtechmy/myds-*` mean these packages under their new names.
