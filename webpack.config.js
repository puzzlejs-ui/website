const isProd = process.env.NODE_ENV === 'production';
const minPrefix = isProd ? '.min' : '';

const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CssNano = require('cssnano');

const cssExtractTextPlugin = new ExtractTextPlugin({
	filename :  'static/styles/[name]' + minPrefix + '.css'
});

const htmlExtractTextPlugin = new ExtractTextPlugin({
	filename : (getPath) => {
		const name = getPath('[name]')
		const paths = {
			'home'       : 'index.html',
			'components' : 'installation/index.html',
			'draggable'  : 'components/draggable/index.html'
		};
		return (paths[name] || name + '.html');
	}
});

module.exports = {
	entry     : {
		/* Pages */
		'home'       : path.resolve(__dirname, 'src/scripts/pages/home.js'),
		'404'        : path.resolve(__dirname, 'src/scripts/pages/404.js'),
		'components' : path.resolve(__dirname, 'src/scripts/pages/components.js'),
		'draggable'  : path.resolve(__dirname, 'src/scripts/pages/draggable.js'),
		/* Common */
		'common' : path.resolve(__dirname, 'src/scripts/common/index.js')
	},
	output    : {
		path     : path.resolve(__dirname, 'docs/'),
		filename : 'static/scripts/[name]' + minPrefix + '.js'
	},
	resolve   : {
		alias     : {
			'@templates' : path.resolve(__dirname, 'src/templates'),
			'@scripts'   : path.resolve(__dirname, 'src/scripts/'),
			'@styles'    : path.resolve(__dirname, 'src/styles/')
		}
	},
	module    : {
		rules : [
			{
				test : /\.scss$/,
				use  : cssExtractTextPlugin.extract({
					fallback : 'style-loader',
					use : [
						{loader : 'css-loader'},
						{loader : 'postcss-loader',
							options: {
								plugins : !isProd ? [] : [
									CssNano({ autoprefixer : true, safe : true })
								]
							}
						},
						{loader : 'sass-loader'}
					]
				})
			}, {
				test : /\.pug$/,
				use  : htmlExtractTextPlugin.extract({
					use : [
						{loader : 'html-loader', options : {interpolate : true}},
						{loader : 'pug-html-loader', options : {data : {isProd : isProd, version: Date.now()}}}
					]
				})
			}, {
				test    : /\.js$/,
				exclude : /(node_modules)/,
				use     : {
					loader: "babel-loader"
				}
			}, {
				test: /\.(png|jpg|gif|svg)$/,
				use: [
				  {
					loader: 'file-loader',
					options: {
						name       : '[name].[ext]',
						outputPath : 'static/assets/',
						publicPath : '/static/assets'
					}
				  }
				]
			  }
		]
	},
	optimization : !isProd ? {} : {
		minimize  : true,
		minimizer : [
			new TerserPlugin({
				terserOptions: {
					compress: true,
					output: {
						comments: false,
						beautify: false
					}
				}
			})
		]
	},
	plugins: [
		cssExtractTextPlugin,
		htmlExtractTextPlugin
	],
	mode      : process.env.NODE_ENV,
    devtool   : isProd ? '' : 'inline-source-map',
	profile   : true,
};