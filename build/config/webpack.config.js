const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: __dirname + '../../../server/server.ts',
  output: {
    path: __dirname + '../../../dist',
    filename: 'server.js',
  },
  resolve: {
    extensions: [ '.webpack.js', '.web.js', '.ts', '.tsx', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: __dirname + '/tsconfig.json'
            }
          }
        ]
      }
    ]
  },
  target: 'node',
  externals: [
    nodeExternals()
  ]
};
