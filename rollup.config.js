import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

const makeRollupConfig = (globalObjectName, inputFile, outputFile) => {
	const config = {
		input: inputFile,
		output: {
			file: outputFile,
			format: 'umd',
			name: globalObjectName,
			sourcemap: true,
		},
		plugins: [
			resolve(),
			commonjs(),
			babel(),
		],
	};

	if (outputFile.includes('.min.')) {
		config.plugins.push(terser());
	}

	return config;
};

export default [
	makeRollupConfig('Implosion', 'src/implosion.js', 'dist/implosion.js'),
	makeRollupConfig('Implosion', 'src/implosion.js', 'dist/implosion.min.js'),
];
