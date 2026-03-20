# Settings Page Implementation Plan

## 1. Create SettingsProvider (`src/app/providers/SettingsProvider.jsx`)
- Context + Provider with localStorage persistence
- Settings: fontSize (small/medium/large), accentColor (preset colors), cardOrder (source-first/target-first)
- Custom hook: `useSettings()`

## 2. Apply settings to :root via useEffect
- `--font-size-base` for font size
- `--accent-primary` and `--accent-light` for theme color

## 3. Rebuild SettingsPage (`src/pages/SettingsPage/`)
- Appearance section: font size selector (3 buttons), color picker (colored circles)
- Learning section: card display order toggle
- General section: version, UI language

## 4. Update BottomNav
- Replace User icon with Settings icon
- Add navigation (useNavigate) to settings and home
- Active state based on current route (useLocation)

## 5. Files to create/edit
- CREATE: `src/app/providers/SettingsProvider.jsx`
- EDIT: `src/app/providers/AppProviders.jsx`
- EDIT: `src/pages/SettingsPage/SettingsPage.jsx`
- EDIT: `src/pages/SettingsPage/SettingsPage.module.css`
- EDIT: `src/shared/components/BottomNav.jsx`
- EDIT: `src/shared/components/NavBtn.jsx`
- EDIT: `src/shared/styles/variables.css`
