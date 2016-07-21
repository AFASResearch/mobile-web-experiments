var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
  entry: {
    app: [
      "./src/main.ts"
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js"
  },

  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js', '.css'],
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./src/styles")]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Mobile Web Experiments',
      template: 'index.ejs'
    }),
    new CopyWebpackPlugin([
      // {output}/file.txt 
      { from: 'public' }
    ]),
    new SWPrecacheWebpackPlugin({
      cacheId: "mobile-web-experiments",
      dynamicUrlToDependencies: {
        '/': ['index.ejs'],
        '/index.html': ['index.ejs']
      }
    })
  ],
  devServer: {
    contentBase: './public'
  }
};
