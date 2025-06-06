const yeoman = require('yeoman-environment');

const Generator = require.resolve('./generators/app');
const env = yeoman.createEnv();
export default (options) => {
  env.register(Generator, 'ws:app');
  env.run('ws:app', { force: true });
};
