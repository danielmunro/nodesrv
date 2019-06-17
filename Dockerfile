FROM node:9
EXPOSE 5151
COPY . /app
WORKDIR /app
ENTRYPOINT ["yarn", "start"]
