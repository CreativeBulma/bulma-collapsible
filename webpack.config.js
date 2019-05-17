const pkg = require('./package.json');
const camelCase = require('camelcase');
const TerserPlugin = require('terser-webpack-plugin');

const pkgName = pkg.name.split('/');
const packageName = pkgName[pkgName.length - 1];

module.exports = {
	mode: 'production',
	entry: {
		app: './src/js/index.js'
	},
	output: {
		filename: packageName + '.min.js',
		library: camelCase(packageName),
		libraryTarget: 'umd',
		libraryExport: 'default'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader'
			},
			{
				test: /(\.scss|\.sass)$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'sass-loader'
				}]
			}
		]
	},
	optimization: {
		minimizer: [new TerserPlugin({
			sourceMap: false,
			terserOptions: {
				compress: true,
				keep_fnames: true,
				ie8: false,
				mangle: true,
				output: {
					comments: false,
				},
			}
		})],
	}
};