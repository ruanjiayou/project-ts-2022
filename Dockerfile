FROM node:16.16.0

WORKDIR /projects/admin/dist

COPY ./dist /projects/admin/dist
COPY ./static /projects/admin/static
COPY ./package.json /projects/admin/package.json

RUN npm install cross-env -g && npm install --production

CMD [ "npm", "start" ]
