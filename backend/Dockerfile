FROM node:20-alpine
ENV TZ=Asia/Seoul
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8006
CMD ["npm", "start"]
