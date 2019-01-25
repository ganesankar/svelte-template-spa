import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss'
import cleaner from 'rollup-plugin-cleaner'
import html from 'rollup-plugin-fill-html';
import path from 'path'
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import assetSync from 'rollup-plugin-asset-sync';

const production = !process.env.ROLLUP_WATCH;

const buildDir = production ? 'dist' : '.dev';

export default {
	input: path.join(__dirname,'src','main.js'),
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'myapp',
		file: path.join(__dirname,buildDir,'bundle.js') 
	},
	plugins: [
		assetSync({
            input: path.join(__dirname,'src','assets'),
            output: path.join(__dirname,buildDir,'assets')
        }),
		scss({
			output: path.join(__dirname,buildDir,'bundle.css'),
			outputStyle: production ? 'compressed' : 'expanded'
		}),
		svelte({
			skipIntroByDefault: true,
			nestedTransitions: true,
			dev: !production,
			emitCss: true,
			preprocess: require('svelte-preprocess')({ 
				transformers: {
					scss: true,
				}
			})
		}),
		html({
			template: path.join(__dirname,'src','index.html'),
			filename: 'index.html'
		}),
		resolve(),
		commonjs(),
		(production && terser()),
		(!production && serve({
			contentBase: path.join(__dirname, buildDir),
			historyApiFallback: true,
			host: 'localhost',
			port: 8080,
		})),
		(!production && livereload({
			watch:path.join(__dirname, buildDir)
		}))	  
	]
};
