import root from "../src/area/builder/forest/root"
import { newWorld } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import Service from "../src/room/service"

getConnection().then(async () => {
  const service = await Service.new()
  await newWorld(await service.saveRoom(root()))
})
