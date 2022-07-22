const path = require('path');
const NodePolyfillWebpackPlugin = require('node-polyfill-webpack-plugin');

const browserConfig = {
  entry: './index.ts',
  plugins: [
    new NodePolyfillWebpackPlugin(),
  ],
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: './tsconfig.json',
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      fs: false,
    },
  },
  output: {
    filename: 'projections.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'Projections',
      type: 'umd',
    },
  },
  devtool: 'source-map',
  mode: 'production',
};

module.exports = [browserConfig];
