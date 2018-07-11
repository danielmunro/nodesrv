import root from "../src/area/builder/forest/root"
import { newWorld } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import { persistRoom } from "../src/room/service"

getConnection().then(async () => {
  await newWorld(await persistRoom(root()))
})
