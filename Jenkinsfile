pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build React Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Install Laravel Dependencies') {
            steps {
                dir('backend') {
                    sh 'composer install --no-interaction --prefer-dist'
                }
            }
        }

        stage('Laravel Basic Setup') {
            steps {
                dir('backend') {
                    sh 'php artisan key:generate || true'
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI successful: React + Laravel'
        }
        failure {
            echo '❌ CI failed'
        }
    }
}
