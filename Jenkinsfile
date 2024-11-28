pipeline {
   agent any
   environment {
       ECR_REPOSITORY = "castlehoo/frontend"
       DOCKER_TAG = "${BUILD_NUMBER}"
       ARGOCD_CREDENTIALS = credentials('argocd-token')
       KUBE_CONFIG = credentials('eks-kubeconfig')
       GIT_CREDENTIALS = credentials('github-token')
       AWS_CREDENTIALS = credentials('aws-credentials')
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

       stage('Setup Node.js') {
           steps {
               sh '''
                   export NVM_DIR="$HOME/.nvm"
                   [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                   nvm use 22.11.0 || nvm install 22.11.0
                   node -v
                   npm -v
               '''
           }
       }

       stage('Build React Application') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       timeout(time: 10, unit: 'MINUTES') {
                           sh '''
                               rm -f package-lock.json
                               rm -rf node_modules
                               npm cache clean --force
                               
                               # ajv 패키지를 --legacy-peer-deps와 함께 설치
                               npm install ajv --save-dev --legacy-peer-deps
                               
                               # 나머지 의존성 설치
                               npm install --legacy-peer-deps --no-audit
                               
                               DISABLE_ESLINT_PLUGIN=true npm run build
                           '''
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
                   withCredentials([[
                       $class: 'AmazonWebServicesCredentialsBinding',
                       credentialsId: 'aws-credentials',
                       accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                       secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                   ]]) {
                       script {
                           sh """
                               aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 992382629018.dkr.ecr.ap-northeast-2.amazonaws.com
                               docker tag ${ECR_REPOSITORY}:${DOCKER_TAG} 992382629018.dkr.ecr.ap-northeast-2.amazonaws.com/${ECR_REPOSITORY}:${DOCKER_TAG}
                               docker push 992382629018.dkr.ecr.ap-northeast-2.amazonaws.com/${ECR_REPOSITORY}:${DOCKER_TAG}
                           """
                       }
                   }
               }
           }
       }

       stage('Update Kubernetes Manifests') {
           steps {
               catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                   script {
                       sh """
                           git pull origin main
                           mkdir -p k8s
                           cat << EOF > k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
 name: frontend-deployment
spec:
 replicas: 1
 selector:
   matchLabels:
     app: frontend
 template:
   metadata:
     labels:
       app: frontend
   spec:
     containers:
     - name: frontend
       image: 992382629018.dkr.ecr.ap-northeast-2.amazonaws.com/${ECR_REPOSITORY}:${DOCKER_TAG}
EOF
                           git config user.email "jenkins@example.com"
                           git config user.name "Jenkins"
                           git remote set-url origin https://${GIT_CREDENTIALS_USR}:${GIT_CREDENTIALS_PSW}@github.com/Coconut-Finance-Team/Coconut-Front-App.git
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
                           argocd login afd51e96d120b4dce86e1aa21fe3316d-787997945.ap-northeast-2.elb.amazonaws.com --username coconut --password ${ARGOCD_CREDENTIALS} --insecure --plaintext
                           argocd app sync frontend-app --prune
                           argocd app wait frontend-app --health
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
