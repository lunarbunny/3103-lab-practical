pipeline {
	agent any

    environment {
        SONARQUBE_SCANNER_HOME = tool 'SonarQube'
    }

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
                
                // Install deps first
                nodejs(nodeJSInstallationName: 'NodeJS') {
                    sh 'npm install --prefix ./frontend'
                }

                dependencyCheck additionalArguments: ''' 
                            -o './dependency-check-report-web.xml'
                            -s './webserver'
                            -f 'XML' 
                            ''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'

                // Write report to specified file
                dependencyCheckPublisher pattern: 'dependency-check-report-*.xml'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh "${SONARQUBE_SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=lab -Dsonar.sources=."
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