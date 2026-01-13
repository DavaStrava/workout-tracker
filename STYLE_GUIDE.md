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

### Font Weights
| Usage | Weight |
|-------|--------|
| Hero headings | 900 (Black) |
| Section headings | 700 (Bold) |
| Button text | 600 (Semibold) |
| Body text | 500 (Medium) |
| Regular text | 400 (Normal) |

### Font Sizes
| Element | Size |
|---------|------|
| Hero heading | 48px |
| Page title | 32px - 36px |
| Section heading | 24px |
| Card title | 20px - 22px |
| Body large | 18px |
| Body | 16px |
| Small / Caption | 14px |
| Tiny / Label | 12px |

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
| Name | Value |
|------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

### Component Spacing
- Card padding: 24px
- Card gap (grid): 16px
- Section gap: 32px
- Inner element gap: 12px - 16px

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
    background: 'linear-gradient(135deg, #fb923c 0%, #f472b6 50%, #c084fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 900,
  }}
>
```
