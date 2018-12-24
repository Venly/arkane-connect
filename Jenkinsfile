pipeline {
    agent any
    environment {
        GITHUB_CREDS = credentials('GITHUB_CRED')
    }
    options {
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
    }
    stages {
        stage ('bump develop version') {
            when {
                expression {
                    GIT_BRANCH = 'origin/' + sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    return GIT_BRANCH == 'origin/develop'
                }
            }
            steps {
                sh "npm version prerelease --preid=develop
            }
        }
        stage('Build') {
            steps {
              sh "npm i"
              sh "npm run build-ts"
              sh "npm run build-js"
            }
        }
    }
}