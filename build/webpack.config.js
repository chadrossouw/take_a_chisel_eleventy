
const path = require('path');
module.exports =  {
	entry: './src/js/scripts.js',
	resolve: {
		modules: [path.resolve(__dirname, 'src/scripts'), 'node_modules'],
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
	output: {
		path: path.resolve(__dirname, './src/js/'),
		filename: 'main.js',
	},
};
