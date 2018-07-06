module.exports = (wallaby) => {
  return {
    files: [
      'src/**/*.ts',
      'src/**/*.json',
      'jest.config.js',
      'tsconfig.json',
      '!tests/**/*',
    ],
    tests: [
      'tests/**/*.ts'
    ],
    env: {
      type: 'node',
      params: {
        env: "NODE_ENV=test"
      }
    },
    testFramework: 'jest',
    setup: function (wallaby) {
      const jestConfig = require('./jest.config');
      wallaby.testFramework.configure(jestConfig);
    }
  };
};