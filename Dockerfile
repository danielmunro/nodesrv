# FROM frapsoft/ts-node:yarn
FROM node:9
# RUN npm i -g ts-node
EXPOSE 5151
COPY . /app
# RUN yarn sync-orm
# ENTRYPOINT [ "yarn", "start", "5" ]