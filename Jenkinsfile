pipeline {
	agent any

	stages {
        stage('Build NextJS') {
            steps {
                script {
                    // Build NextJS
                    sh 'docker compose build webserver'
                    sh 'docker compose up -d webserver'
                }
            }
        }

        stage('Cypress Integration Test NextJS') {
            agent {
                docker {
                    image 'cypress/base:20.9.0'
                    args '--network=host'
                }
            }

            steps {
                dir('webserver') {
                    sh 'npm ci'
                    sh 'npx cypress run'
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