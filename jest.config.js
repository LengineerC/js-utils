module.exports = {
  testEnviroment: 'node',
  testMatch: [
    '**/__test__/**/*.test.js',
  ],
  verbose: true,
  testTimeout: 5000,
  globals: {
    'ts-jest': {
      tsconfig: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      }
    }
  }
};