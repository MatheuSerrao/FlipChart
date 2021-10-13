FROM node:16-alpine3.11
ENV NODE_ENV=development

WORKDIR /app

# COPY ["package.json", "package-lock.json*", "./"]

# RUN npm install

# COPY . .

# CMD [ "npm", "start"]