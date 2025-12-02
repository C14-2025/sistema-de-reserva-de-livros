module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middlewares/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,

  // CONFIGURAÇÃO CORRIGIDA PARA JENKINS
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'jest-results.xml',
        suiteName: 'Backend Tests', // Nome fixo, não use ${JOB_NAME}
        classNameTemplate: '{classname} - {title}',
        titleTemplate: '{classname} - {title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
        addFileAttribute: 'true',
        includeConsoleOutput: 'true', // Importante para logs
        suiteNameTemplate: '{filename}',
        reportTestSuiteErrors: 'true'
      }
    ]
  ],
  
  // Adicione para melhor compatibilidade
  testLocationInResults: true,
  coverageReporters: ['text', 'lcov', 'clover', 'html']
};