import * as fs from "fs"
import { Domain } from "./../src/domain"
import { Direction } from "./../src/room/constants"
import { Room } from "../src/room/model/room"
import { Exit } from "../src/room/model/exit"
import { reverse } from "../src/room/direction"
import { getConnection } from "../src/db/connection"
import { findRoom } from "../src/room/repository";
import { createConnection } from "typeorm";

function newRoom(name: string, description: string): Room {
  const room = new Room()
  room.name = name
  room.description = description

  return room
}

function newExit(direction: Direction, source: Room, destination: Room): Exit {
  const exit = new Exit()
  exit.direction = direction
  exit.source = source
  exit.destination = destination

  return exit
}

function newReciprocalExit(direction: Direction, source: Room, destination: Room): Exit[] {
  return [
    newExit(direction, source, destination),
    newExit(reverse(direction), destination, source)
  ]
}

fs.unlink("database.db", () => {
  getConnection().then(connection => {
    const exitRepository = connection.getRepository(Exit)
    const roomRepository = connection.getRepository(Room)
    Promise.all([
      newRoom(
        "Inn at the lodge",
        "Flickering torches provide the only light in the large main mess hall. "
        + "The room is filled with the chatter of travellers preparing for the journey ahead."),
      newRoom(
        "A cozy room at the Inn",
        "Something about a room in the inn."),
      newRoom(
        "A cozy room at the Inn",
        "Something about a room in the inn."),
      newRoom(
        "A cozy room at the Inn",
        "Something about a room in the inn."),
      newRoom(
        "At the crossroads",
        "Something about crossroads."),
    ].map(room => roomRepository.save(room))).then((rooms) => {
      [
        ...newReciprocalExit(Direction.North, rooms[0], rooms[1]),
        ...newReciprocalExit(Direction.West, rooms[0], rooms[2])
      ].map((exit) => exitRepository.save(exit))
    })
  })
})