# TungaOS Design System

**Version:** 1.0 · **Scope:** Enterprise Luxury Hotel ERP UI  
**Philosophy:** Luxury · Premium · Minimal · Professional

---

## 1. Brand

| Token | Value |
|-------|-------|
| Application | TungaOS |
| Vendor | Sharada Sama Solutions |
| Primary | Luxury Navy `#001F3F` |
| Secondary | Luxury Gold `#C9A227` |
| Logo | `/public/brand/tunga-logo.svg` (replace with uploaded asset) |

Use the `Logo` component — never redesign the mark.

```tsx
import { Logo } from '@/components/common/logo';
<Logo variant="full" showVendor />
```

---

## 2. Folder Structure

```
apps/web/src/
├── theme/              # Design tokens (colors, typography, spacing)
├── animations/         # Framer Motion presets
├── icons/              # Module icon registry (Lucide)
├── components/
│   ├── ui/             # Shadcn-extended primitives
│   ├── layouts/        # AppShell, Sidebar, TopNavbar, PageHeader
│   ├── forms/          # FormField, FormSection
│   ├── tables/         # DataTable
│   ├── cards/          # StatCard, KpiCard
│   ├── modals/         # ConfirmDialog
│   ├── feedback/       # EmptyState
│   ├── auth/           # AuthShell, ErrorPage
│   └── common/         # Logo
├── providers/          # ThemeProvider, AuthProvider
├── hooks/              # useSidebar, useMediaQuery, useTheme
└── styles/             # globals.css (CSS variables)
```

---

## 3. Design Tokens

Import from `@/theme`:

```tsx
import { tokens, brand, spacing, radius, shadows } from '@/theme';
```

### Color scales (50–900)
`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`

### Semantic
- Background: white / muted grey
- Sidebar: dark navy
- Cards: white with `shadow-card`
- Borders: light grey `#E2E8F0`

### Spacing (8pt grid)
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96` px

### Radius
`sm (6px)`, `md (8px)`, `lg (12px)`, `xl (16px)`, `pill`, `circle`

### Shadows
`card`, `floating`, `dialog`, `dropdown`, `nav`

---

## 4. Typography

| Role | Font | Usage |
|------|------|-------|
| Headings | Playfair Display | H1–H6, display |
| Body | Inter | UI, tables, forms |

Utility classes: `.text-display`, `.text-h1` … `.text-h6`, `.text-body`, `.text-caption`, `.text-label`

---

## 5. Component Library

### UI Primitives (`@/components/ui`)
Button, Input, Label, Textarea, Select, Checkbox, Switch, Badge, Card, Dialog, DropdownMenu, Tabs, Tooltip, Avatar, Separator, Progress, Skeleton, Spinner, ScrollArea, Alert

### Buttons
Variants: `default`, `secondary`, `outline`, `ghost`, `destructive`, `success`, `warning`, `link`  
States: hover, pressed (`active:scale`), disabled, loading (`isLoading`)

### Forms
```tsx
<FormField label="Email" required error={errors.email?.message}>
  <Input {...register('email')} />
</FormField>
```

### Tables
```tsx
<DataTable columns={columns} data={rows} enableSelection isLoading={loading} />
```

### Layout
```tsx
<AppShell>
  <PageHeader title="..." breadcrumb={...} actions={...} />
  <div className="ds-page">{children}</div>
</AppShell>
```

---

## 6. Module Icons

```tsx
import { moduleIcons } from '@/icons';
const Icon = moduleIcons.reservations;
```

Keys: `dashboard`, `reservations`, `rooms`, `housekeeping`, `restaurant`, `inventory`, `finance`, `crm`, `hr`, `reports`, `settings`

---

## 7. Animations

```tsx
import { MotionBox, motionPresets } from '@/animations';
<MotionBox preset="fadeIn">{content}</MotionBox>
```

Presets: `fadeIn`, `fade`, `slideRight`, `slideLeft`, `scaleIn`, `hoverLift`

---

## 8. Theme Provider

```tsx
import { useTheme } from '@/providers/theme-provider';
const { theme, setTheme } = useTheme();
```

Supports `light`, `dark`, `system`. Toggle in TopNavbar.

---

## 9. Responsive Breakpoints

| Name | Width |
|------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

Sidebar collapses on mobile; auth layout stacks vertically.

---

## 10. Accessibility (WCAG AA)

- Focus rings on all interactive elements (`ring-2 ring-ring`)
- ARIA labels on icon buttons
- Semantic HTML (`nav`, `main`, `role="alert"`)
- Keyboard navigation via Radix primitives
- Screen reader text (`.sr-only`)

---

## 11. Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase | `StatCard` |
| Token | camelCase | `shadowFloating` |
| CSS utility | kebab-case | `text-h1` |
| File | kebab-case | `stat-card.tsx` |
| Variant | lowercase | `variant="destructive"` |

---

## 12. Storybook Ready

Each component is self-contained with typed props. Recommended story paths:

```
stories/ui/Button.stories.tsx
stories/layouts/AppShell.stories.tsx
stories/cards/StatCard.stories.tsx
```

Import from `@/components/ui` barrel.

---

## 13. Connected Pages

| Area | Uses |
|------|------|
| Auth (`/login`, etc.) | `AuthShell`, `AuthCard`, `FormField`, `Button`, `Input` |
| Dashboard | `AppShell`, `AppSidebar`, `TopNavbar`, `PageHeader`, `StatCard` |
| Errors (401/403/404/500) | `ErrorPage`, `Button` |
| Public site | `Logo`, design tokens via Tailwind |

---

## 14. Adding a New Module

1. Add icon to `icons/module-icons.tsx`
2. Add sidebar item in layout or pass `navItems` to `AppShell`
3. Use `PageHeader` + `ds-page` wrapper
4. Compose from `ui/`, `tables/`, `cards/` — never duplicate primitives

---

*Maintained by TungaOS Product Design — Sharada Sama Solutions*
