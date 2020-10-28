const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const yargs = require('yargs');

const envs = ['pro', 'dev'];
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '3000ms',
});

// console.log(argv.env);
// if (envs.indexOf(argv.env) < 0) {
//   console.error('请加上正确的参数 --env=pro 或者 --env=dev');
//   return;
// }

const { argv } = yargs
  .alias('e', 'env')
  .demandOption(['e'], 'e 必须填写 --env=pro|dev 或者 -e=pro|dev')
if (!argv.env) {
  console.error('env参数不能为空');
  return;
}
process.chdir(path.join(__dirname, 'template'));
rimraf('./dist', () => {
  const config = require(`../../lib/webpack.${argv.env}`);
  webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(err);
      process.exit(2);
    }
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
    }));
    console.log('webpack build success, begin run test...');
    mocha.addFile(path.join(__dirname, './html-test.js'));
    mocha.addFile(path.join(__dirname, './js-css-test.js'));
    mocha.run();
  });
});
