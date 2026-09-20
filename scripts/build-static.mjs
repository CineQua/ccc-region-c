/**
 * Static-export build.
 *
 * A small wrapper instead of a `cross-env` dependency: setting an environment
 * variable inline (`NEXT_OUTPUT=export next build`) is POSIX shell syntax and
 * fails on Windows `cmd` and PowerShell, and this project is developed on
 * Windows.
 *
 * Output lands in `out/`. See DEPLOYMENT.md before choosing this over a
 * Node-capable host.
 *
 * `app/api/` is set aside for the duration of the build. `output: 'export'`
 * rejects any route that reads its request, and the one route there —
 * the calendar refresh endpoint — is meaningless in a static export anyway,
 * because a static export has no cache to revalidate. Renaming the folder with
 * a leading underscore makes Next treat it as private and non-routable; it is
 * restored in a `finally`, and any copy stranded by a hard kill is restored on
 * the next run.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const routable = join(root, 'app', 'api');
const setAside = join(root, 'app', '_api');

/** Undo a set-aside left behind by an interrupted run. */
function restore() {
  if (existsSync(setAside) && !existsSync(routable)) {
    renameSync(setAside, routable);
  }
}

restore();

let status = 1;

try {
  if (existsSync(routable)) {
    renameSync(routable, setAside);
  }

  const result = spawnSync('next', ['build'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NEXT_OUTPUT: 'export' },
  });

  status = result.status ?? 1;
} finally {
  restore();
}

process.exit(status);
