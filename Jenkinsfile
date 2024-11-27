pipeline {
   agent any
   environment {
       ECR_REPOSITORY = "castlehoo/frontend"
       DOCKER_TAG = "${BUILD_NUMBER}"
       ARGOCD_CREDENTIALS = credentials('argocd-token')
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
                       timeout(time: 10, unit: 'MINUTES') {
                           sh 'rm -f package-lock.json'
                           sh 'rm -rf node_modules'
                           sh 'npm cache clean --force'
                           sh 'NO_UPDATE_NOTIFIER=1 npm install --legacy-peer-deps --no-audit'
                           sh 'npm run build'
                       }
                   }
               }
           }
       }
       stage('Build Docker Image') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       sh "docker build -t ${ECR_REPOSITORY}:${DOCKER_TAG} ."
                   }
               }
           }
       }
       stage('Push to AWS ECR') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       sh """
                           aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin AIDA6ODU5GSNDMFXNAAFV.dkr.ecr.ap-northeast-2.amazonaws.com
                           docker tag ${ECR_REPOSITORY}:${DOCKER_TAG} AIDA6ODU5GSNDMFXNAAFV.dkr.ecr.ap-northeast-2.amazonaws.com/${ECR_REPOSITORY}:${DOCKER_TAG}
                           docker push AIDA6ODU5GSNDMFXNAAFV.dkr.ecr.ap-northeast-2.amazonaws.com/${ECR_REPOSITORY}:${DOCKER_TAG}
                       """
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
                           sed -i 's|image: .*|image: AIDA6ODU5GSNDMFXNAAFV.dkr.ecr.ap-northeast-2.amazonaws.com/${ECR_REPOSITORY}:${DOCKER_TAG}|' k8s/deployment.yaml
                           git add k8s/deployment.yaml
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
                           argocd login a20247f3f4bd34d8390eb6f1fb3b9cd4-726286595.ap-northeast-2.elb.amazonaws.com --token ${ARGOCD_CREDENTIALS} --insecure
                           argocd app sync frontend-app --prune
                           argocd app wait frontend-app --health
                           argocd logout a20247f3f4bd34d8390eb6f1fb3b9cd4-726286595.ap-northeast-2.amazonaws.com
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
