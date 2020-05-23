module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testMatch: ['**/?(*.)+(spec|test).+(ts)'],
  collectCoverageFrom: [
    '**/packages/*/**/*.ts',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/types-*/**',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        allowJs: true,
      },
    },
  },
}
