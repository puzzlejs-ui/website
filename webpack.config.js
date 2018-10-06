const isProd = process.env.NODE_ENV === 'production';

const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssExtractTextPlugin = new ExtractTextPlugin({
	filename :  'static/styles/[name].css'
});

const htmlExtractTextPlugin = new ExtractTextPlugin({
	filename:  (getPath) => {
		return getPath('[name].html').replace('home.html', 'index.html');
	},
});

module.exports = {
	entry     : {
		/* Pages */
		'home' : path.resolve(__dirname, 'src/scripts/pages/home.js'),
		'docs' : path.resolve(__dirname, 'src/scripts/pages/docs.js'),
		/* Common */
		'common' : path.resolve(__dirname, 'src/scripts/common/index.js')
	},
	output    : {
		path     : path.resolve(__dirname, 'docs/'),
		filename : 'static/scripts/[name].js'
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
					use      : ['css-loader', 'sass-loader']	
				})
			}, {
				test : /\.pug$/,
				use  : htmlExtractTextPlugin.extract({
					use : ['html-loader?interpolate', 'pug-html-loader']
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
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					output: {
						comments: false
					}
				}
			})
		]
	},
	plugins: [
		cssExtractTextPlugin,
		htmlExtractTextPlugin,
	],
	mode      : process.env.NODE_ENV,
    devtool   : isProd ? '' : 'source-map',
	profile   : true,
};