# Continue MYDS here from a one-time snapshot of upstream issues

Upstream looked abandoned, so this repository now maintains MYDS as a whole (component library, design guideline, templates), not only advises on it. This replaces the advisory scope set in ADR-0001; its licence decision stands. To carry the outstanding work across, we copied upstream's open issues here once, as a snapshot, instead of syncing, because a sync would keep costing effort to follow a repository nobody updates.

## Considered Options

- **Keep filing against upstream**: rejected; nobody there is triaging.
- **Ongoing sync**: rejected; one-off is cheap to re-run if upstream revives.
- **Copy open and closed issues**: rejected; closed issues stay readable upstream.

## Consequences

- Copied issues are renumbered here. Each opens with a header naming the upstream issue, author and date, and keeps its comments in a collapsed block.
- The copy leaves no footprint upstream: references to upstream are written so GitHub creates no backlink, and `@mentions` are broken so nobody is pinged. Don't "fix" these into live links.
- `#N` references between copied issues point at the new local numbers; references to issues we didn't copy name upstream explicitly.
- Every copied issue carries `needs-triage` alongside its upstream labels. Upstream assignees and milestones were dropped.
