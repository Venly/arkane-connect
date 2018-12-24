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
        stage('Build') {
            steps {
              sh "npm i --prefix src/connect"
              sh "npm run build-ts --prefix src/connect"
              sh "npm run build-js --prefix src/connect"
              sh "cp -r src/connect/dist dist/."
              sh "cp src/connect/connect.js dist/."
            }
        }
    }
}