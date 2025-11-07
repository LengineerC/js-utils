module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'add', 'chore', 'docs', 'refactor', 'test', 'style', 'perf', 'ci', 'build']
    ],
    'subject-case': [0]
  }
};
