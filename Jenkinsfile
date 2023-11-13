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
                sh 'npm ci --prefix ./webserver'
                sh 'npm run start --prefix ./webserver &'
                sh 'npx wait-on http://localhost:3000'
                sh 'npm run test:ci'
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

        stage('Deploy NextJS') {
            steps {
                script {
                    // Stop existing container and deploy new container
                    sh 'docker compose stop webserver'
                    sh 'docker rm -f webserver'
                    sh 'docker compose up -d webserver'
                }
            }
        }
	}
}