---
name: F&B Controller System
colors:
  surface: '#f8faf9'
  surface-dim: '#d8dada'
  surface-bright: '#f8faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f3'
  surface-container: '#eceeed'
  surface-container-high: '#e6e9e8'
  surface-container-highest: '#e1e3e2'
  on-surface: '#191c1c'
  on-surface-variant: '#3f4948'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f0'
  outline: '#6f7978'
  outline-variant: '#bfc8c8'
  surface-tint: '#216868'
  primary: '#004343'
  on-primary: '#ffffff'
  primary-container: '#0f5c5c'
  on-primary-container: '#90d2d1'
  inverse-primary: '#90d2d1'
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#5e2f16'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a452a'
  on-tertiary-container: '#ffb693'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aceeee'
  primary-fixed-dim: '#90d2d1'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f50'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb693'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#6c391f'
  background: '#f8faf9'
  on-background: '#191c1c'
  surface-variant: '#e1e3e2'
typography:
  display-lg:
    fontFamily: hankenGrotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: hankenGrotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: hankenGrotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: hankenGrotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: sourceSerif4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: sourceSerif4
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-md:
    fontFamily: hankenGrotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: hankenGrotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is engineered for precision and quiet authority, specifically tailored for restaurant consultancies and high-stakes financial auditing. It rejects the "gamified" aesthetics of modern consumer apps in favor of an elevated editorial approach that mimics the sobriety of premium consultancy whitepapers.

The visual narrative is built on the contrast between sharp, technical sans-serif layouts and the literary warmth of serif body text. The emotional response is one of calm confidence—reassuring the user that the data is accurate, the analysis is rigorous, and the platform is a professional tool rather than a toy. The style is **Modern Editorial**, characterized by generous whitespace, disciplined color application, and a focus on legible data density.

## Colors

The color strategy uses a deep **Ink (#111827)** as the foundational neutral to establish immediate gravitas. The primary brand accent, **Deep Teal (#0F5C5C)**, is applied with extreme restraint—reserved exclusively for primary calls to action and active navigational states to maintain the "audit-first" focus.

Data visualization and status reporting utilize a sophisticated semantic palette. These colors are paired with light background washes to create "label-backed" indicators that are highly legible without being visually noisy. The **Canvas (#F9FAFB)** provides a soft contrast against **White (#FFFFFF)** cards, allowing for a natural layering effect without heavy reliance on shadows.

## Typography

This design system employs a dual-font strategy to balance technical utility with editorial elegance. 

1. **Hanken Grotesk** is the engine of the interface. It is used for all functional elements, headlines, and data displays. Its sharp, contemporary geometry provides the "precise" feel required for financial auditing.
2. **Source Serif 4** is utilized for long-form report content, executive summaries, and descriptive body text. This introduces a "consultancy" feel, making reports feel like significant, considered documents rather than ephemeral dashboards.

**Data Alignment:** All numerical values must utilize the `tnum` (tabular figures) OpenType feature. This ensures that columns of numbers align perfectly on their decimal points, a critical requirement for cost-control auditing.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. On desktop, content is constrained to a 1440px max-width container with a 12-column grid to maintain readability of data-heavy tables and reports. 

The spacing rhythm is built on a 4px baseline, but defaults to 16px (md) and 24px (lg) for most component spacing to ensure the interface feels airy and organized. High-density data tables are the exception, utilizing 8px (sm) vertical padding to maximize information density without sacrificing horizontal scan-lines. 

**Mobile Adaptivity:** At the 768px breakpoint, the grid collapses to 4 columns, and page margins reduce to 16px. Typography scales down specifically for the Display and Headline roles to ensure long currency values do not wrap.

## Elevation & Depth

Depth in the design system is achieved through **Tonal Layering** and subtle, precise shadows. 

1. **The Canvas:** The lowest layer is the Canvas (#F9FAFB), providing a neutral, non-white foundation that reduces eye strain during long auditing sessions.
2. **The Surface:** Cards and primary content containers are pure White (#FFFFFF).
3. **The Shadow:** Instead of multiple elevation levels, a single "Standard Elevation" is used: `0 1px 2px rgba(16, 24, 40, 0.05)`. This ultra-subtle shadow provides just enough lift to separate the White surface from the Canvas without feeling "floaty."

Borders (#E5E7EB) are the primary tool for structural separation, used in place of shadows for internal table divisions and header sections to maintain a crisp, architectural look.

## Shapes

The design system uses a **Soft (1)** roundedness profile, adjusted for different scales. 

- **Components:** Buttons, inputs, and chips use a consistent **8px** radius. This is soft enough to feel modern but sharp enough to remain professional.
- **Containers:** Cards and large modal overlays use a **12px** radius to provide a distinct visual container for grouped data.
- **Special States:** The "[Needs Data]" state is a unique shape variant—a muted pill with a dashed border, signaling an incomplete or "soft" edge to the audit trail.

## Components

### Buttons & Inputs
Primary buttons use the Deep Teal background with white text. Secondary buttons use a White background with a grey border and Ink text. Input fields should be height-standardized (40px) with 1px grey borders, moving to a Deep Teal border on focus.

### Severity Indicators
Status badges must use the full-width background wash with high-contrast text defined in the color section. They are pill-shaped (full rounding) to contrast against the 8px corners of other components, making them immediately recognizable as status markers.

### Data Tables
Tables are the core of the platform. They should feature:
- Sticky headers with a subtle bottom border.
- Alternating row highlights (Zebra striping) using the Canvas color.
- Right-aligned numerical columns using `tnum` typography.
- "Needs Data" placeholders: Muted Grey (#98A2B3) text with a dashed-border pill.

### Cards
Cards are white with a 12px radius and the standard subtle shadow. They should be used to group related audit metrics (e.g., "Prime Cost Summary") and should feature a Hanken Grotesk title in the top-left corner.

### Icons
Use **Lucide** icons. Set stroke width to 1.5px or 2px to maintain a thin, geometric look that aligns with the sharpness of Hanken Grotesk. Icons should primarily be used as functional cues (e.g., download, filter, alert) rather than decorative elements.