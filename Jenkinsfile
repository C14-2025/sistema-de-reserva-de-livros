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
                            echo "Tamanho:"
                            for %%F in (reports\\junit.xml) do echo %%~zF bytes
                            echo "Primeiras linhas:"
                            type reports\\junit.xml | findstr "<" | head -3
                        ) else (
                            echo "❌ ERRO: Relatório NÃO criado!"
                            echo "Conteúdo do diretório reports:"
                            dir reports
                        )
                    '''
                }
            }
            post {
                always {
                    echo '📄 Publicando resultados dos testes no Jenkins...'
                    
                    // Publica resultados JUnit (permite vazio)
                    junit(
                        testResults: 'backend/reports/junit.xml',
                        allowEmptyResults: true,
                        keepLongStdio: true,
                        healthScaleFactor: 1.0
                    )
                    
                    // Arquiva para debug
                    archiveArtifacts artifacts: 'backend/reports/junit.xml', fingerprint: true
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