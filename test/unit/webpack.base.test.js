const assert = require('assert');
describe('webpack base config test', () => {
    const baseConfig = require('../../lib/webpack.base');
    it('entry', () => {
        assert.equal(baseConfig.entry.login.indexOf('/test/smoke/template/src/login/index.js') > 0, true);
    });
});
