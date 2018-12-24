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
                    GIT_BRANCH = env.BRANCH_NAME
                    return GIT_BRANCH == 'refactor-release'
                }
            }
            steps {
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
                sh "printf '//registry.npmjs.org/:_authToken=' > .npmrc"
                sh "printf '${NPM_KEY}' >> .npmrc"
                sh 'npm publish --tag develop'
                sh 'git push'
                sh 'git push --tags'
            }
        }
    }
}
