---
"@govtechmy/myds-docs": patch
---

Remove the "transistory assistance" (HTML/CSS) section from the developer docs: its EN/MS pages and nav entries, the `ta-preview` public assets and the `IframeThemePreview` component. Per ADR-0003, MYDS ships React on the Tailwind preset only. The Installation page (EN/MS) now has a "Not Using React?" note pointing other stacks to the Tailwind preset and DESIGN.md.
