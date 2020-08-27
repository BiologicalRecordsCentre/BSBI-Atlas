// Based on example: https://github.com/rollup/rollup-starter-lib
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

export default [
	// browser-friendly UMD build
	// Wont bother with min since CDN can deliver than from this file
  {
		external: ['d3'],
		input: 'index.js',
		output: {
			globals: {
				'd3': 'd3'
			},
			name: 'bsbiatlas',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find node libs
			babel({ babelHelpers: 'bundled', presets: ['@babel/preset-env'] }),
			json(), // required to import package into index.js
		]
  }
]