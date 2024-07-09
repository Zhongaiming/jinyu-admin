// .lintstagedrc.js
module.exports = {
  '*.js': ['prettier --write', 'eslint --fix --ext .js'],
  '*.ts': ['prettier --write', 'eslint --fix --ext .ts'],
  '*.vue': ['prettier --write', 'eslint --fix --ext .vue'],
  '*.json': 'prettier --write',
};
