'use strict';

const webpack = require('webpack');
const Server = require('../../lib/Server');
const config = require('../fixtures/simple-config/webpack.config');
const port = require('../ports-map')['stats-option'];

describe('stats option', () => {
  it(`should works with difference stats values (contains 'hash', 'assets', 'warnings' and 'errors')`, async () => {
    const allStats = [
      {},
      // eslint-disable-next-line no-undefined
      undefined,
      false,
      'errors-only',
      {
        assets: false,
      },
    ];

    for (const stats of allStats) {
      const compiler = webpack(config);
      const server = new Server(compiler, { stats, port, logLevel: 'silent' });

      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        compiler.hooks.done.tap('webpack-dev-server', (s) => {
          expect(Object.keys(server.getStats(s)).sort()).toMatchSnapshot();

          server.close(resolve);
        });

        compiler.run(() => {});
        server.listen(port, 'localhost');
      });
    }
  });

  it('should respect warningsFilter', (done) => {
    const compiler = webpack(config);
    const server = new Server(compiler, {
      stats: { warningsFilter: 'test' },
      port,
      logLevel: 'silent',
    });

    compiler.hooks.done.tap('webpack-dev-server', (s) => {
      s.compilation.warnings = ['test', 'another warning'];

      const output = server.getStats(s);

      expect(output.warnings.length).toBe(1);

      // Webpack@4
      if (typeof output.warnings[0] === 'string') {
        expect(output.warnings[0]).toBe('another warning');
      }
      // Webpack@5
      else {
        expect(output.warnings[0]).toEqual({ message: 'another warning' });
      }

      server.close(done);
    });

    compiler.run(() => {});
    server.listen(port, 'localhost');
  });
});
