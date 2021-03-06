import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';
import strip from '@rollup/plugin-strip';

const pkg = JSON.parse(fs.readFileSync('package.json'));
const banner = `/*!
 * Mini Tokyo 3D v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} license
 */`;
const extraReplacement = process.env.SECRETS ? {
	secrets: process.env.SECRETS
} : {};

export default [{
	input: 'src/loader/index.js',
	output: {
		name: 'loader',
		file: 'dist/loader.js',
		format: 'cjs',
		indent: false,
		sourcemap: true
	},
	plugins: [
		resolve(),
		commonjs()
	]
}, {
	input: 'src/index.js',
	output: {
		name: 'mini-tokyo-3d',
		file: 'dist/mini-tokyo-3d.js',
		format: 'umd',
		indent: false,
		sourcemap: true,
		banner
	},
	plugins: [
		resolve(),
		commonjs({
			namedExports: {
				'probe.gl/env': ['global', 'isBrowser', 'getBrowser']
			}
		}),
		replace(Object.assign({
			'process.env.NODE_ENV': '\'development\''
		}, extraReplacement))
	]
}, {
	input: 'src/index.js',
	output: {
		name: 'mini-tokyo-3d',
		file: 'dist/mini-tokyo-3d.min.js',
		format: 'umd',
		indent: false,
		sourcemap: true,
		banner
	},
	plugins: [
		resolve(),
		commonjs({
			namedExports: {
				'probe.gl/env': ['global', 'isBrowser', 'getBrowser']
			}
		}),
		replace(Object.assign({
			'process.env.NODE_ENV': '\'production\''
		}, extraReplacement)),
		terser({
			compress: {
				pure_getters: true,
				passes: 3
			}
		}),
		strip({
			sourceMap: true
		})
	]
}];
