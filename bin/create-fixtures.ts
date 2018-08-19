import root from "../src/area/builder/forest/root"
import { newWorld } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import Service from "../src/room/service"

getConnection().then(async () => {
  const rootRoom = root()
  const service = await Service.new()
  await newWorld(await service.saveRoom(rootRoom))
})
