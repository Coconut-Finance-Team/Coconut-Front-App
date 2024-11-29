pipeline {
    agent any
    
    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }
    
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
                        echo "단계: 커밋 메시지 확인 시작"
                        def commitMessage = sh(
                            script: 'git log -1 --pretty=%B',
                            returnStdout: true
                        ).trim()
                        echo "커밋 메시지: ${commitMessage}"
                        if (commitMessage.startsWith("Update deployment to version")) {
                            echo "배포 업데이트 커밋 감지, 빌드 중단"
                            currentBuild.result = 'ABORTED'
                            error("배포 업데이트 커밋으로 인한 빌드 스킵")
                        }
                        echo "커밋 메시지 확인 완료"
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    script {
                        echo "단계: 소스 코드 체크아웃 시작"
                        retry(3) {
                            checkout scm
                        }
                        echo "소스 코드 체크아웃 완료"
                    }
                }
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    try {
                        echo "단계: Node.js 설정 시작"
                        sh '''
                            echo "현재 디렉토리: $(pwd)"
                            echo "NVM 설정 시작..."
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                            echo "Node.js 22.11.0 설치/사용 설정..."
                            nvm use 22.11.0 || nvm install 22.11.0
                            echo "Node.js 버전: $(node -v)"
                            echo "npm 버전: $(npm -v)"
                        '''
                        echo "Node.js 설정 완료"
                    } catch (Exception e) {
                        error("Node.js 설정 중 오류 발생: ${e.message}")
                    }
                }
            }
        }

        stage('Build React Application') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    script {
                        echo "단계: React 애플리케이션 빌드 시작"
                        timeout(time: 10, unit: 'MINUTES') {
                            sh '''
                                echo "기존 패키지 파일 제거 중..."
                                rm -f package-lock.json
                                rm -rf node_modules
                                
                                echo "npm 캐시 정리 중..."
                                npm cache clean --force
                                
                                echo "의존성 설치 중..."
                                npm install ajv --save-dev --legacy-peer-deps
                                npm install --legacy-peer-deps --no-audit
                                
                                echo "React 애플리케이션 빌드 중..."
                                DISABLE_ESLINT_PLUGIN=true npm run build
                                
                                echo "빌드 결과 확인..."
                                ls -la build/
                            '''
                        }
                        echo "React 애플리케이션 빌드 완료"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    script {
                        try {
                            echo "단계: Docker 이미지 빌드 시작"
                            sh """
                                echo "Docker 빌드 컨텍스트 확인..."
                                ls -la
                                
                                echo "Docker 이미지 빌드 중... (태그: ${DOCKER_TAG})"
                                docker build -t ${ECR_REPOSITORY}:${DOCKER_TAG} .
                                
                                echo "빌드된 Docker 이미지 확인"
                                docker images | grep ${ECR_REPOSITORY}
                            """
                            echo "Docker 이미지 빌드 완료"
                        } catch (Exception e) {
                            error("Docker 이미지 빌드 중 오류 발생: ${e.message}")
                        }
                    }
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                script {
                    try {
                        withCredentials([[
                            $class: 'AWSCredentialsBinding',
                            credentialsId: 'aws-credentials',
                            accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                            secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                        ]]) {
                            echo "단계: ECR 푸시 시작"
                            
                            // Docker 이미지 존재 여부 확인
                            def imageExists = sh(
                                script: "docker images ${ECR_REPOSITORY}:${DOCKER_TAG} --format '{{.Repository}}'",
                                returnStdout: true
                            ).trim()
                            
                            if (!imageExists) {
                                error("Docker 이미지 ${ECR_REPOSITORY}:${DOCKER_TAG}를 찾을 수 없습니다")
                            }
                            
                            sh """
                                echo "ECR 로그인 중..."
                                aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 992382629018.dkr.ecr.ap-northeast-2.amazonaws.com
                                
                                echo "이미지 태깅 중..."
                                docker tag ${ECR_REPOSITORY}:${DOCKER_TAG} 992382629018.dkr.ecr.ap-northeast-2.amazonaws.com/${ECR_REPOSITORY}:${DOCKER_TAG}
                                
                                echo "ECR로 이미지 푸시 중..."
                                docker push 992382629018.dkr.ecr.ap-northeast-2.amazonaws.com/${ECR_REPOSITORY}:${DOCKER_TAG}
                                
                                echo "푸시된 이미지 확인"
                                aws ecr describe-images --repository-name ${ECR_REPOSITORY} --image-ids imageTag=${DOCKER_TAG} --region ap-northeast-2
                            """
                            echo "ECR 푸시 완료"
                        }
                    } catch (Exception e) {
                        error("ECR 푸시 중 오류 발생: ${e.message}")
                    }
                }
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    try {
                        echo "단계: Kubernetes 매니페스트 업데이트 시작"
                        sh """
                            set -x
                            
                            echo "Git 사용자 설정..."
                            git config --global user.email "jenkins@example.com"
                            git config --global user.name "Jenkins"
                            
                            echo "Git 저장소 업데이트..."
                            git fetch origin
                            git reset --hard HEAD
                            git clean -fd
                            
                            echo "메인 브랜치 체크아웃..."
                            git checkout main
                            git reset --hard origin/main
                            
                            echo "deployment.yaml 생성..."
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
                            
                            echo "Git remote 설정..."
                            git remote set-url origin https://${GIT_CREDENTIALS_USR}:${GIT_CREDENTIALS_PSW}@github.com/Coconut-Finance-Team/Coconut-Front-App.git
                            
                            echo "변경사항 커밋..."
                            git add k8s/deployment.yaml
                            git commit -m "Update frontend deployment to version ${DOCKER_TAG}"
                            
                            echo "GitHub로 푸시..."
                            git push origin main
                            
                            echo "Git 상태 확인"
                            git status
                        """
                        echo "Kubernetes 매니페스트 업데이트 완료"
                    } catch (Exception e) {
                        error("Kubernetes 매니페스트 업데이트 중 오류 발생: ${e.message}")
                    }
                }
            }
        }

        stage('Sync ArgoCD Application') {
            steps {
                script {
                    try {
                        echo "단계: ArgoCD 동기화 시작"
                        sh """
                            set -x
                            
                            echo "KUBECONFIG 설정..."
                            export KUBECONFIG=${KUBE_CONFIG}
                            
                            echo "현재 Kubernetes 컨텍스트 확인..."
                            kubectl config current-context
                            
                            echo "ArgoCD 서버 상태 확인..."
                            ARGOCD_SERVER="afd51e96d120b4dce86e1aa21fe3316d-787997945.ap-northeast-2.elb.amazonaws.com"
                            curl -k https://\${ARGOCD_SERVER}/api/version
                            
                            echo "ArgoCD 로그인 시도..."
                            argocd login \${ARGOCD_SERVER} \
                                --core \
                                --auth-token ${ARGOCD_CREDENTIALS} \
                                --grpc-web \
                                --insecure \
                                --plaintext
                            
                            echo "ArgoCD 컨텍스트 확인..."
                            argocd context
                            
                            echo "애플리케이션 동기화 중..."
                            argocd app sync frontend-app
                            
                            echo "애플리케이션 상태 대기 중..."
                            argocd app wait frontend-app --sync --health --timeout 300
                            
                            echo "최종 애플리케이션 상태 확인..."
                            argocd app get frontend-app
                        """
                        echo "ArgoCD 동기화 완료"
                    } catch (Exception e) {
                        error("ArgoCD 동기화 중 오류 발생: ${e.message}")
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "파이프라인 정리 작업 시작"
                try {
                    sh 'docker logout'
                    sh 'rm -f ${KUBE_CONFIG}'
                } catch (Exception e) {
                    echo "정리 작업 중 오류 발생: ${e.message}"
                }
                echo "정리 작업 완료"
            }
        }
        failure {
            script {
                echo '파이프라인 실패! 로그를 확인하세요.'
            }
        }
        success {
            script {
                echo '파이프라인이 성공적으로 완료되었습니다!'
            }
        }
    }
}
