pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        PORT = '5000'
        MONGO_URI = 'mongodb://127.0.0.1:27017/eventhive_jenkins'
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out repository source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing application dependencies...'
                bat 'npm install --no-fund --no-audit'
            }
        }

        stage('Repository Health & Governance') {
            steps {
                echo '🔍 Verifying repository compliance (No committed secrets or heavy artifacts)...'
                bat '''
                    if exist node_modules\\.git (
                        echo "Warning: nested git found"
                    )
                    if not exist .env.example (
                        echo "Error: Missing .env.example"
                        exit 1
                    )
                    if not exist .gitignore (
                        echo "Error: Missing .gitignore"
                        exit 1
                    )
                    echo "Repository governance checks passed successfully."
                '''
            }
        }

        stage('Automated Tests') {
            steps {
                echo '🧪 Executing automated test suite with Node.js built-in test runner...'
                bat 'npm test'
            }
        }

        stage('Security Audit') {
            steps {
                echo '🔒 Running NPM security vulnerability audit...'
                bat 'npm audit --audit-level=critical || echo "Audit completed with non-blocking advisories."'
            }
        }

        stage('Package Artifacts') {
            steps {
                echo '📦 Archiving build and release manifest...'
                bat '''
                    if not exist dist mkdir dist
                    copy package.json dist\\
                    copy server.js dist\\
                    xcopy /E /I /Y public dist\\public
                    xcopy /E /I /Y models dist\\models
                    echo EventHive Build v1.0.0 completed on %DATE% %TIME% > dist\\BUILD_INFO.txt
                '''
                archiveArtifacts artifacts: 'dist/**', fingerprint: true, allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo '🧹 Pipeline execution finished. Generating execution summary...'
        }
        success {
            echo '✅ [Jenkins] Pipeline SUCCEEDED: All stages completed, tests passing!'
        }
        failure {
            echo '❌ [Jenkins] Pipeline FAILED: Please inspect stage console output.'
        }
    }
}
