/**
 * Static-export build.
 *
 * A three-line wrapper instead of a `cross-env` dependency: setting an
 * environment variable inline (`NEXT_OUTPUT=export next build`) is POSIX shell
 * syntax and fails on Windows `cmd` and PowerShell, and this project is
 * developed on Windows.
 *
 * Output lands in `out/`. See DEPLOYMENT.md before choosing this over a
 * Node-capable host.
 */
import { spawnSync } from 'node:child_process';

const result = spawnSync('next', ['build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NEXT_OUTPUT: 'export' },
});

process.exit(result.status ?? 1);
