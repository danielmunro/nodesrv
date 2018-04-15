import { newWorld } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import { Direction } from "../src/room/constants"
import { getFreeDirection } from "../src/room/direction"
import { newRoom } from "../src/room/factory"

const rootRoom = newRoom(
  "A clearing in the woods",
  "A small patch of land has been cleared of trees. On it sits a modest inn, tending to weary travellers.")

newWorld(rootRoom)
