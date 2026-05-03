# PILOT IMPEX — Design System Reference

> **Single source of truth** for all UI styling decisions.  
> Never hardcode hex values in components — always use these tokens.

---

## Brand Colors

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `primary` | `--primary` | `#213C8B` | Brand blue — nav, headings, buttons, links |
| `primary-light` | `--primary-light` | `#3B5998` | Hover states, gradient end |
| `primary-dark` | `--primary-dark` | `#162A6B` | Active states, footer bg, deep accents |
| `brand-accent` | `--brand-accent` | `#2A6F97` | Teal-blue — highlight sections, stats |
| `brand-accent-dark` | `--brand-accent-dark` | `#1D4D6B` | Teal hover state |
| `accent` | `--accent` | `#FBBF24` | Gold — footer bullets, badges |
| `whatsapp` | `--whatsapp` | `#25D366` | WhatsApp buttons only |
| `whatsapp-dark` | `--whatsapp-dark` | `#128C7E` | WhatsApp hover |

## Neutral / Surface Colors

| Token | CSS Variable | Usage |
|---|---|---|
| `background` | `--background` | Page background (white) |
| `foreground` | `--foreground` | Primary text |
| `muted` | `--muted` | Light gray section backgrounds |
| `muted-foreground` | `--muted-foreground` | Secondary/descriptive text |
| `card` | `--card` | Card backgrounds |
| `border` | `--border` | Borders, dividers |

## Typography

| Element | Font | Weight | Class |
|---|---|---|---|
| Headings (h1-h6) | Poppins | 600 (semibold) | `font-heading` |
| Body text | Open Sans | 400 (regular) | `font-sans` (default) |
| Page title | Poppins | 700 (bold) | `font-heading font-bold` |

### Heading Sizes
```
Page Title:    text-3xl md:text-4xl  (or text-4xl md:text-5xl for hero)
Section Title: text-2xl md:text-3xl
Card Title:    text-xl
```

## Common Patterns

### Page Header (Products, About, Contact)
```tsx
<section className="page-header">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h1 className="page-header-title">Page Title</h1>
      <p className="page-header-subtitle">Description text</p>
    </div>
  </div>
</section>
```

### Section with Badge
```tsx
<span className="section-badge">Badge Text</span>
<h2 className="section-title">Section Heading</h2>
<p className="section-subtitle">Description</p>
```

### Navigation Link (active/inactive)
```tsx
className={`... ${
  isActive('/path')
    ? 'text-primary bg-primary/10'
    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
}`}
```

### Section Backgrounds
```
Default:    (no class — white)
Light gray: bg-muted/30
Muted:      bg-muted/50
Brand:      bg-brand-accent  (teal-blue, for highlight sections)
```

### Buttons
```tsx
// Primary CTA
<Button className="bg-primary hover:bg-primary-dark text-primary-foreground">

// WhatsApp
<Button className="bg-whatsapp hover:bg-whatsapp-dark text-white">

// Brand Accent
<Button className="bg-brand-accent hover:bg-brand-accent-dark text-white">

// Outline
<Button variant="outline" className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
```

### Card Hover
```tsx
<Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
```

### Stagger Fade Animation
```tsx
<div className="stagger-fade" style={{ animationDelay: `${index * 0.1}s` }}>
```

## Spacing Standards

| Context | Value |
|---|---|
| Section padding | `py-16` (vertical) |
| Container | `container mx-auto px-4` |
| Grid gap | `gap-6` or `gap-8` |
| Card padding | `p-6` |
| Between heading + text | `mb-4` |
| Between sections | `py-12` to `py-20` |

## Shadows
```
Soft:   shadow-sm  or  var(--shadow-soft)
Medium: shadow-md
Strong: shadow-lg  or  var(--shadow-strong)
Glow:   var(--shadow-glow) — accent glow
```

## Transitions
```
Smooth: transition-all duration-300
Fast:   transition-all duration-200
Hover lift: hover:-translate-y-1
```

## Dark Mode

Dark mode variables are defined in `index.css` under `.dark`. 
Toggle is not yet implemented in the UI — variables are ready for when needed.

---

## File Locations

| What | Where |
|---|---|
| CSS Variables | `src/index.css` |
| Tailwind Config | `tailwind.config.ts` |
| UI Components | `src/components/ui/` (shadcn/ui) |
| Custom Components | `src/components/` |
| Pages | `src/pages/` |

## Rules

1. **Never** use hardcoded hex in `className` (no `bg-[#213C8B]`)
2. **Never** use inline `style={{ backgroundColor }}` for brand colors
3. **Never** use raw Tailwind colors (`text-blue-600`, `bg-gray-100`) for brand elements
4. **Always** use design tokens: `text-primary`, `bg-muted`, `text-muted-foreground`
5. Category icons in Navigation are the **only exception** — they use distinct colors per category
