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
        stage('Bump version') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'hotfix-*'
                    branch 'release-*'
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
                sh "npm run build"
            }
        }
        stage('Publish to npmjs') {
            environment {
                NPM_KEY = credentials('NPM_KEY')
            }
            when {
                anyOf {
                    branch 'develop'
                    branch 'hotfix-*'
                    branch 'release-*'
                    branch 'master'
                }
            }
            steps {
                sh "printf '//registry.npmjs.org/:_authToken=' > .npmrc && printf '${NPM_KEY}' >> .npmrc"
                script {
                    if (env.BRANCH_NAME == 'master') {
                        sh 'npm publish'
                    } else {
                        sh 'npm publish --tag ${BRANCH_NAME}'
                    }
                }
                withCredentials([gitUsernamePassword(credentialsId: 'GITHUB_CRED', gitToolName: 'Default')]) {
                    sh 'git push --tags origin HEAD:refs/heads/${BRANCH_NAME}'
                }
            }
            post {
                always {
                    cleanWs(deleteDirs: true, patterns: [[pattern: '.npmrc', type: 'INCLUDE']])
                }
            }
        }
        stage('Merge back to develop') {
            when {
                anyOf {
                    branch 'hotfix-*'
                    branch 'release-*'
                }
            }
            steps {
                sh 'echo "Merging back branch to develop"'
                withCredentials([gitUsernamePassword(credentialsId: 'GITHUB_CRED', gitToolName: 'Default')]) {
                    sh 'git reset --hard'
                    sh 'git checkout ${GIT_COMMIT}'
                    script {
                        def packageFile = readJSON file: 'package.json'
                        env.BRANCH_VERSION = packageFile.version
                    }
                    sh 'git fetch --no-tags origin develop:develop'
                    sh "git checkout develop"
                    script {
                        def packageFile = readJSON file: 'package.json'
                        env.DEVELOP_VERSION = packageFile.version
                    }
                    sh "npm version ${BRANCH_VERSION} --git-tag-version=false"
                    sh 'git commit -am "Update develop to branch version to avoid merge conflicts"'
                    sh 'git merge ${GIT_COMMIT}'
                    sh "npm version ${DEVELOP_VERSION} --git-tag-version=false"
                    sh 'git commit -am "Update develop version back to pre-merge state"'
                    sh 'git push origin develop:develop'
                }
            }
            post {
                always {
                    cleanWs(deleteDirs: true, patterns: [[pattern: '.git', type: 'INCLUDE']])
                }
            }
        }
    }
}
