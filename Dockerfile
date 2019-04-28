FROM node:10.15.3-alpine

WORKDIR /app

COPY . .
RUN npm install --unsafe-perm
RUN chown -R node:node /app

EXPOSE 8000
USER node
CMD ["npm", "start"]
