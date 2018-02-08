module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  transform: {
    '^.+\\.ts$': './node_modules/ts-jest/preprocessor.js',
  },
  testRegex: '(/src/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!tests/**/*'],
  mapCoverage: true,
  coverageDirectory: '.coverage',
};
