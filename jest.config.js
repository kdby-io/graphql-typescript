module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['json', 'ts', 'js'],
  transform: {
    '^.+\\.ts$': './node_modules/ts-jest/preprocessor.js',
  },
  roots: [
    '<rootDir>/src',
  ],
  testMatch: ['**/*test.ts'],
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{ts}', '!src/**/*test.{ts}', '!src/**/*.d.ts'],
  mapCoverage: true,
  coverageDirectory: 'coverage',
};
