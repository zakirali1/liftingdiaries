# UI Coding Standards

These standards apply to all UI code throughout this project.

## Components: shadcn/ui only

**ONLY shadcn/ui components may be used for the UI in this project.**

**ABSOLUTELY NO custom components should be created.** Every piece of UI must be composed from shadcn/ui components.

- If you need a UI element, use the matching shadcn/ui component (e.g. `Button`, `Card`, `Dialog`, `Input`, `Table`).
- If a shadcn/ui component does not yet exist in the project, add it with the shadcn CLI (`npx shadcn@latest add <component>`) rather than writing your own.
- Do not create wrapper, composite, or bespoke UI components. Compose shadcn/ui components directly in pages and layouts.
- Do not use other component libraries or hand-rolled replacements for anything shadcn/ui provides.
- Style with Tailwind utility classes on shadcn/ui components; do not build new styled elements as stand-ins for components.

## Date formatting

All date formatting must be done with [date-fns](https://date-fns.org/). Do not use `toLocaleDateString`, `Intl.DateTimeFormat`, moment, dayjs, or manual string building.

Dates are formatted as: day with ordinal suffix, abbreviated month, full year.

| Example        |
| -------------- |
| 1st Sep 2025   |
| 2nd Aug 2025   |
| 3rd Jan 2026   |
| 4th Jun 2024   |

Use the `do MMM yyyy` format string:

```ts
import { format } from "date-fns";

format(new Date(2025, 8, 1), "do MMM yyyy"); // "1st Sep 2025"
```
