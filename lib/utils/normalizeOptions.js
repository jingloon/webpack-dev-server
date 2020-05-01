'use strict';

/* eslint-disable
  no-undefined
*/

function normalizeOptions(compiler, options) {
  // Setup default value
  options.contentBase =
    options.contentBase !== undefined ? options.contentBase : process.cwd();
  options.contentBasePublicPath = options.contentBasePublicPath || '/';
  options.hot =
    typeof options.hot === 'boolean' || options.hot === 'only'
      ? options.hot
      : true;
  options.serveIndex =
    options.serveIndex !== undefined ? options.serveIndex : true;
  options.watchOptions = options.watchOptions || {};
  options.stats =
    options.stats && Object.keys(options.stats).length !== 0
      ? options.stats
      : {};
  options.sockPath = `/${
    options.sockPath ? options.sockPath.replace(/^\/|\/$/g, '') : 'sockjs-node'
  }`;

  // normalize transportMode option
  if (options.transportMode === undefined) {
    options.transportMode = {
      server: 'sockjs',
      client: 'sockjs',
    };
  } else {
    switch (typeof options.transportMode) {
      case 'string':
        options.transportMode = {
          server: options.transportMode,
          client: options.transportMode,
        };
        break;
      // if not a string, it is an object
      default:
        options.transportMode.server = options.transportMode.server || 'sockjs';
        options.transportMode.client = options.transportMode.client || 'sockjs';
    }
  }
}

module.exports = normalizeOptions;
