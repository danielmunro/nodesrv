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
yarn create-fixtures --write
```

### Start The Game Server

Start the server: the first argument is the room ID for starting players, the second is the server port.

```
yarn start
```

### Start A Client

In a new terminal, clone and run the client repository.

```
git clone https://github.com/danielmunro/nodeclient
cd nodeclient
yarn start
```
