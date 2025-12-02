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
  verbose: true,
  testTimeout: 10000,

  // CONFIGURAÇÃO COMPLETA PARA JENKINS:
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports',           // Diretório relativo
      outputName: 'junit.xml',             // Nome que o Jenkins espera
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true,
      addFileAttribute: 'true'             // Melhor compatibilidade
    }]
  ]
};