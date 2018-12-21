import * as sillyname from "sillyname"
import { PlayerMob } from "../mob/model/playerMob"
import appetite from "../mob/race/appetite"
import { Player } from "../player/model/player"
import { getTestMob } from "./mob"

export function getTestPlayer(): Player {
  const player = new Player()
  player.name = "test " + sillyname()
  player.email = sillyname() + "@emailaddress.com"
  player.password = ""
  player.sessionMob = getTestMob()
  player.sessionMob.traits.isNpc = false
  player.sessionMob.playerMob = new PlayerMob()
  player.sessionMob.playerMob.mob = player.sessionMob
  player.sessionMob.playerMob.appetite = appetite(player.sessionMob.race)
  player.mobs.push(player.sessionMob)

  return player
}
