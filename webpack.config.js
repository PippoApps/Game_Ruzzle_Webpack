const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',

	output: {
		clean: true,
	},

	devServer: {
		watchFiles: ['src/*.html'],
	},

	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
				options: {
					sources: false,
				},
			},
			{
				test: /\.css$/i,
				exclude: /styles.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /styles.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
		],
	},

	optimization: {},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Webpack Initial Config',
			template: './src/index.html',
		}),
		new MiniCssExtractPlugin({
			filename: 'styles/[name].css',
			ignoreOrder: false,
		}),
		new CopyPlugin({
			patterns: [{ from: 'src/assets', to: 'assets/' }],
		}),
	],



};
