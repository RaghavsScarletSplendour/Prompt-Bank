# Login Page Design Plan - Prompt Bank

## Overview

Design a professional, immersive login page that integrates seamlessly with the existing "glowing node aesthetic" while leveraging ClerkJS for authentication. The goal is to create a visually stunning first impression that establishes brand identity.

---

## Current State Analysis

**Existing Implementation** (`/app/sign-in/[[...sign-in]]/page.tsx`):
- Basic centered Clerk `SignIn` component
- Plain gray background (`bg-gray-950`)
- No branding or custom styling
- No integration with the particle background

**Issues to Address**:
1. Doesn't match the app's design language
2. No particle background visible on sign-in page
3. Missing brand presence and welcome messaging
4. Default Clerk styling conflicts with dark theme

---

## Design Specifications

### 1. Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    [Particles Background]                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │                    ┌─────────────────┐                  │ │
│  │                    │   LOGO/ICON     │                  │ │
│  │                    │   Prompt Bank   │                  │ │
│  │                    │   Tagline       │                  │ │
│  │                    └─────────────────┘                  │ │
│  │                                                         │ │
│  │              ┌─────────────────────────┐                │ │
│  │              │                         │                │ │
│  │              │   CLERK SIGN-IN CARD    │                │ │
│  │              │   (Themed to match)     │                │ │
│  │              │                         │                │ │
│  │              └─────────────────────────┘                │ │
│  │                                                         │ │
│  │                    Footer text                          │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2. Visual Design Elements

#### A. Background Layer
- **Particle Background**: Same interactive particles from `ParticlesBackground.tsx`
- Creates depth and maintains brand consistency across the entire app

#### B. Branding Section (Above Sign-In Card)
- **Logo/Icon**: Glowing node-style icon representing prompt/AI
  - Suggested: A minimalist neural network node with cyan glow
  - Size: 48-64px
  - Shadow: `shadow-[0_0_30px_rgba(6,182,212,0.4)]`

- **App Name**: "Prompt Bank"
  - Font: Geist Sans
  - Size: `text-3xl` to `text-4xl` (30-36px)
  - Color: White (`text-white`)
  - Weight: `font-bold`

- **Tagline**: "Save, organize, and access your prompts"
  - Font: Geist Sans
  - Size: `text-base` (16px)
  - Color: `text-gray-400`
  - Weight: `font-normal`

#### C. Sign-In Card Container
- **Background**: Semi-transparent dark (`bg-black/70` or `bg-[#0d1117]/90`)
- **Backdrop**: `backdrop-blur-md` for glassmorphism effect
- **Border**: `border border-white/10` (subtle white border)
- **Border Radius**: `rounded-2xl` (16px)
- **Shadow**: Cyan glow for emphasis
  ```css
  shadow-[0_0_40px_rgba(6,182,212,0.15)]
  ```
- **Padding**: Handled by Clerk styling overrides
- **Max Width**: `max-w-md` (448px)

#### D. Clerk Theme Customization (via `appearance` prop)

```typescript
appearance={{
  baseTheme: dark,
  variables: {
    // Core colors
    colorPrimary: '#06b6d4',           // Cyan-500
    colorPrimaryHover: '#22d3ee',      // Cyan-400
    colorBackground: 'transparent',     // Transparent for glassmorphism
    colorInputBackground: '#1f2937',    // Gray-800
    colorInputText: '#f3f4f6',          // Gray-100
    colorText: '#f3f4f6',               // Gray-100
    colorTextSecondary: '#9ca3af',      // Gray-400
    colorDanger: '#dc2626',             // Red-600

    // Border & Radius
    borderRadius: '0.5rem',             // 8px
    colorNeutral: '#374151',            // Gray-700 for borders

    // Typography
    fontFamily: 'var(--font-geist-sans), sans-serif',
    fontFamilyButtons: 'var(--font-geist-sans), sans-serif',

    // Spacing
    spacingUnit: '1rem',
  },
  elements: {
    // Root card
    card: 'bg-transparent shadow-none',

    // Form container
    formButtonPrimary:
      'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all',

    // Input fields
    formFieldInput:
      'bg-[#1f2937] border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20',

    // Social buttons
    socialButtonsBlockButton:
      'bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors',

    // Divider
    dividerLine: 'bg-gray-700',
    dividerText: 'text-gray-500',

    // Footer links
    footerActionLink: 'text-cyan-400 hover:text-cyan-300',

    // Header
    headerTitle: 'text-white text-xl font-semibold',
    headerSubtitle: 'text-gray-400',
  }
}}
```

### 3. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Full-width card, reduced padding, smaller logo |
| Tablet (640-1024px) | Centered card, standard spacing |
| Desktop (>1024px) | Centered card, generous whitespace |

### 4. Animation & Interactions

- **Page Load**: Subtle fade-in animation for the branding section
  ```css
  animate-fade-in-up (0.6s ease-out)
  ```

- **Card Appearance**: Slight scale-up animation
  ```css
  animate-scale-in (0.4s ease-out, 0.2s delay)
  ```

- **Particle Interaction**: Same grab/push modes as main app
- **Button Hover**: Cyan glow intensifies on primary buttons
- **Input Focus**: Cyan ring with subtle glow

### 5. Accessibility Considerations

- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Focus states clearly visible with cyan ring
- Proper semantic HTML structure
- Screen reader compatible (via Clerk's built-in a11y)

---

## Implementation Steps

### Step 1: Create Sign-In Layout
Create a dedicated layout for auth pages that removes the sidebar but keeps the particle background.

**File**: `/app/(auth)/layout.tsx`
```
- ClerkProvider wrapper (inherited from root)
- ParticlesBackground component
- Centered container without sidebar
- Responsive padding
```

### Step 2: Move Sign-In Page
Move the sign-in page under the auth layout group.

**New Path**: `/app/(auth)/sign-in/[[...sign-in]]/page.tsx`

### Step 3: Create Branding Component
Create a reusable auth header component for branding.

**File**: `/components/auth/AuthHeader.tsx`
```
- Logo icon with glow effect
- App name typography
- Tagline text
- Fade-in animation
```

### Step 4: Create Clerk Theme Configuration
Extract Clerk appearance configuration to a separate file.

**File**: `/config/clerk-theme.ts`
```
- Export appearance configuration object
- Include dark theme variables
- Define element-specific overrides
```

### Step 5: Add CSS Animations
Add keyframe animations to globals.css.

**File**: `/app/globals.css`
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### Step 6: Update Sign-In Page
Compose the final sign-in page with all elements.

**Final Structure**:
```tsx
<div className="min-h-screen flex items-center justify-center p-4">
  <div className="w-full max-w-md space-y-8">
    <AuthHeader />
    <div className="auth-card-container">
      <SignIn appearance={clerkTheme} />
    </div>
    <Footer />
  </div>
</div>
```

### Step 7: Add Sign-Up Page (Optional)
Create matching sign-up page using the same design.

**File**: `/app/(auth)/sign-up/[[...sign-up]]/page.tsx`

---

## Design Tokens Reference

| Token | Value | Usage |
|-------|-------|-------|
| Primary Cyan | `#06b6d4` | Buttons, focus rings, links |
| Primary Cyan Hover | `#22d3ee` | Button hover states |
| Surface Dark | `#0d1117` | Card backgrounds |
| Surface Input | `#1f2937` | Input backgrounds |
| Text Primary | `#f3f4f6` | Main text |
| Text Secondary | `#9ca3af` | Muted text |
| Border | `rgba(255,255,255,0.1)` | Card borders |
| Glow Shadow | `rgba(6,182,212,0.3)` | Button glow |
| Card Glow | `rgba(6,182,212,0.15)` | Container glow |

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `/app/(auth)/layout.tsx` | Create | Auth-specific layout without sidebar |
| `/app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Create | New themed sign-in page |
| `/app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Create | Matching sign-up page |
| `/components/auth/AuthHeader.tsx` | Create | Branding component |
| `/config/clerk-theme.ts` | Create | Clerk appearance config |
| `/app/globals.css` | Modify | Add animations |
| `/app/sign-in/[[...sign-in]]/page.tsx` | Delete | Remove old sign-in page |
| `/middleware.ts` | Modify | Update public routes for new paths |

---

## Visual Mockup (ASCII)

```
┌────────────────────────────────────────────────────────────────┐
│ ○   ○        ○                    ○      ○                     │
│       ○            ○   ○      ○                  ○              │
│   ○        ○                         ○       ○                 │
│                        ╭─────────────────────╮                 │
│         ○              │      ◉ ◉ ◉         │        ○         │
│                        │   [Node Logo]      │                  │
│    ○          ○        │                    │                  │
│                        │   Prompt Bank      │     ○            │
│         ○              │   Save & organize  │                  │
│                        ╰─────────────────────╯                 │
│   ○           ○   ╭──────────────────────────────╮             │
│                   │ ┌──────────────────────────┐ │   ○         │
│        ○          │ │  Email                   │ │             │
│                   │ └──────────────────────────┘ │             │
│   ○               │ ┌──────────────────────────┐ │      ○      │
│          ○        │ │  Password                │ │             │
│                   │ └──────────────────────────┘ │             │
│       ○           │  ┌────────────────────────┐  │    ○        │
│                   │  │     Continue ✨        │  │             │
│  ○          ○     │  └────────────────────────┘  │             │
│                   │       ─── or ───             │      ○      │
│       ○           │  [Google] [GitHub] [etc]     │             │
│            ○      ╰──────────────────────────────╯             │
│   ○                                         ○           ○      │
│          ○    ○        ○            ○                          │
└────────────────────────────────────────────────────────────────┘

Legend:
○ = Floating particles (animated)
✨ = Cyan glow effect on button
╭╮╯╰│ = Glassmorphic card with border
```

---

## Success Criteria

1. **Visual Consistency**: Login page matches app's glowing node aesthetic
2. **Brand Identity**: Clear Prompt Bank branding visible
3. **Usability**: Clear, intuitive sign-in flow
4. **Performance**: Smooth animations, no layout shift
5. **Responsiveness**: Works on all screen sizes
6. **Accessibility**: Meets WCAG AA standards
7. **Code Quality**: Follows existing patterns, uses design tokens
