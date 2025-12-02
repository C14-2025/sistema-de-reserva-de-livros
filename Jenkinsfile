pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'nodejs', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "${NODEJS_HOME};${env.PATH}"
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
                    bat 'npm ci --only=production'
                }
            }
        }

        stage('Backend - Run Tests') {
            steps {
                echo '🧪 Rodando testes do backend...'
                dir('backend') {
                    // Cria diretório para reports
                    bat 'if not exist reports mkdir reports'
                    
                    // Executa testes com múltiplos formatos de saída
                    bat 'npm run test:ci'
                }
            }
            post {
                always {
                    echo '📄 Publicando resultados dos testes...'
                    junit testResults: 'backend/reports/junit.xml', allowEmptyResults: true
                    publishHTML target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Code Coverage Report'
                    ]
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
                    bat 'npm ci --only=production'
                }
            }
        }
    }

    post {
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