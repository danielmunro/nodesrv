[![Build Status](https://travis-ci.org/danielmunro/nodesrv.svg?branch=master)](https://travis-ci.org/danielmunro/nodesrv) [![Sonatype](https://sonarcloud.io/api/project_badges/measure?project=nodesrv&metric=coverage)](https://sonarcloud.io/dashboard?id=nodesrv)

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

psql -U postgres -h localhost -c 'create database foo;'
```

Import fixtures.

```
yarn create-fixtures
```

### Start The Game Server

Capture the unique ID of the start room for players.

```
psql -U postgres -h localhost nodesrv -c 'select "uuid" from room where "importID"=3001';
```

Start the server.

```
yarn start <start room uuid> <port to listen on -- default 5151>
```

### Start A Client

In a new terminal, clone and run the client repository.

```
git clone https://github.com/danielmunro/nodeclient
cd nodeclient
yarn start
```
