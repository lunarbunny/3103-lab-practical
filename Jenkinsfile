pipeline {
	agent any

	stages {
        stage('Cypress Integration Test NextJS') {
            agent {
                docker {
                    image 'cypress/base:20.9.0'
                }
            }

            steps {
                dir('webserver') {
                    sh 'npm ci'
                    sh 'npm run build'
                    sh 'npm run start'
                    sh 'npm run test:ci'
                }
            }
        }

        stage('Build NextJS') {
            steps {
                script {
                    // Build NextJS
                    sh 'docker compose build webserver'
                }
            }
        }
	}

    post {
        success {
            echo 'Success!'
        }

        always {
            // Remove all intermediate images and containers
            sh 'docker system prune -f'
        }
    }
}