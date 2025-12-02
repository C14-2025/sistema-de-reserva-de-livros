pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'nodejs', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "${NODEJS_HOME};${env.PATH}"
        // Adicione variáveis de ambiente para Jest
        JEST_JUNIT_OUTPUT_DIR = "test-results"
        JEST_JUNIT_OUTPUT_NAME = "jest-results.xml"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Baixando código do Git...'
                checkout scm
            }
        }

        stage('Verificar Node e NPM') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Backend - Install dependencies') {
            steps {
                echo '📦 Instalando dependências do backend...'
                dir('backend') {
                    bat 'npm ci'
                    // Verifique se jest-junit está instalado
                    bat 'npm list jest-junit || npm install jest-junit --save-dev'
                }
            }
        }

        stage('Backend - Run Tests') {
            steps {
                echo '🧪 Rodando testes do backend...'
                dir('backend') {
                    script {
                        // 1. Limpa diretórios antigos
                        bat '''
                            if exist test-results rmdir /s /q test-results
                            if exist coverage rmdir /s /q coverage
                        '''
                        
                        // 2. Cria diretórios
                        bat 'mkdir test-results'
                        bat 'mkdir coverage'
                        
                        // 3. Roda testes com opções específicas
                        bat 'npx jest --ci --runInBand --coverage --verbose --testLocationInResults'
                        
                        // 4. Verifica se arquivo foi criado
                        bat '''
                            echo "=== VERIFICAÇÃO DO RELATÓRIO ==="
                            if exist "test-results\\jest-results.xml" (
                                echo "✅ Arquivo encontrado!"
                                echo "Conteúdo das primeiras linhas:"
                                type test-results\\jest-results.xml | findstr /C:"<?xml" /C:"<testsuites" /C:"<testsuite"
                            ) else (
                                echo "❌ Arquivo NÃO encontrado!"
                                echo "Conteúdo do diretório test-results:"
                                dir test-results
                            )
                        '''
                    }
                }
            }
            post {
                always {
                    echo '📄 Publicando resultados dos testes...'
                    
                    script {
                        // Verifica se o arquivo existe antes de publicar
                        def reportExists = fileExists 'backend/test-results/jest-results.xml'
                        
                        if (reportExists) {
                            echo "Publicando relatório JUnit..."
                            junit(
                                testResults: 'backend/test-results/jest-results.xml',
                                allowEmptyResults: true,
                                keepLongStdio: true,
                                healthScaleFactor: 1.0
                            )
                            
                            // Também arquiva para debug
                            archiveArtifacts artifacts: 'backend/test-results/jest-results.xml', fingerprint: true
                        } else {
                            echo "⚠️ Relatório não encontrado! Criando relatório vazio..."
                            
                            // Cria relatório mínimo
                            writeFile file: 'backend/test-results/jest-results.xml', 
                                     text: """<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="Backend Tests - ${env.JOB_NAME}" tests="0" failures="0" time="0">
  <testsuite name="No tests executed" tests="0" failures="0" errors="0" skipped="0" time="0">
  </testsuite>
</testsuites>"""
                            
                            junit testResults: 'backend/test-results/jest-results.xml'
                        }
                    }
                }
            }
        }

        stage('Backend - Coverage Report') {
            steps {
                echo '📊 Gerando relatório de cobertura...'
                dir('backend') {
                    // Se usar o plugin JaCoCo
                    // jacoco(
                    //     execPattern: 'coverage/coverage-final.json',
                    //     classPattern: '**/classes',
                    //     sourcePattern: '**/src'
                    // )
                    
                    // Publica relatório HTML
                    publishHTML([
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Backend Coverage Report',
                        keepAll: true
                    ])
                }
            }
        }

        stage('Frontend - Install dependencies') {
            when {
                expression { fileExists('frontend/package.json') }
            }
            steps {
                echo '📦 Instalando dependências do frontend...'
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }
    }

    post {
        always {
            // Arquiva logs e relatórios para debug
            archiveArtifacts artifacts: 'backend/coverage/**/*', fingerprint: true
            archiveArtifacts artifacts: 'backend/test-results/**/*', fingerprint: true
            
            // Limpa workspace se necessário
            // cleanWs()
        }
        
        success {
            echo '🎉 Pipeline finalizada com sucesso!'
            script {
                // Opcional: Enviar notificação de sucesso
                emailext (
                    subject: "✅ Build #${BUILD_NUMBER} - SUCESSO",
                    body: "Pipeline do Sistema de Reserva de Livros finalizada com sucesso!\n\nDetalhes:\n- Job: ${JOB_NAME}\n- Build: #${BUILD_NUMBER}\n- URL: ${BUILD_URL}",
                    to: 'seu-email@example.com'
                )
            }
        }
        failure {
            echo '❌ A pipeline falhou.'
            script {
                // Opcional: Enviar notificação de falha
                emailext (
                    subject: "❌ Build #${BUILD_NUMBER} - FALHA",
                    body: "A pipeline do Sistema de Reserva de Livros falhou!\n\nDetalhes:\n- Job: ${JOB_NAME}\n- Build: #${BUILD_NUMBER}\n- URL: ${BUILD_URL}\n\nPor favor, verifique os logs.",
                    to: 'seu-email@example.com'
                )
            }
        }
        always {
            echo '📊 Pipeline finalizada. Status: ' + currentBuild.result
            cleanWs() // Limpa workspace após execução
        }
    }
}