const assert = require('assert');
describe('webpack base config test', () => {
    const baseConfig = require('../../lib/webpack.base');
    it('entry', () => {
        assert.equal(baseConfig.entry.login, '/Users/liuminghai/Documents/webpacktest/builder-webpack/test/smoke/template/src/login/index.js');
    });
});
