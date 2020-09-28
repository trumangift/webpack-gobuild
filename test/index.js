const path = require('path');
process.chdir(path.join(__dirname, 'smoke/template'));

describe('webpack-base-construct-react unit test start', () => {
    require('./unit/webpack.base.test');
});
