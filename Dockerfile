FROM node:12-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD echo "server { \
  listen       80; \
  server_name  ـ; \
  server_tokens off; \
  error_page 405 = \$uri; \
  gzip on; \
  gzip_types text/plain application/javascript application/x-javascript text/javascript text/xml text/css; \
  location / { \
  root   /usr/share/nginx/html; \
  index  index.html index.htm; \
  try_files \$uri \$uri/ /index.html; \
  } \
  # redirect server error pages to the static page /50x.html \
  error_page   500 502 503 504  /50x.html; \
  location = /50x.html { \
  root   /usr/share/nginx/html; \
  } \
  }" > /etc/nginx/conf.d/default.conf && \
  find /usr/share/nginx/html -type f -exec sed -i -e 's@REACT_APP_API_SERVER_URL@'"${REACT_APP_API_SERVER_URL}"'@g' '{}' \; && \
  find /usr/share/nginx/html -type f -exec sed -i -e 's@REACT_APP_WEBSOCKET_URL@'"${REACT_APP_WEBSOCKET_URL}"'@g' '{}' \; && \
  nginx -g 'daemon off;'
