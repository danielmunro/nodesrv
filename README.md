[![Build Status](https://travis-ci.org/danielmunro/nodesrv.svg?branch=master)](https://travis-ci.org/danielmunro/nodesrv) [![Sonatype](https://sonarcloud.io/api/project_badges/measure?project=nodesrv&metric=coverage)](https://sonarcloud.io/dashboard?id=nodesrv) [![Sonatype](https://sonarcloud.io/api/project_badges/measure?project=nodesrv&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=nodesrv)  [![Sonatype](https://sonarcloud.io/api/project_badges/measure?project=nodesrv&metric=security_rating)](https://sonarcloud.io/dashboard?id=nodesrv)

# nodesrv
Nodesrv is a text-based web socket [MUD framework](https://en.wikipedia.org/wiki/MUD).

## Getting Started

Getting started is broken into three sections:
  * installing all the necessary dependencies and database setup
  * starting the game server
  * starting a client

### Install Dependencies And Setup Fixtures

Clone this repository.

```
git clone https://github.com/danielmunro/nodesrv && cd nodesrv
```

Install app dependencies.

```
yarn
```

Create the database instance.

```
docker-compose up -d db

psql -U postgres -h localhost -c 'create database nodesrv;'
```

Import fixtures.

```
yarn create-fixtures
```

### Start The Game Server

Start the server: the first argument is the room ID for starting players, the second is the server port.

```
yarn start 3001 5151
```

### Start A Client

In a new terminal, clone and run the client repository.

```
git clone https://github.com/danielmunro/nodeclient
cd nodeclient
yarn start
```
