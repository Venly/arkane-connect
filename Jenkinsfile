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
              sh 'npm i'
              sh 'npm i --prefix src/connect'
              sh 'npx vue-cli-service build'
              sh 'cp src/connect/connect.js dist/.'
            }
        }
        stage('Docker Build') {
          steps {
            sh 'docker build -t fundrequestio/arkane-connect:${BRANCH_NAME} .'
          }
        }
        stage('Docker Push') {
          steps {
            withCredentials([usernamePassword(credentialsId: 'dockerHub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
              sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPassword}"
              sh "docker push fundrequestio/arkane-connect:${BRANCH_NAME} && echo 'pushed'"
            }
          }
        }
    }
}