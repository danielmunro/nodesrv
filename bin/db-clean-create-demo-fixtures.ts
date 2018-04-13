import { newInn, newTrail } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import { Direction } from "../src/room/constants"
import { getFreeDirection } from "../src/room/direction"
import { newRoom } from "../src/room/factory"

const rootRoom = newRoom(
  "A clearing in the woods",
  "A small patch of land has been cleared of trees. On it sits a modest inn, tending to weary travellers.")

getConnection().then(() => newInn(rootRoom))
  .then(() => newTrail(rootRoom, getFreeDirection(rootRoom), 5))
  .then(() => newTrail(rootRoom, getFreeDirection(rootRoom), 2))
  .then((rooms) => newTrail(rooms[rooms.length - 1], Direction.East, 2))
