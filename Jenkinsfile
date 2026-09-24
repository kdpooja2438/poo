pipeline {
    agent any

    options {
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    // Jenkins on localhost can't receive GitHub webhooks, so poll instead.
    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        PYTHONUTF8 = '1'   // avoids unicode errors when Checkov prints on Windows
    }

    // Optional: uncomment if you configured these under
    // Manage Jenkins > Tools (names must match exactly).
    // tools {
    //     jdk 'jdk21'
    //     maven 'maven3'
    //     nodejs 'node20'
    // }

    stages {

        stage('Checkout') {
            steps {
                checkout scm   // full clone (needed by Gitleaks to scan history)
                script {
                    env.IMAGE_TAG = bat(returnStdout: true, script: '@git rev-parse HEAD').trim()
                }
            }
        }

        // ---------- Terraform job ----------
        stage('Terraform init') {
            steps {
                dir('terraform') {
                    bat 'terraform init -input=false'
                }
            }
        }

        stage('Terraform validate') {
            steps {
                dir('terraform') {
                    bat 'terraform validate'
                }
            }
        }

        stage('Terraform plan') {
            steps {
                dir('terraform') {
                    bat 'terraform plan -input=false'
                }
            }
        }

        stage('Checkov (IaC security scan)') {
            steps {
                bat 'python -m pip install --quiet checkov'
                bat 'checkov -d terraform --framework terraform --soft-fail'
            }
        }

        // ---------- Build job ----------
        stage('Gitleaks (secret scan)') {
            steps {
                bat 'gitleaks detect --source . --verbose'
            }
        }

        stage('Build backend') {
            steps {
                dir('backend') {
                    retry(3) {
                        bat 'mvn -B clean package -DskipTests'
                    }
                }
            }
        }

        stage('Backend tests') {
            steps {
                dir('backend') {
                    bat 'mvn -B test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Install frontend dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Frontend tests') {
            steps {
                dir('frontend') {
                    bat 'npm test -- --watch=false --browsers=ChromeHeadless'
                }
            }
        }

        stage('Docker build') {
            steps {
                bat 'docker build -t hotel-backend:%IMAGE_TAG% ./backend'
                bat 'docker build -t hotel-frontend:%IMAGE_TAG% ./frontend'
            }
        }

        stage('Trivy image scan') {
            steps {
                bat 'trivy image --severity HIGH,CRITICAL --exit-code 0 --format table hotel-backend:%IMAGE_TAG%'
                bat 'trivy image --severity HIGH,CRITICAL --exit-code 0 --format table hotel-frontend:%IMAGE_TAG%'
            }
        }

        stage('Check: no .env files committed') {
            steps {
                bat '''
                    @echo off
                    git ls-files "*.env" > envfiles.txt
                    for %%A in (envfiles.txt) do if %%~zA GTR 0 (echo Found .env file(s) that should not be committed: & type envfiles.txt & exit /b 1)
                    echo No .env files found.
                '''
            }
        }

        stage('Check: hardcoded credential patterns (advisory)') {
            steps {
                bat '''
                    @echo off
                    echo Naive advisory-only text search - it will not fail the build.
                    git grep -nP "(password|passwd|secret|api_key)\\s*=\\s*[\\x27\\x22][^\\x27\\x22]{3,}[\\x27\\x22]" -- "*.java" "*.properties" "*.yml" "*.ts" | findstr /V /C:"${"
                    echo Scan finished.
                '''
            }
        }
    }

    post {
        success { echo 'Pipeline finished successfully.' }
        failure { echo 'Pipeline failed - check the console output above.' }
    }
}
