var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var jsonImporter = require('node-sass-json-importer');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.s[ac]ss$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            importer: jsonImporter()
          }
        }
      ]
    }, {
      test: /\.pug$/,
      use: ["pug-loader"]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.pug'} ),
    new CopyWebpackPlugin([{ from: 'static' }])
  ]
};
