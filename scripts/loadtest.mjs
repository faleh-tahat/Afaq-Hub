// Load test for LOCAL or STAGING only.
//
//   npm run build && npm start            # in one terminal
//   node scripts/loadtest.mjs             # defaults to http://localhost:3000
//   node scripts/loadtest.mjs http://localhost:3101 --connections 100 --duration 20
//
// Production hosts are refused. Staging must be allow-listed explicitly with
// LOADTEST_ALLOW_HOST=staging.example.com, so a typo cannot hit the live site.
// autocannon runs through npx and is not a project dependency.
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const base = new URL(args.find((a) => !a.startsWith('--')) || 'http://localhost:3000');
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const LOCAL = new Set(['localhost', '127.0.0.1', '[::1]']);
if (!LOCAL.has(base.hostname) && base.hostname !== process.env.LOADTEST_ALLOW_HOST) {
  console.error(`Refusing to load-test ${base.hostname}. Only localhost or LOADTEST_ALLOW_HOST.`);
  process.exit(1);
}
if (/(^|\.)afaq-team\.com$/.test(base.hostname)) {
  console.error('Refusing to load-test the production domain.');
  process.exit(1);
}

const connections = opt('connections', '50');
const duration = opt('duration', '10');
const targets = ['/', '/about', '/gallery', '/api/health', '/_next/image?url=%2Fhero-team.jpeg&w=640&q=75'];

const rows = [];
for (const path of targets) {
  const url = new URL(path, base).toString();
  const cmdArgs = ['--yes', 'autocannon@8', '-j', '-c', connections, '-d', duration, '-H', 'Accept-Encoding: gzip', url];
  // npx is a .cmd shim on Windows and needs a shell there; quote every argument
  // so '&' in URLs and spaces in headers survive cmd.exe.
  const win = process.platform === 'win32';
  const run = spawnSync(win ? 'npx.cmd' : 'npx', win ? cmdArgs.map((a) => `"${a}"`) : cmdArgs, {
    encoding: 'utf8',
    shell: win,
    maxBuffer: 64 * 1024 * 1024,
  });
  const json = run.stdout.slice(run.stdout.indexOf('{'));
  const r = JSON.parse(json);
  rows.push({
    path,
    'req/s': Math.round(r.requests.average),
    'p50 ms': r.latency.p50,
    'p99 ms': r.latency.p99,
    '2xx': r['2xx'],
    non2xx: r.non2xx,
    errors: r.errors + r.timeouts,
  });
}
console.table(rows);
