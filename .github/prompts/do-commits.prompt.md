Great! Now let's commit these changes in thematic groups with short messages that follow the repo's semantic conventions.

## Commit Message Convention

Use the format: `type(scope): message`

**Types:**

- `feat`: New feature or component
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `build`: Changes to build system or dependencies (package.json, tsconfig, etc.)
- `chore`: Maintenance tasks (lockfile updates, etc.)
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `style`: Code style changes (formatting, semicolons, etc.)

**Scope Examples:**

- Apps: `otp-worker`
- Libs: `gleap-api-client`
- Lib domains: `auth`, `billing`, `tickets`, `sessions`, `users`, `organisations`, etc.
- Tools/config: `tsconfig`, `wrangler`, `tsup`, `vitest`, `deps`, etc.

**Message Guidelines:**

- Use imperative mood ("add" not "added", "migrate" not "migrated")
- Keep under 72 characters
- Be specific but concise
- No period at the end

**Grouping Strategy:**

1. **Feature additions** - New components/files created
2. **Refactors/Updates** - Exports, imports, structural changes
3. **Build changes** - Dependencies, package.json, build config
4. **Lockfile** - Always separate commit for pnpm-lock.yaml
5. **Documentation** - README, migration docs, comments

**Examples:**

```
feat(gleap-api-client): add web-crawler endpoint
refactor(otp-worker): simplify OTP validation logic
build(gleap-api-client): upgrade axios dependency
chore(deps): update pnpm lockfile for new dependencies
docs(gleap-api-client): document auth-flow endpoint
```
