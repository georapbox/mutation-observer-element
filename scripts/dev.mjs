import { copyFile, mkdir } from 'node:fs/promises';
import { styleText } from 'node:util';
import * as esbuild from 'esbuild';

const ctx = await esbuild.context({
  entryPoints: ['src/mutation-observer.js'],
  bundle: true,
  sourcemap: true,
  format: 'esm',
  outdir: 'dist',
  metafile: true,
  plugins: [
    {
      name: 'rebuild-notify',
      setup(build) {
        let startTime;

        build.onStart(() => {
          startTime = performance.now();
        });

        build.onEnd(result => {
          const duration = Math.round(performance.now() - startTime);
          const errors = result.errors.length;
          const warnings = result.warnings.length;
          const status = styleText(errors ? 'red' : 'green', errors ? 'Build failed' : 'Build succeeded');
          const time = styleText('cyan', `in ${duration}ms`);
          const issues = styleText(warnings ? 'yellow' : 'gray', `(${errors} errors, ${warnings} warnings)`);

          console.log(`[esbuild] ${status} ${time} ${issues}`);
        });
      }
    }
  ]
});

await mkdir('dist', { recursive: true });
await copyFile('src/mutation-observer-defined.js', 'dist/mutation-observer-defined.js');
await ctx.watch();
