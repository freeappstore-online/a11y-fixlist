# A11y FixList

A11y FixList is a lightweight accessibility review tool for developers and content editors. Paste HTML into the app to run a set of automated first-pass checks, review detected issues, filter results, and export a developer-friendly Markdown report.

The project is built as a standalone FreeAppStore web app using React, TypeScript and Vite.

## Features

- Scan pasted HTML for common accessibility issues
- Show issue severity, category, affected element and suggested fix
- Filter detected issues by severity and category
- View extracted page information such as headings, images, links, buttons and form fields
- Jump from an issue to the matching HTML source where it can be located
- Copy or download scan results as a Markdown report
- Use sample HTML for quick testing
- Responsive interface for desktop and mobile use

## Supported checks

A11y FixList currently checks for:

- Missing image `alt` attributes
- Generic image alt text
- Links without accessible text
- Buttons without accessible text
- Form fields without labels
- Placeholder-only form labels
- Broken `label for` and `aria-labelledby` references
- Skipped heading levels
- Duplicate IDs

## Severity

Issues are grouped into **High**, **Medium** and **Low** severity to help developers prioritise review and remediation.

These severity levels are developer triage ratings used by this tool. They are not official WCAG conformance levels.

## How to use

1. Open A11y FixList.
2. Paste HTML into the **HTML Input** field, or load the sample HTML.
3. Select **Scan pasted HTML**.
4. Review the detected issues and use the severity/category filters where needed.
5. Select **View in HTML** to navigate back to the related source when a match can be found.
6. Copy or download the Markdown report for review or follow-up work.

## Scope and limitations

A11y FixList provides automated first-pass accessibility checks only. A successful scan does not mean that a page is fully WCAG compliant, and manual accessibility review is still required.

The current standalone version scans HTML pasted into the app. It does not inspect the DOM of an external browser tab or replace tools such as axe, WAVE, Lighthouse, assistive-technology testing or a professional accessibility audit.

Some accessibility requirements cannot be reliably determined from static HTML alone, including areas such as colour contrast, keyboard behaviour, focus order, interaction behaviour, content meaning and the quality of alternative text.

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- FreeAppStore SDK
- Progressive Web App support

## Local development

Requirements:

- Node.js 22 or later
- pnpm

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Project structure

```text
web/src/
├─ components/       UI components
├─ services/         Scanner, extraction and report logic
│  └─ rules/         Accessibility rule implementations
├─ App.tsx
├─ main.tsx
└─ types.ts
```

## Testing

The project includes automated tests for scanner and report behaviour, including accessibility rule edge cases and regression scenarios.

Run the test suite with:

```bash
pnpm test
```

Run coverage with:

```bash
pnpm test:coverage
```

## Future improvements

Potential future improvements include browser-page scanning through a companion bookmarklet or browser extension, additional accessibility rules, richer source-location matching and expanded component/integration testing.

## License

MIT.
