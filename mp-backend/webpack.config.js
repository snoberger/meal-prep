const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: slsw.lib.entries,
    output: {
      libraryTarget: 'commonjs2',
      path: path.resolve(__dirname, '.webpack'),
      filename: '[name].js'
    },
    mode: 'development',
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          // Include ts, tsx, js, and jsx files.
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.resolve('.webpackCache')
              }
            },
            {
              loader: 'babel-loader',
              options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['transform-class-properties']
              }
            },
          ]
        }
      ]
    },
  };