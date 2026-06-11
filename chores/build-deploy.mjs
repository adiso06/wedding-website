// Builds the deployable single-file pages in ../public/chores/:
// inlines the page CSS into <style> and db.js + the page module
// (module plumbing stripped) into one <script type="module">.
//
// Usage: node build-deploy.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'public', 'chores');

const db = readFileSync(join(here, 'db.js'), 'utf8')
    .replace(/^export /gm, '');

function buildPage({ htmlFile, cssFile, jsFile }) {
    const html = readFileSync(join(here, htmlFile), 'utf8');
    const css = readFileSync(join(here, cssFile), 'utf8');
    const js = readFileSync(join(here, jsFile), 'utf8')
        .replace(/^import \{[\s\S]*?\} from '\.\/db\.js';\n/, '');

    const built = html
        .replace(
            `<link rel="stylesheet" href="${cssFile}">`,
            '<style>\n' + css + '\n    </style>'
        )
        .replace(
            `<script type="module" src="${jsFile}"></script>`,
            '<script type="module">\n' + db + '\n' + js + '\n    </script>'
        );

    if (built === html || built.includes(`src="${jsFile}"`)) {
        throw new Error(`replacements did not apply for ${htmlFile}`);
    }
    const out = join(outDir, htmlFile);
    writeFileSync(out, built);
    console.log('wrote', out, '(' + built.length + ' bytes)');
}

buildPage({ htmlFile: 'index.html', cssFile: 'styles.css', jsFile: 'app.js' });
buildPage({ htmlFile: 'stats.html', cssFile: 'stats.css', jsFile: 'stats.js' });
