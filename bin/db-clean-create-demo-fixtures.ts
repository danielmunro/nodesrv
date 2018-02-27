import * as fs from "fs"
import { v4 } from "uuid"
import { db } from "./../src/db/db"
import Player from "./../src/player/model"
import { Direction } from "./../src/room/constants"
import { Exit } from "./../src/room/exit"
import { saveRooms } from "./../src/room/model"
import { Room } from "./../src/room/room"

const room1 = v4()
const room2 = v4()
const room3 = v4()
const room4 = v4()
const room5 = v4()
const player = v4()

db.query("MATCH (n) DETACH DELETE n", () => {
  saveRooms([
    new Room(
      room1,
      "Inn at the lodge",
      "Flickering torches provide the only light in the large main mess hall. "
      + "The room is filled with the chatter of travellers preparing for the journey ahead.",
      [
        new Exit(room2, Direction.North),
        new Exit(room4, Direction.East),
        new Exit(room5, Direction.West),
        new Exit(room3, Direction.South),
      ],
    ),
    new Room(
      room2,
      "A cozy room at the Inn",
      "Something about a room in the inn.",
      [
        new Exit(room1, Direction.South),
      ],
    ),
    new Room(
      room3,
      "At the crossroads",
      "Something about crossroads.",
      [
        new Exit(room1, Direction.North),
      ],
    ),
    new Room(
      room4,
      "A cozy room at the Inn",
      "Something about a room in the inn.",
      [
        new Exit(room1, Direction.West),
      ],
    ),
    new Room(
      room5,
      "A cozy room at the Inn",
      "Something about a room in the inn.",
      [
        new Exit(room1, Direction.East),
      ],
    ),
  ])

  Player.save({
    name: player,
    room: room1,
  })

  const modelJSON = JSON.stringify({
    player,
    room1,
    room2,
    room3,
    room4,
    room5,
  }, null, 2)

  fs.writeFile(
    `${process.argv[2]}/fixture-ids.txt`,
    modelJSON,
    () => console.log(modelJSON),
  )
})
