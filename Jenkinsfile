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
                    bat 'npm ci'
                }
            }
        }

        stage('Backend - Run Tests') {
            steps {
                echo '🧪 Rodando testes do backend...'
                dir('backend') {
                    // Remove diretório antigo e cria novo
                    bat 'if exist reports rmdir /s /q reports'
                    bat 'mkdir reports'
                    
                    // Executa testes sem cobertura
                    bat 'npm run test:ci'
                    
                    // VERIFICAÇÃO: Mostra se arquivo foi criado
                    bat '''
                        echo "=== Verificação do relatório ==="
                        if exist "reports\\junit.xml" (
                            echo "✅ RELATÓRIO CRIADO COM SUCESSO!"
                            echo "Local: backend\\reports\\junit.xml"
                            for %%F in (reports\\junit.xml) do echo Tamanho: %%~zF bytes
                        ) else (
                            echo "❌ ERRO: Relatório NÃO criado!"
                            dir reports
                        )
                    '''
                }
            }
            post {
                always {
                    echo '📄 Publicando resultados dos testes no Jenkins...'
                    
                    // Publica resultados JUnit
                    junit(
                        testResults: 'backend/reports/junit.xml',
                        allowEmptyResults: true,
                        keepLongStdio: true
                    )
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline finalizada com sucesso!'
        }
        failure {
            echo '❌ A pipeline falhou.'
        }
        always {
            echo '📊 Pipeline finalizada. Status: ' + currentBuild.result
            cleanWs()
        }
    }
}