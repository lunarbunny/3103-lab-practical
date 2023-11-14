pipeline {
	agent any

    environment {
        SONARQUBE_HOME = tool 'SonarQube'
    }

	stages {
        stage('Cypress E2E Tests NextJS') {
            agent {
                docker {
                    image 'cypress/base:20.9.0'
                }
            }

            steps {
                dir('webserver') {
                    sh 'npm ci'
                    sh 'npm run build'
                    sh 'npm run start &'
                    sleep(10)
                    sh 'npm run test:ci'
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                // Run OWASP Dependency-Check
                // https://jeremylong.github.io/DependencyCheck/dependency-check-cli/arguments.html

                dir('webserver') {
                    nodejs(nodeJSInstallationName: 'NodeJS') {
                        sh 'npm ci'
                        
                        dependencyCheck additionalArguments: '''
                        -s '.'
                        --exclude '.next/**'
                        -f 'HTML'
                        -f 'XML'
                        ''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                
                        // Write report to specified file
                        dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS') {
                    withSonarQubeEnv('SonarQube') {
                        script {
                            sh "${SONARQUBE_HOME}/bin/sonar-scanner -Dsonar.projectKey=lab -Dsonar.sources=./webserver"
                        }
                    }
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
            // SonarQube analysis
            recordIssues enabledForFailure: true, tool: sonarQube()

            // Remove all intermediate images and containers
            sh 'docker system prune -f'
        }
    }
}