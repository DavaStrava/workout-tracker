# UI Style Guide

This document defines the consistent styling patterns used throughout the Workout Tracker app. All UI components should follow these guidelines.

## Color Palette

### Brand Colors (Vibrant Sunset Theme)
```css
--orange-primary: #f97316;    /* Primary orange */
--orange-light: #fb923c;      /* Light orange */
--pink-primary: #ec4899;      /* Primary pink */
--pink-light: #f472b6;        /* Light pink */
--purple-primary: #a855f7;    /* Primary purple */
--purple-light: #c084fc;      /* Light purple */
```

### Background Colors
```css
--bg-app: #1a1625;                        /* App background */
--bg-card: rgba(30, 27, 50, 0.8);         /* Card background */
--bg-card-hover: rgba(45, 38, 64, 0.9);   /* Card hover state */
--bg-input: rgba(255, 255, 255, 0.05);    /* Input background */
```

### Text Colors
```css
--text-primary: #ffffff;                   /* Primary text */
--text-secondary: rgba(255, 255, 255, 0.8); /* Secondary text */
--text-muted: rgba(255, 255, 255, 0.6);   /* Muted text */
--text-subtle: rgba(255, 255, 255, 0.4);  /* Subtle text */
```

### Border Colors
```css
--border-subtle: rgba(255, 255, 255, 0.1);  /* Subtle borders */
--border-medium: rgba(255, 255, 255, 0.15); /* Medium borders */
```

## Gradients

### Primary Gradient (Orange → Pink → Purple)
```css
background: linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%);
```

### Button Gradients
```css
/* Strength / Primary */
background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ec4899 100%);

/* Cardio */
background: linear-gradient(135deg, #ec4899 0%, #db2777 50%, #a855f7 100%);

/* HIIT */
background: linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #f97316 100%);
```

### Gradient Text
```css
background: linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

## Border Radius

| Element | Radius | CSS |
|---------|--------|-----|
| Large cards / Buttons | 24px | `border-radius: 24px` or `rounded-3xl` |
| Medium cards | 20px | `border-radius: 20px` |
| Standard cards | 16px | `border-radius: 16px` or `rounded-2xl` |
| Inner elements | 12px | `border-radius: 12px` or `rounded-xl` |
| Small elements | 8px | `border-radius: 8px` or `rounded-lg` |
| Pills / Tags | 9999px | `border-radius: 9999px` or `rounded-full` |

## Shadows

### Glow Shadows (for gradient buttons)
```css
/* Orange glow */
box-shadow: 0 20px 40px rgba(249, 115, 22, 0.3);

/* Pink glow */
box-shadow: 0 20px 40px rgba(236, 72, 153, 0.3);

/* Purple glow */
box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3);
```

### Subtle Shadow
```css
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
```

## Typography

The app uses the system font stack for optimal performance and native feel.

### Font Weights
| Usage | Weight | Example |
|-------|--------|---------|
| Hero headings | 900 (Black) | "Let's Get Moving", page titles |
| Section headings | 700 (Bold) | Card titles, button labels |
| Button text | 600 (Semibold) | CTA buttons, navigation |
| Body text | 500 (Medium) | Descriptions, subtitles |
| Regular text | 400 (Normal) | General content |

### Font Sizes
| Element | Size | Line Height |
|---------|------|-------------|
| Hero heading | 48px | 1.1 |
| Page title | 36px | 1.2 |
| Section heading | 24px | 1.3 |
| Card title | 20px - 22px | 1.3 |
| Body large | 18px | 1.5 |
| Body | 15px - 16px | 1.5 |
| Small / Caption | 14px | 1.4 |
| Tiny / Label | 12px - 13px | 1.4 |

### Text Colors
| Type | Color | Usage |
|------|-------|-------|
| Primary | `#ffffff` | Headings, important text |
| Secondary | `rgba(255, 255, 255, 0.85)` | Button descriptions, body on gradients |
| Muted | `rgba(255, 255, 255, 0.6)` | Subtitles, helper text |
| Subtle | `rgba(255, 255, 255, 0.5)` | Placeholders, disabled |
| Faint | `rgba(255, 255, 255, 0.4)` | Very subtle hints |

### Letter Spacing
- Hero headings: `-0.02em` (slightly tighter)
- Body text: `normal`
- Labels/Uppercase: `0.5px`

## Component Patterns

### Cards
```css
/* Standard Card */
background: rgba(30, 27, 50, 0.8);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 24px;
padding: 24px;

/* Card with gradient accent */
background: rgba(30, 27, 50, 0.8);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 24px;
padding: 24px;
/* Add subtle gradient overlay or border */
```

### Large Action Buttons
```css
background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
border-radius: 24px;
padding: 20px 32px;
font-size: 18px;
font-weight: 600;
box-shadow: 0 20px 40px rgba(249, 115, 22, 0.3);
```

### Stat Cards
```css
background: rgba(30, 27, 50, 0.8);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 20px;
padding: 20px;
/* Icon colored to match gradient theme */
```

### Input Fields
```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
padding: 12px 16px;
color: #ffffff;
/* Focus state */
border-color: #ec4899;
box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
```

## Animation Guidelines

### Transitions
```css
/* Standard transition */
transition: all 0.2s ease;

/* Smooth transition */
transition: all 0.3s ease;
```

### Hover Effects
- Scale up slightly: `transform: scale(1.02)`
- Lift effect: `transform: translateY(-4px)`
- Background lighten: Increase alpha of background

### Tap/Click Effects
- Scale down: `transform: scale(0.98)`

## Spacing

### Standard Spacing Scale
| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight inline spacing |
| sm | 8px | Icon gaps, small margins |
| md | 12px | Inner element gaps |
| lg | 16px | Card grid gaps |
| xl | 20px | Button gaps in lists |
| 2xl | 24px | Card padding, section margins |
| 3xl | 32px | Section gaps, page margins |
| 4xl | 48px | Large section separators |

### Component Spacing
- Card padding: 24px
- Card gap (in grids): 16px
- Button list gap: 20px (between stacked buttons)
- Section gap: 32px
- Inner element gap: 12px - 16px
- Icon to text gap: 12px - 20px
- Header margin bottom: 32px

## Usage Examples

### Workout Type Button
```tsx
<button
  style={{
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ec4899 100%)',
    boxShadow: '0 20px 40px rgba(249, 115, 22, 0.3)',
    borderRadius: '24px',
    padding: '24px',
  }}
>
```

### Section Card
```tsx
<div
  style={{
    background: 'rgba(30, 27, 50, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '24px',
  }}
>
```

### Gradient Heading
```tsx
<h1
  style={{
    fontSize: '36px',
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
  }}
>
  Page Title
</h1>
<p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px', fontWeight: 500 }}>
  Subtitle text here
</p>
```

### Workout Type Button (Full Example)
```tsx
<button
  style={{
    position: 'relative',
    overflow: 'hidden',
    color: '#fff',
    textAlign: 'left',
    flex: 1,
    minHeight: '110px',
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ec4899 100%)',
    boxShadow: '0 20px 40px rgba(249, 115, 22, 0.3)',
    borderRadius: '24px',
    padding: '24px',
    border: 'none',
    cursor: 'pointer',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '16px' }}>
      {/* Icon */}
    </div>
    <div style={{ flex: 1 }}>
      <h3 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>Title</h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', fontWeight: 500 }}>Description</p>
    </div>
  </div>
</button>
```

## Implementation Notes

### Use Inline Styles for Gradients
Tailwind CSS purges dynamic class names at build time. Always use inline `style={{}}` for:
- Gradient backgrounds
- Dynamic colors
- Box shadows with specific colors

```tsx
// ❌ DON'T - Will be purged
<div className={`bg-gradient-to-br ${dynamicGradient}`}>

// ✅ DO - Always works
<div style={{ background: gradientValue }}>
```

### Prefer Inline Styles for Consistency
For major UI components (cards, buttons, headers), use inline styles to:
- Ensure design system values are applied exactly
- Avoid Tailwind class conflicts
- Make styling more explicit and maintainable
