/**
 * Guard against case-mismatched local imports.
 *
 * This project is developed on Windows (case-insensitive filesystem) and built
 * on Linux (case-sensitive). An import written as `@/components/ui/Button` when
 * the file is `button.tsx` compiles perfectly on a developer machine and fails
 * the production build on Vercel. TypeScript's `forceConsistentCasingInFileNames`
 * catches mismatches between two spellings used in the same project, but not a
 * single consistently-wrong spelling.
 *
 * Walks every local import (`@/…` and relative) and compares the resolved path
 * against the real on-disk casing, component by component.
 *
 * Run via `npm run check:case`, and as part of `npm run check`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve as resolvePath, sep } from 'node:path';

const root = process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'out', '.vercel']);
const EXTENSIONS = ['', '.ts', '.tsx', '.css', '/index.ts', '/index.tsx'];
const IMPORT_RE = /(?:from|import)\s+['"]([^'"]+)['"]/g;

/** Every .ts/.tsx file in the project, excluding build output. */
function sourceFiles(dir = root, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) sourceFiles(join(dir, entry.name), found);
    } else if (/\.tsx?$/.test(entry.name)) {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

/** Resolve an import specifier to a real file, or null if it is a package. */
function resolveSpecifier(spec, fromFile) {
  let base;
  if (spec.startsWith('@/')) base = join(root, spec.slice(2));
  else if (spec.startsWith('.')) base = resolvePath(dirname(fromFile), spec);
  else return null;

  for (const ext of EXTENSIONS) {
    const candidate = base + ext;
    try {
      statSync(candidate);
      return candidate;
    } catch {
      // Try the next extension.
    }
  }
  return false;
}

/** The same path as the filesystem actually spells it, or null if absent. */
function actualCasing(path) {
  let current = root;
  for (const part of relative(root, path).split(sep)) {
    const match = readdirSync(current).find((e) => e.toLowerCase() === part.toLowerCase());
    if (!match) return null;
    current = join(current, match);
  }
  return current;
}

const problems = [];
let checked = 0;

for (const file of sourceFiles()) {
  const source = readFileSync(file, 'utf8');
  for (const [, spec] of source.matchAll(IMPORT_RE)) {
    if (!spec.startsWith('@/') && !spec.startsWith('.')) continue;
    checked += 1;

    const resolved = resolveSpecifier(spec, file);
    if (resolved === null) continue;

    const where = relative(root, file);
    if (resolved === false) {
      problems.push(`${where}: cannot resolve "${spec}"`);
      continue;
    }

    const truth = actualCasing(resolved);
    if (truth === null) {
      problems.push(`${where}: "${spec}" not found on disk`);
    } else if (truth !== resolved) {
      problems.push(`${where}: "${spec}" is really ${relative(root, truth)}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`Import case check FAILED (${problems.length} of ${checked}):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('\nThese build on Windows/macOS but fail on Linux (Vercel).');
  process.exit(1);
}

console.log(`Import case check passed - ${checked} local imports resolve with exact case.`);
