var webpack = require('webpack');
var path = require('path');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var APP_DIR = path.resolve(__dirname, 'src/app');
	
var config = {
  entry: APP_DIR + '/main.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  devServer: {
      inline: true,
      port: 8089
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
		    exclude: /node_modules/,
        include : APP_DIR,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['es2015', 'react']
            }
          }
        ]        
      }
    ]
  },
  plugins: [
    new WebpackCleanupPlugin()
  ]
};

module.exports = config;