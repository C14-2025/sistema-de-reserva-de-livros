module.exports = {
  // Herda configurações do CRA
  ...require('react-scripts/scripts/utils/createJestConfig')(),
  
  // Sobrescreve configurações
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports',
      outputName: 'junit.xml',
      suiteName: 'Frontend Tests',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}'
    }]
  ],
  
  // Desabilita watch mode no CI
  watchAll: false
};