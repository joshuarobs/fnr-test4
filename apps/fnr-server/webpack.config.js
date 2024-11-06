const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  return {
    ...config,
    target: 'node',
    output: {
      ...config.output,
      filename: 'main.js',
      path: __dirname + '/../../dist/apps/fnr-server'
    },
    optimization: {
      minimize: false
    }
  };
});
