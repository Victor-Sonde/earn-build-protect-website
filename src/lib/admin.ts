/**
 * The content editor is reachable only where it is authenticated or private:
 *  - on your own machine during development, or
 *  - in production when GitHub mode is configured, where every editor must sign in with GitHub
 *    and needs write access to the repository.
 * In any other case the editor and its API return "not found".
 */
export const adminEnabled =
  process.env.NODE_ENV !== 'production' || Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO);
