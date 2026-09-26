# Rich time picker

The component library doesn't ship a dedicated time picker: no Calendly-style grid of available times, no picking a range of contiguous slots, and no control that combines date and time.

## Why this is out of scope

Time entry is already covered by two things that exist today:

- **`TimeField`** wraps the native `<input type="time">` for when the person can enter any time. The browser supplies the keyboard behaviour, screen-reader support and mobile picker, and 12/24-hour display follows the user's locale.
- **Time slots** use `Select` for booking from fixed availability (the "Time slots" section of the TimeField docs). The author writes each option, so they choose the 12- or 24-hour format. An unavailable time is a `SelectItem` with `disabled`.

```tsx
<Select>
  <SelectTrigger><SelectValue placeholder="Pick a time" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="16:00">4:00 PM</SelectItem>
    <SelectItem value="16:15" disabled>4:15 PM</SelectItem>
    <SelectItem value="16:30">4:30 PM</SelectItem>
  </SelectContent>
</Select>
```

That leaves two ideas without a home: a grid layout and range selection. Neither is a small add-on. Each is a new interaction model that the **design guideline** doesn't define: DESIGN.md already records a **Gap** here, since the guideline has no time-input page. Building it would mean inventing the layout, the mobile layout, a roving-focus keyboard model and a way to announce a selected range to screen-reader users. All of that would happen in code, with no design to follow and no service asking for it. Upstream's list of these ideas was a brainstorm ("on top of my head"), not a design, and upstream never built it.

A combined date-and-time control was ruled out when `TimeField` was scoped (#24): it would change `DatePicker`, and authors can already put a `DatePicker` next to a `TimeField` or a slot `Select`.

This follows the same principle as [ADR-0003](../docs/adr/0003-one-implementation-react-on-the-preset.md): the component library implements what the design system defines. It doesn't grow speculative surface that one maintainer then has to keep accessible and in step with the preset.

## What would change this

A concrete government service whose booking flow `TimeField` and `Select` slots can't serve (for example, booking several contiguous slots at once), **and** a design for the picker: layout, states, mobile behaviour, keyboard and screen-reader behaviour. With both in hand, this file should be deleted and the request triaged as new work.

## Prior requests

- #35: "FEAT: rich TimePicker (slot grid, ranges, disabled slots)", split out of #24 (upstream `govtechmy/myds#281`)
