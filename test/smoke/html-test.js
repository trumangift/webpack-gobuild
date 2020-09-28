const assert = require('assert');
const glob = require('glob');
const path = require('path');

describe('HTML FILE', function () {
    describe('#html file exists', function () {
        it('should return 2 when the html file exist', function () {
            const htmlFiles = glob.sync(path.join(__dirname, './template/dist/*.html'));
            assert.equal(htmlFiles.length, 2);
        });
    });
});
