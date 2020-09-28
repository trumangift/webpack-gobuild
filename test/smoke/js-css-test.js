const assert = require('assert');
const glob = require('glob');
const path = require('path');

describe('CSS File detect', function () {
    describe('#css file exists', function () {
        it('should return 2 when the css file exist', function (done) {
            const cssFiles = glob.sync(path.join(__dirname, './template/dist/*.css'));
            if (cssFiles.length === 2) {
                done();
            } else {
                throw new Error(cssFiles.length +' css file generated');
            }
        });
    });
    describe('#js file exists', function () {
        it('should return 2 when the js file exist', function (done) {
            const jsFiles = glob.sync(path.join(__dirname, './template/dist/*.js'));
            if (jsFiles.length === 2) {
                done();
            } else {
                throw new Error(jsFiles.length +' js file generated');
            }
        });
    });
});
