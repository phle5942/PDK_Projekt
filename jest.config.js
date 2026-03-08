module.exports = {
  preset: 'ts-jest',               // enables ts-jest
  testEnvironment: 'node',         // Node runtime
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'  // points to your Jest tsconfig
    }
  },
  collectCoverage: true,           // keep your coverage option
};
