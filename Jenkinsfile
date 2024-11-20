pipeline {
   agent any
   environment {
       DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials-id')
       DOCKER_IMAGE = "castlehoo/frontend"
       DOCKER_TAG = "${BUILD_NUMBER}"
       ARGOCD_CREDENTIALS = credentials('argocd-auth')
       KUBE_CONFIG = credentials('eks-kubeconfig')
       GIT_CREDENTIALS = credentials('github-token')
   }
   stages {
       stage('Check Commit Message') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       def commitMessage = sh(
                           script: 'git log -1 --pretty=%B',
                           returnStdout: true
                       ).trim()
                       if (commitMessage.startsWith("Update deployment to version")) {
                           currentBuild.result = 'ABORTED'
                           error("Skipping build for deployment update commit")
                       }
                   }
               }
           }
       }
       stage('Checkout') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   checkout scm
               }
           }
       }
       stage('Build React Application') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       sh 'rm -f package-lock.json'
                       sh 'rm -rf node_modules'
                       sh 'npm cache clean --force'
                       sh 'npm install --legacy-peer-deps'
                       sh 'npm run build'
                   }
               }
           }
       }
       stage('Build Docker Image') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                   }
               }
           }
       }
       stage('Push to Docker Hub') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                       sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                   }
               }
           }
       }
       stage('Update Kubernetes Manifests') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       sh """
                           git config user.email "jenkins@example.com"
                           git config user.name "Jenkins"
                           git remote set-url origin https://${GIT_CREDENTIALS_USR}:${GIT_CREDENTIALS_PSW}@github.com/Coconut-Finance-Team/Coconut-Front-App.git
                           git config pull.rebase false
                           git checkout main
                           git pull origin main
                           sed -i 's|image: ${DOCKER_IMAGE}:.*|image: ${DOCKER_IMAGE}:${DOCKER_TAG}|' frontend/deployment.yaml
                           git add frontend/deployment.yaml
                           git commit -m "Update frontend deployment to version ${DOCKER_TAG}"
                           git push origin main
                       """
                   }
               }
           }
       }
       stage('Sync ArgoCD Application') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       sh """
                           export KUBECONFIG=${KUBE_CONFIG}
                           argocd login a20247f3f4bd34d8390eb6f1fb3b9cd4-726286595.ap-northeast-2.elb.amazonaws.com --username ${ARGOCD_CREDENTIALS_USR} --password ${ARGOCD_CREDENTIALS_PSW} --insecure
                           argocd app sync frontend-app --prune
                           argocd app wait frontend-app --health
                           argocd logout a20247f3f4bd34d8390eb6f1fb3b9cd4-726286595.ap-northeast-2.elb.amazonaws.com
                       """
                   }
               }
           }
       }
   }
   post {
       always {
           sh 'docker logout'
           sh 'rm -f ${KUBE_CONFIG}'
       }
   }
}
