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
                    GIT_BRANCH = 'origin/' + sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    echo GIT_BRANCH
                    return GIT_BRANCH == 'origin/refactor-release'
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
                    GIT_BRANCH = 'origin/' + sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    return GIT_BRANCH == 'origin/refactor-release'
                }
            }
            steps {
                sh 'printf "//registry.npmjs.org/:_authToken=" > .npmrc"
                sh 'printf "' + NPM_KEY + '" >> .npmrc"
                sh 'npm publish --tag develop"
                sh 'git push'
                sh 'git push --tags'
            }
        }
    }
}



8add6579-ba64-4c46-932f-a18be6431db4
 0fb77bf5-3245-49ef-9ca1-2b8730723941