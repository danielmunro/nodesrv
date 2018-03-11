import * as v4 from "uuid"
import { Direction } from "./../room/constants"
import { Exit } from "./../room/model/exit"
import { Room } from "./../room/model/room"

export function getTestRoom(): Room {
  const room1 = new Room()
  room1.name = "Test room 1"
  room1.description = "This is a test room."
  return room1
}
