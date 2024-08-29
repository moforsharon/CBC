// const createExpoWebpackConfigAsync = require('@expo/webpack-config');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const path = require('path');

// module.exports = async function(env, argv) {
//   const config = await createExpoWebpackConfigAsync(env, argv);

//   // Ensure only one instance of HtmlWebpackPlugin
//   config.plugins = config.plugins.filter(
//     plugin => !(plugin instanceof HtmlWebpackPlugin)
//   );

//   config.plugins.push(
//     new HtmlWebpackPlugin({
//       template: './src/index.html',
//       filename: 'index.html',
//       inject: 'body',
//       meta: {
//         viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
//         description: 'Child Behavior Check-in',
//       },
//       link: [
//         { rel: 'manifest', href: '/manifest.json' },
//         { rel: 'icon', href: '/assets/favicon.png', sizes: '192x192' },
//         { rel: 'icon', href: '/assets/favicon.png', sizes: '512x512' }
//       ]
//     }),
//     new CopyWebpackPlugin({
//       patterns: [
//         { from: path.resolve(__dirname, 'manifest.json'), to: config.output.path },
//         { from: path.resolve(__dirname, 'service-worker.js'), to: config.output.path },
//         { from: path.resolve(__dirname, 'assets'), to: path.join(config.output.path, 'assets') }
//       ]
//     })
//   );

//   return config;
// };
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

  // Add resolve.fallback configuration for Node.js core modules
  config.resolve = {
    ...config.resolve, // Ensure we keep any existing resolve configuration
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
    },
  };

  // // Add polyfills for Node.js globals if needed
  // config.plugins.push(
  //   new webpack.ProvidePlugin({
  //     process: 'process/browser',
  //     Buffer: ['buffer', 'Buffer'],
  //   })
  // );

  return config;
};
