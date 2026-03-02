const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function build() {
  try {
    if (fs.existsSync('extension-build')) {
      fs.rmSync('extension-build', { recursive: true });
    }
    fs.mkdirSync('extension-build', { recursive: true });

    const ctx = await esbuild.context({
      entryPoints: {
        'background': 'src/ts/background.ts',
        'focus': 'src/ts/focus/focus.ts',
        'popup': 'src/popup/popup.ts',
      },
      bundle: true,
      outdir: 'extension-build',
      sourcemap: true,
      platform: 'browser',
      target: ['chrome58', 'firefox57', 'safari11'],
      loader: {
        '.ts': 'ts',
      },
      define: {
        'process.env.NODE_ENV': isWatch ? '"development"' : '"production"'
      }
    });

    if (fs.existsSync('src/html')) {
      copyRecursive('src/html', 'extension-build/html');
    }
    copyRecursive('src/icons', 'extension-build/icons');
    if (fs.existsSync('src/css')) {
      copyRecursive('src/css', 'extension-build/css');
    }
    
    if (!fs.existsSync('extension-build/popup')) {
      fs.mkdirSync('extension-build/popup');
    }
    fs.copyFileSync('src/popup/popup.html', 'extension-build/popup/popup.html');
    fs.copyFileSync('src/popup/popup.css', 'extension-build/popup/popup.css');
    
    fs.copyFileSync('src/manifest.json', 'extension-build/manifest.json');

    if (isWatch) {
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      await ctx.rebuild();
      await ctx.dispose();
      console.log('Build complete');
    }
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
