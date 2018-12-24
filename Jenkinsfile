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
        stage ('Bump version (develop)') {
            when {
                expression {
                    return env.BRANCH_NAME == 'refactor-release'
                }
            }
            steps {
                sh "git config --global user.email \"jenkins@arkane.network\""
                sh "git config --global user.name \"Jenkins\""
                sh "npm version prerelease --preid=develop"
            }
        }
        stage('Build') {
            steps {
              sh "npm i"
              sh "npm run build-ts"
              sh "npm run build-js"
            }
        }
        stage ('Publish') {
            environment {
                NPM_KEY = credentials('NPM_KEY')
            }
            when {
                expression {
                    GIT_BRANCH = env.BRANCH_NAME
                    return GIT_BRANCH == 'refactor-release'
                }
            }
            steps {
                sh "printf '//registry.npmjs.org/:_authToken=' > .npmrc && printf '${NPM_KEY}' >> .npmrc"
                sh 'npm publish --tag develop'
                withCredentials([usernamePassword(credentialsId: 'GITHUB_CRED', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    sh 'git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/FundRequest/arkane-connect.git HEAD:origin/${GIT_BRANCH}'
                    sh 'git push --tags'
                }
            }
        }
    }
}
