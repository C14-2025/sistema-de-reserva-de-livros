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
  
  // CONFIGURAÇÃO CORRETA PARA JENKINS:
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports',           // Diretório relativo
      outputName: 'junit.xml',             // Nome que o Jenkins espera
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true,
      addFileAttribute: 'true'             // Adicione esta linha
    }]
  ],
  
  // Configurações de cobertura para CI
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};