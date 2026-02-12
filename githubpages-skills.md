---
name: github_pages_deployment
description: Guidelines for deploying Vite/React projects to GitHub Pages with correct path resolution.
---

# GitHub Pages Deployment Skill

This skill provides a checklist and configuration patterns to ensure Vite projects deploy correctly to GitHub Pages, avoiding common 404 errors related to path resolution.

## 1. Vite Configuration (`vite.config.ts`)

When deploying to a sub-path (e.g., `https://username.github.io/repo-name/`), you MUST set the `base` property.

```typescript
// vite.config.ts
export default defineConfig({
  base: '/repo-name/', // Must match the repository name exactly
  plugins: [react()],
})
```

## 2. Deployment Scripts (`package.json`)

Install the `gh-pages` package:
```bash
npm install --save-dev gh-pages
```

Add the following scripts to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

## 3. Path Resolution in Code

- **Assets**: Use relative paths or paths that account for the `base` URL. Vite's standard asset importing (e.g., `import logo from './logo.svg'`) handles this automatically.
- **Manual Paths**: If referencing assets in `public/` manually (e.g., in `index.html`), use relative paths like `./favicon.ico` or prefix with the base path if needed.

## 4. Verification Checklist

1. [ ] Check `vite.config.ts` for the correct `base` path.
2. [ ] Ensure `gh-pages` is in `devDependencies`.
3. [ ] Verify `npm run build` generates a `dist/` folder.
4. [ ] Run `npm run deploy` and wait for the GitHub Action (Pages) to complete.
5. [ ] Visit the live URL and check the browser console for 404 errors on `.js` or `.css` files.
