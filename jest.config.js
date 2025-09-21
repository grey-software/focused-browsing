module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\.html$': '<rootDir>/html-transformer.js',
  },
};