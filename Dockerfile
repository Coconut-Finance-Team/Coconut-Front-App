FROM node:16 as builder
WORKDIR /app
COPY package*.json ./
# npm install을 --legacy-peer-deps 옵션과 함께 실행
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
