var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');

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
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js', '.css']
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
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&sourceMap!postcss-loader'
      }
    ]
  },
  postcss: function() {
    return [autoprefixer({browsers: ['iOS 8', 'last 1 version']})];
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Mobile Web Experiments',
      template: 'index.ejs'
    }),
    new CopyWebpackPlugin([
      // {output}/file.txt 
      { from: 'public' }
    ])
  ],
  devServer: {
    contentBase: './public'
  }
};
