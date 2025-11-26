module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js', 
    'middlewares/**/*.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ]
};