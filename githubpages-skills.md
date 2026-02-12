# GitHub Pages Deployment Guidelines

This project is configured for deployment to GitHub Pages.

## Configuration
- **Base URL**: `/ascii-generator/` (configured in `vite.config.js`)
- **Deployment Tool**: `gh-pages`

## Deployment Commands
Run the following command to build and deploy the application:
```bash
npm run deploy
```

## Key Considerations
- Ensure the `base` path in `vite.config.js` matches your repository name.
- Static assets in the `public/` directory should be referenced using relative paths in your code or prefixed with the base URL.
