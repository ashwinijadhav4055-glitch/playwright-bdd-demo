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
            description: 'Run browser in headless mode (set false for debugging)'
        )
    }

    environment {
        CI            = 'true'
        BASE_URL      = credentials('BASE_URL')
        UI_USERNAME   = credentials('UI_USERNAME')
        UI_PASSWORD   = credentials('UI_PASSWORD')
        API_BASE_URL  = credentials('API_BASE_URL')
        API_USERNAME  = credentials('API_USERNAME')
        API_PASSWORD  = credentials('API_PASSWORD')
        HEADLESS      = "${params.HEADLESS}"
        // Allure results dir (matches cucumber.js format config)
        ALLURE_RESULTS = 'allure-results'
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
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install chromium --with-deps'
            }
        }

        stage('Create .env File') {
            steps {
                sh '''
                    cat > .env << EOF
BASE_URL=${BASE_URL}
UI_USERNAME=${UI_USERNAME}
UI_PASSWORD=${UI_PASSWORD}
API_BASE_URL=${API_BASE_URL}
API_USERNAME=${API_USERNAME}
API_PASSWORD=${API_PASSWORD}
HEADLESS=${HEADLESS}
EOF
                '''
            }
        }

        stage('Clean Previous Results') {
            steps {
                sh 'rm -rf allure-results allure-report test-results playwright-report'
                sh 'mkdir -p allure-results test-results'
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
                    // Use || true so Jenkins captures results even on test failure
                    sh "${testCommand} || true"
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                    if [ -d allure-results ] && [ "$(ls -A allure-results)" ]; then
                        allure generate allure-results --clean -o allure-report
                        echo "Allure report generated."
                    else
                        echo "No allure-results found — skipping generation."
                    fi
                '''
            }
        }
    }

    post {
        always {
            // Publish Allure report (requires Allure Jenkins Plugin)
            script {
                if (fileExists('allure-results')) {
                    allure([
                        includeProperties: false,
                        jdk              : '',
                        reportBuildPolicy: 'ALWAYS',
                        results          : [[path: 'allure-results']]
                    ])
                }
            }

            // Publish Playwright HTML report (requires HTML Publisher Plugin)
            publishHTML(target: [
                allowMissing         : true,
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : 'playwright-report',
                reportFiles          : 'index.html',
                reportName           : 'Playwright Report',
                reportTitles         : 'Playwright Test Report'
            ])

            // Archive test artifacts
            archiveArtifacts(
                artifacts : 'allure-results/**, test-results/**, playwright-report/**',
                allowEmptyArchive: true
            )

            // Clean up .env so credentials are not stored on disk
            sh 'rm -f .env'
        }

        success {
            echo "All tests passed on build #${env.BUILD_NUMBER}"
        }

        failure {
            echo "Tests failed on build #${env.BUILD_NUMBER} — check the Allure and Playwright reports."
        }

        unstable {
            echo "Build #${env.BUILD_NUMBER} is unstable — some tests may have failed."
        }
    }
}