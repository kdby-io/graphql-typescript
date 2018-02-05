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
  // roots: [
  //   '<rootDir>',
  // ],
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
  // testMatch: ['test/**/*.test.ts'],
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!tests/**/*'],
  mapCoverage: true,
  coverageDirectory: '.coverage',
};
