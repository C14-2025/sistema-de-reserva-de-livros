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
        
        stage('Frontend - Install dependencies') {
            steps {
                echo '📦 Instalando dependências do frontend...'
                dir('frontend') {
                    bat 'npm ci'
                }
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

        stage('Frontend - Build') {
            steps {
                echo '🛠️ Construindo frontend...'
                dir('frontend') {
                    bat 'npm run build'
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

        stage('Frontend - Run Tests') {
            when {
                expression { fileExists('frontend/package.json') }
            }
            steps {
                echo '🧪 Rodando testes do frontend...'
                dir('frontend') {
                    bat '''
                        @echo off
                        echo === Configuração atual ===
                        npm list jest-junit
                        
                        echo Criando diretório reports...
                        if exist reports rmdir /s /q reports
                        mkdir reports
                        
                        echo Executando testes do React...
                        npx react-scripts test --watchAll=false --testResultsProcessor="jest-junit"
                        
                        echo === Verificação ===
                        if exist "reports\\junit.xml" (
                            echo ✅ RELATÓRIO EM reports/junit.xml
                            for %%F in (reports\\junit.xml) do echo Tamanho: %%~zF bytes
                        ) else if exist "junit.xml" (
                            echo ⚠️ Arquivo na raiz, movendo...
                            move junit.xml reports\\
                            echo ✅ Movido para reports
                        ) else (
                            echo ❌ Nenhum arquivo encontrado
                            echo Arquivos na raiz:
                            dir | findstr /i "junit report"
                        )
                    '''
                }
            }
            post {
                always {
                    junit(
                        testResults: 'frontend/reports/junit.xml',
                        allowEmptyResults: true
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