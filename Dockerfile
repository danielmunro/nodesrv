FROM node:9
EXPOSE 5151
COPY . /app
WORKDIR /app
ENTRYPOINT ["yarn", "start", "08a2bc9b-679a-4bee-85d0-127288a24f61", "5151"]