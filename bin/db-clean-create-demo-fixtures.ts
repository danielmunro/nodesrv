import * as fs from "fs"
import OGM from "./../src/db/ogm"
import { Domain } from "./../src/domain"
import { Direction } from "./../src/room/constants"
import { addReciprocalExit } from "./../src/room/model"

function newRoom(name: string, description: string): Promise<any> {
  return OGM.create(Domain.Room, { description, name })
}

OGM.deleteAll(Domain.Room)
  .then(() => Promise.all([
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
  ]).then(
    ([r1, r2, r3, r4, r5]) =>
      Promise.all([
        addReciprocalExit(r1, Direction.North, r2),
        addReciprocalExit(r1, Direction.West, r3),
        addReciprocalExit(r1, Direction.East, r4),
        addReciprocalExit(r1, Direction.South, r5),
      ]).then(() => {
        const modelJSON = JSON.stringify({
          room1: r1.get("room_id"),
          room2: r2.get("room_id"),
          room3: r3.get("room_id"),
          room4: r4.get("room_id"),
          room5: r5.get("room_id"),
        }, null, 2)

        fs.writeFile(
          `${process.argv[2]}/fixture-ids.txt`,
          modelJSON,
          () => console.log(modelJSON))
      })))
