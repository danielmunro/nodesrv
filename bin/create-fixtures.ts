import root from "../src/area/builder/forest/root"
import { newWorld } from "../src/area/factory"
import { newStartingAttributes, newStartingVitals } from "../src/attributes/factory"
import { getConnection } from "../src/db/connection"
import { newContainer } from "../src/item/factory"
import { newForestItem } from "../src/item/factory/trail"
import { newMob } from "../src/mob/factory"
import { Race } from "../src/mob/race/race"
import { getMobRepository } from "../src/mob/repository/mob"
import { Player } from "../src/player/model/player"
import { getPlayerRepository } from "../src/player/repository/player"
import Service from "../src/room/service"

const emailArg = process.argv[3]
const passwordArg = process.argv[4]

async function getNewPlayer(email: string, password: string): Promise<Player> {
  const player = new Player()
  player.email = email
  player.setPassword(password)
  const mob = newMob(
    "fooo",
    "",
    Race.Human,
    newStartingVitals(),
    newStartingAttributes(newStartingVitals()),
  )
  const satchel = newContainer("a satchel", "a satchel")
  mob.inventory.addItem(newForestItem())
  mob.inventory.addItem(satchel)
  player.addMob(mob)

  return player
}

getConnection().then(async () => {
  const rootRoom = root()
  const service = await Service.new()
  await newWorld(await service.saveRoom(rootRoom))
  const playerRepository = await getPlayerRepository()
  await playerRepository.save(await getNewPlayer(emailArg, passwordArg))
  console.log(`start room ID is ${rootRoom.uuid}`)
})
