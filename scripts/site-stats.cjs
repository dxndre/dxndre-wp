const { execFileSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const metadata = { builtAt: new Date().toISOString() };
try {
	const count = execFileSync('git', ['rev-list', '--count', 'HEAD'], {
		cwd: root,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'ignore'],
	}).trim();
	if (/^\d+$/.test(count)) metadata.commits = Number(count);
} catch {
	// Deployment archives can be built without Git history.
}
mkdirSync(path.join(root, 'build'), { recursive: true });
writeFileSync(path.join(root, 'build', 'site-stats.json'), JSON.stringify(metadata, null, 2) + '\n');
