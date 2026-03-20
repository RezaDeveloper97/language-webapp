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

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
```
