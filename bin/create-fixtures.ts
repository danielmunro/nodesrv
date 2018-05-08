import { newWorld } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import { newRoom } from "../src/room/factory"

const rootRoom = newRoom(
  "A clearing in the woods",
  "A small patch of land has been cleared of trees. On it sits a modest inn, tending to weary travellers.")

getConnection().then(() => newWorld(rootRoom))
