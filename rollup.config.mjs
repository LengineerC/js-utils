import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';

export default {
  input: 'src/index.ts',
  external: [],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: 'dist/types',
          importHelpers: false,
          module: 'ESNext',
          moduleResolution: 'Node',
        }
      }
    }),
    terser(),
    cleanup(),
  ],
  output: [
    {
      file: 'dist/bundle.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/bundle.umd.js',
      format: 'umd',
      name: 'LCUtils',
      sourcemap: true
    }
  ],
};
