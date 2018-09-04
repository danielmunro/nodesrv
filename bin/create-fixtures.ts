import root from "../src/area/builder/forest/root"
import { newWorld } from "../src/area/factory"
import { getConnection } from "../src/db/connection"
import { Player } from "../src/player/model/player"
import { getPlayerRepository } from "../src/player/repository/player"
import Service from "../src/room/service"

const emailArg = process.argv[3]
const passwordArg = process.argv[4]

function getNewPlayer(email: string, password: string): Player {
  const player = new Player()
  player.email = email
  player.setPassword(password)

  return player
}

getConnection().then(async () => {
  const rootRoom = root()
  const service = await Service.new()
  await newWorld(await service.saveRoom(rootRoom))
  const playerRepository = await getPlayerRepository()
  await playerRepository.save(getNewPlayer(emailArg, passwordArg))
  console.log(`start room ID is ${rootRoom.uuid}`)
})
