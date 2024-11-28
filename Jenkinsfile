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
                              npm install ajv --save-dev --legacy-peer-deps
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
                          set -x
                          
                          git config --global user.email "jenkins@example.com"
                          git config --global user.name "Jenkins"
                          
                          echo "Fetching from origin..."
                          git fetch origin
                          
                          echo "Resetting working directory..."
                          git reset --hard HEAD
                          git clean -fd
                          
                          echo "Checking out and updating main branch..."
                          git checkout main
                          git reset --hard origin/main
                          
                          echo "Creating deployment file..."
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
                          
                          echo "Setting up remote..."
                          git remote set-url origin https://${GIT_CREDENTIALS_USR}:${GIT_CREDENTIALS_PSW}@github.com/Coconut-Finance-Team/Coconut-Front-App.git
                          
                          echo "Adding and committing changes..."
                          git add k8s/deployment.yaml
                          git commit -m "Update frontend deployment to version ${DOCKER_TAG}"
                          
                          echo "Pushing to main..."
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
                          set -x
                          
                          echo "Setting up KUBECONFIG..."
                          export KUBECONFIG=${KUBE_CONFIG}
                          
                          echo "Attempting ArgoCD login..."
                          ARGOCD_SERVER="afd51e96d120b4dce86e1aa21fe3316d-787997945.ap-northeast-2.elb.amazonaws.com"
                          
                          # 첫 번째 시도: 기본 로그인
                          argocd login \${ARGOCD_SERVER}:443 \
                              --username coconut \
                              --password ${ARGOCD_CREDENTIALS} \
                              --insecure || {
                              
                              echo "First login attempt failed, trying with auth token..."
                              # 두 번째 시도: 토큰 방식
                              argocd login \${ARGOCD_SERVER} \
                                  --auth-token ${ARGOCD_CREDENTIALS} \
                                  --insecure || {
                                  
                                  echo "Second login attempt failed, trying with environment variable..."
                                  # 세 번째 시도: 환경 변수 방식
                                  ARGOCD_AUTH_TOKEN=${ARGOCD_CREDENTIALS} argocd login \${ARGOCD_SERVER} --insecure
                              }
                          }
                          
                          echo "Checking ArgoCD connection..."
                          argocd cluster list
                          
                          echo "Syncing application..."
                          argocd app sync frontend-app
                          
                          echo "Waiting for application health..."
                          argocd app wait frontend-app --health --timeout 600
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
      failure {
          echo 'Pipeline failed! Check the logs for details.'
      }
      success {
          echo 'Pipeline completed successfully!'
      }
  }
}
