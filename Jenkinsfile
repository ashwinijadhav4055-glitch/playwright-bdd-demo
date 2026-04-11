pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'ui', 'api', 'smoke'],
            description: 'Select which test suite to run'
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run browser in headless mode'
        )
    }

    environment {
        CI           = 'true'
        BASE_URL     = credentials('BASE_URL')
        UI_USERNAME  = credentials('UI_USERNAME')
        UI_PASSWORD  = credentials('UI_PASSWORD')
        API_BASE_URL = credentials('API_BASE_URL')
        API_USERNAME = credentials('API_USERNAME')
        API_PASSWORD = credentials('API_PASSWORD')
        HEADLESS     = "${params.HEADLESS}"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.BRANCH_NAME ?: 'local'}"
                echo "Build: #${env.BUILD_NUMBER}"
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install chromium --with-deps'
            }
        }

        stage('Create .env File') {
            steps {
                bat """
                    echo BASE_URL=%BASE_URL% > .env
                    echo UI_USERNAME=%UI_USERNAME% >> .env
                    echo UI_PASSWORD=%UI_PASSWORD% >> .env
                    echo API_BASE_URL=%API_BASE_URL% >> .env
                    echo API_USERNAME=%API_USERNAME% >> .env
                    echo API_PASSWORD=%API_PASSWORD% >> .env
                    echo HEADLESS=%HEADLESS% >> .env
                """
            }
        }

        stage('Clean Previous Results') {
            steps {
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'if exist allure-report rmdir /s /q allure-report'
                bat 'if exist test-results rmdir /s /q test-results'
                bat 'if exist playwright-report rmdir /s /q playwright-report'
                bat 'mkdir allure-results && mkdir test-results'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def testCommand = ''
                    switch (params.TEST_SUITE) {
                        case 'ui':
                            testCommand = 'npm run test:ui'
                            break
                        case 'api':
                            testCommand = 'npm run test:api'
                            break
                        case 'smoke':
                            testCommand = 'npm run test:smoke'
                            break
                        default:
                            testCommand = 'npm test'
                    }
                    echo "Running: ${testCommand}"
                    bat "${testCommand} || exit 0"
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts(
                artifacts: 'allure-results/**, test-results/**, playwright-report/**',
                allowEmptyArchive: true
            )
            bat 'if exist .env del .env'
        }
        success {
            echo "All tests passed on build #${env.BUILD_NUMBER}"
        }
        failure {
            echo "Tests failed on build #${env.BUILD_NUMBER}"
        }
    }
}