FROM node:12.7

COPY package.json .

RUN npm install

COPY ./ .

EXPOSE 3000

CMD ["npm", "run", "dev"]