import root from "../src/area/builder/forest/root"
import { newWorld } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import Service from "../src/room/service"
import { getPlayerRepository } from "../src/player/repository/player"
import { Player } from "../src/player/model/player"

const email = process.argv[3]
const password = process.argv[4]

getConnection().then(async () => {
  const rootRoom = root()
  const service = await Service.new()
  await newWorld(await service.saveRoom(rootRoom))
  const playerRepository = await getPlayerRepository()
  const player = new Player()
  player.email = email
  player.setPassword(password)
  await playerRepository.save(player)
  console.log(`start room ID is ${rootRoom.uuid}, password is ${password}`)
})
