const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ensure only one instance of HtmlWebpackPlugin
  config.plugins = config.plugins.filter(
    plugin => !(plugin instanceof HtmlWebpackPlugin)
  );

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        description: 'Child Behavior Check-in',
      },
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'icon', href: '/assets/favicon.png', sizes: '192x192' },
        { rel: 'icon', href: '/assets/favicon.png', sizes: '512x512' }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'manifest.json'), to: config.output.path },
        { from: path.resolve(__dirname, 'service-worker.js'), to: config.output.path },
        { from: path.resolve(__dirname, 'assets'), to: path.join(config.output.path, 'assets') }
      ]
    })
  );

  return config;
};
