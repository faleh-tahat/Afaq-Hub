# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ (LTS)
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Clone and install:**
   ```bash
   git clone <repository>
   cd afaq-hub
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env.local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

## Development Workflow

### Before Starting

- Create a feature branch: `git checkout -b feature/your-feature`
- Keep commits atomic and focused
- Write meaningful commit messages

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules: `npm run lint --fix`
- Format code: `npm run format`
- Write tests for new features

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## Architecture

### App Router Structure

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Homepage
├── not-found.tsx        # 404 page
├── [route]/
│   ├── layout.tsx       # Route layout
│   └── page.tsx         # Route page
└── api/
    └── [endpoint]/
        └── route.ts     # API route
```

### Component Organization

```
components/
├── ui/                  # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── section-*.tsx        # Page sections
├── site-header.tsx      # Header
└── site-footer.tsx      # Footer
```

### State Management

- **Context API** for global state (language)
- **React hooks** for component state
- **Server components** for server-side data

### Styling

- **Tailwind CSS** for utility-first styling
- **CSS-in-JS** optional with Tailwind
- Color scheme defined in `tailwind.config.ts`

## Common Tasks

### Adding a New Page

1. **Create page directory:**
   ```bash
   mkdir -p app/my-page
   ```

2. **Create page file:**
   ```typescript
   // app/my-page/page.tsx
   'use client';

   import { useTranslation } from '@/components/language-provider';

   export default function MyPage() {
     const t = useTranslation();
     
     return (
       <div>
         {/* Your content */}
       </div>
     );
   }
   ```

3. **Add translations to `lib/i18n.ts`**

4. **Update navigation in `components/site-header.tsx`**

### Adding a New Component

1. **Create component:**
   ```typescript
   // components/my-component.tsx
   'use client';

   interface MyComponentProps {
     title: string;
     children?: React.ReactNode;
   }

   export function MyComponent({ title, children }: MyComponentProps) {
     return <div>{title}{children}</div>;
   }
   ```

2. **Add to appropriate section**

3. **Test component**

### Adding Translations

1. **Update `lib/i18n.ts`:**
   ```typescript
   export const translations: Record<Locale, Translation> = {
     en: {
       myKey: 'English text',
     },
     ar: {
       myKey: 'النص العربي',
     },
   };
   ```

2. **Use in components:**
   ```typescript
   const t = useTranslation();
   <div>{t.myKey}</div>
   ```

## Debugging

### Browser DevTools

- Use Chrome DevTools for debugging
- Inspect elements and styles
- Use Network tab to check requests
- Use Console for errors and logging

### VS Code Debugging

1. **Install Debugger:**
   - Install "Debugger for Chrome" extension

2. **Create launch config:**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Next.js: debug full stack",
         "type": "chrome",
         "request": "attach",
         "port": 3000,
         "pathMapping": {
           "/": "${workspaceRoot}",
           "/_next": "${workspaceRoot}/.next"
         }
       }
     ]
   }
   ```

### Performance Profiling

```bash
# Run with profiling
NODE_OPTIONS='--inspect' npm run dev

# Open chrome://inspect in Chrome
```

## Best Practices

### TypeScript

- Always define types for props and returns
- Use `type` instead of `interface` for unions
- Avoid `any` - use `unknown` and narrow types
- Enable strict mode in `tsconfig.json`

### React

- Prefer functional components
- Use hooks for state and effects
- Minimize re-renders with `memo`, `useMemo`, `useCallback`
- Use server components when possible
- Avoid prop drilling - use Context

### Performance

- Lazy load large components
- Optimize images with Next.js Image component
- Use dynamic imports for code splitting
- Monitor bundle size

### Security

- Never log sensitive data
- Validate all user inputs
- Use environment variables for secrets
- Sanitize user-generated content
- Keep dependencies updated

### Testing

- Write tests for critical paths
- Test user interactions, not implementation
- Use meaningful test descriptions
- Aim for high coverage but focus on important parts

## Deployment

### Local Build

```bash
npm run build
npm start
```

### Vercel (Recommended)

Connect repository to Vercel for automatic deployments.

### Docker

```bash
docker build -t afaq .
docker run -p 3000:3000 afaq
```

## Troubleshooting

### Port Already in Use

```bash
npm run dev -- -p 3001
```

### Module Not Found

```bash
rm -rf node_modules
npm install
npm run build
```

### Build Fails

```bash
npm run lint
npm run type-check
npm run build
```

### Slow Development

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Playwright Testing](https://playwright.dev)

## Support

Questions? Check:
1. This documentation
2. Official framework docs
3. GitHub issues
4. Team Slack channel
