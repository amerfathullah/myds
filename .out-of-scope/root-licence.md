# Root LICENSE file

This repository doesn't have a root `LICENSE` file, and it won't get one while MYDS itself is unlicensed.

## Why this is out of scope

A root `LICENSE` reads as a licence for everything in the repository. Most of the repository is upstream MYDS, and its copyright belongs to GovTech Malaysia and upstream contributors, who never published a licence. We can't grant rights to code we don't own, so a root licence would promise reusers something we can't give them.

What *is* licensed is our own text: `DESIGN.md` and `CONTEXT.md` are CC BY 4.0. That licence is stated inside `DESIGN.md` and in the README, scoped to those two files. See [ADR-0001](../docs/adr/0001-open-licence-with-advisory-scope.md), which considered and rejected a root `LICENSE` for exactly this reason. [ADR-0002](../docs/adr/0002-continue-myds-from-upstream-snapshot.md) widened this repository to maintaining MYDS as a whole, but kept that licence decision.

An upstream maintainer has said informally that anyone may fork and use MYDS. That's welcome, but it's permission in a comment, not a licence.

## What would change this

A licence published by the copyright holders upstream. Once MYDS has one, a root `LICENSE` repeating it is back in scope.

## Prior requests

- #25: "DOCS: add a LICENSE file to clarify open-source usage"
