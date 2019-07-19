[![Build Status](https://travis-ci.org/danielmunro/nodesrv.svg?branch=master)](https://travis-ci.org/danielmunro/nodesrv) [![Sonatype](https://sonarcloud.io/api/project_badges/measure?project=nodesrv&metric=coverage)](https://sonarcloud.io/dashboard?id=nodesrv) [![Sonatype](https://sonarcloud.io/api/project_badges/measure?project=nodesrv&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=nodesrv)  [![Sonatype](https://sonarcloud.io/api/project_badges/measure?project=nodesrv&metric=security_rating)](https://sonarcloud.io/dashboard?id=nodesrv)

# nodesrv
Nodesrv is a text-based web socket [MUD framework](https://en.wikipedia.org/wiki/MUD).

## Getting Started

Getting started is broken into three sections:
  * installing all the necessary dependencies and database setup
  * starting the game server
  * starting a client

### Prerequisites

Server setup assumes the target system has:
  * internet access
  * git
  * docker, docker-compose
  * nodejs runtime

In order to run the client, 

### Install Dependencies And Setup Fixtures

Clone this repository

```
git clone https://github.com/danielmunro/nodesrv && cd nodesrv
```

Install application dependencies

```
yarn
```

Create the database

```
docker-compose up -d db

psql -U postgres -h localhost -c 'create database nodesrv;'
```

Copy the database configuration file and modify with the correct connection settings:

```
cp ormconfig.json.example ormconfig.json

vim ormconfig.json
```

Finally, import game fixtures

```
yarn create-fixtures --write
```

### Start The Game Server

In order to start the server, run:

```
yarn start
```

The default port is 5151.

### Start A Client

In a new terminal, clone and run the client repository.

```
git clone https://github.com/danielmunro/nodeclient
cd nodeclient
yarn start
```

## Running Tests

Run all tests, no coverage:

```
yarn test -i
```

Generate coverage report, takes longer:

```
yarn test-coverage -i
```

Test most functionality, no database interactions, very quick:

```
yarn test-most -w 6
```
