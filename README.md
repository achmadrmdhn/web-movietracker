# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Environment variables (local development)

Create a `.env` file in the project root with the following example values:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
# (Optional) Supabase (for backend storage):
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

Set the `VITE_TMDB_API_KEY` in Vercel environment variables when deploying the frontend.

### Local setup

1. Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

2. Fill in the values from your TMDB account and Supabase project (Project URL + Anon Key).

3. Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

### Vercel / Production

- In Vercel dashboard go to your Project → Settings → Environment Variables.
- Add the following keys (exact names):
  - `VITE_TMDB_API_KEY`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Do not commit `.env` or any secret file. Keep secrets only in Vercel and your local `.env`.
- This project includes [vercel.json](vercel.json) so client-side routes like `/movies/123` resolve correctly.

Notes:

- Never expose the Supabase Service Role Key in the frontend. Use the Service Role Key only in secure server-side code (serverless functions or Supabase Edge Functions).
- For extra security (to protect TMDB or Supabase service keys), create serverless/proxy endpoints and store privileged keys as server-only environment variables.

### Accessing variables in code

Use `import.meta.env.VITE_TMDB_API_KEY`, `import.meta.env.VITE_SUPABASE_URL`, and `import.meta.env.VITE_SUPABASE_ANON_KEY` in the app (already used in `src/lib/supabase.ts` and `src/services/tmdbService.ts`).

### Creating `movies` table (Supabase)

Open Supabase dashboard → SQL Editor and run the SQL in `sql/supabase_movies.sql` (or paste the contents into a new query). That file creates the `movies` table and inserts two example rows.

File: [sql/supabase_movies.sql](sql/supabase_movies.sql)

If your `VITE_SUPABASE_URL` in `.env` contains `/rest/v1/`, remove that suffix — the client expects the project base URL (e.g. `https://your-ref.supabase.co`).
