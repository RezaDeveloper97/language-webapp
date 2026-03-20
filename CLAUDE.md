# CLAUDE.md — Coding Standards

## Architecture: Clean Architecture + SOLID

```
src/
├── app/          → App bootstrap, routing, providers
├── pages/        → Page-level components (one per route)
├── features/     → Feature modules (phrases, search, pairs)
├── shared/       → Reusable components, hooks, layouts, styles
├── data/         → Data layer (JSON, loaders, manifests)
```

## Rules

### 1. No Inline Styles
- **NEVER** use `style={{}}` for styling
- Use **CSS Modules** (`*.module.css`) for all component styles
- Only exception: CSS custom property binding → `style={{ '--accent': color }}`

### 2. Component Structure
- One component per file
- Each component: `ComponentName.jsx` + `ComponentName.module.css`
- Use named exports (except `App.jsx` default export)
- Keep components under 150 lines — split if larger

### 3. SOLID Principles
- **S**: Each module/component has a single responsibility
- **O**: Extend via composition (new components), not by modifying existing ones
- **L**: Child components must be substitutable in their parent context
- **I**: Props should be minimal — don't pass unused data
- **D**: Components depend on abstractions (hooks, context), not concrete implementations

### 4. Hooks
- Custom hooks live in `hooks/` folder within their feature or `shared/hooks/`
- Prefix with `use` — e.g., `useSwipe`, `usePairLoader`
- One hook per file

### 5. Styling
- Design tokens in `src/shared/styles/variables.css`
- Use CSS variables from `variables.css` — never hardcode colors
- Dynamic values via CSS custom properties: `style={{ '--accent': color }}`
- Class composition: `` className={`${styles.base} ${condition ? styles.active : ''}` ``}

### 6. Routing
- Routes defined in `src/app/router.jsx`
- One page = one folder in `src/pages/PageName/`
- Shared layout in `src/shared/layouts/`
- Use `<Outlet context={}>` for passing data to child routes

### 7. Data
- JSON data files in `src/data/`
- Lazy-load language pairs via dynamic `import()`
- Cache loaded data in refs to avoid re-fetching

### 8. Internationalization (i18n)
- **NEVER** hardcode UI text in components — all user-facing strings must use `t()` from `useTranslation` hook
- Translation files live in `src/data/locales/{locale}.json` (e.g., `fa.json`, `en.json`)
- Use flat dot-namespaced keys — e.g., `"settings.title"`, `"home.searchResults"`
- For dynamic values use interpolation: `t("home.searchResults", { count: 5 })`
- Default locale is `fa` (Persian) — stored in localStorage via `SettingsProvider`

#### Adding a new UI locale
1. Create `src/data/locales/{locale}.json` — copy all keys from `fa.json` and translate
2. Add entry to `src/data/locales/supported.js` with `id`, `label`, and `dir` (`"rtl"` or `"ltr"`)
3. Add lazy loader in `I18nProvider.jsx` → `LOCALE_LOADERS` object: `{locale}: () => import("../../data/locales/{locale}.json")`
4. Add `"lang.{locale}"` key to **every** existing locale file (so all locales can display the new language name)

#### Adding a new language pair
1. Create folder `src/data/pairs/{source}-{target}/` with `meta.json` and `phrases.json`
2. `meta.json` must include: `id`, `sourceLang` (`code`, `name`, `flag`), `targetLang` (`code`, `name`, `flag`)
3. Add the pair to `src/data/pairs/manifest.js`
4. Add `"lang.{code}"` translation keys for any new language codes to **all** locale files
5. Pair names and descriptions are **never** hardcoded — they are built dynamically via `t("pairPicker.pairName", { source, target })` and `t("app.description")`

#### Direction (RTL / LTR)
- Each locale in `supported.js` has a `dir` field (`"rtl"` or `"ltr"`)
- `I18nProvider` syncs `document.documentElement.dir` and `lang` on locale change
- Components read direction via `const { dir } = useTranslation()`
- **NEVER** hardcode `direction` or read it from pair `meta.json` — always derive from the active UI locale

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
```
