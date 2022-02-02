FROM node:12.19.0-buster AS compile-image

WORKDIR /opt/ng
COPY package.json /opt/ng/package.json
RUN npm install
RUN npm install -g @angular/cli
ENV PATH="./node_modules/.bin:$PATH" 

COPY . ./
RUN ng build --prod
 
FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=compile-image /opt/ng/dist/online-testing /usr/share/nginx/html