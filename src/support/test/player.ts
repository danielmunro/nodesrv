import * as sillyname from "sillyname"
import { PlayerMob } from "../../mob/model/playerMob"
import {createPlayer} from "../../player/factory/factory"
import { Player } from "../../player/model/player"
import { getTestMob } from "./mob"

export function getTestPlayer(): Player {
  const player = createPlayer()
  player.name = "test " + sillyname()
  player.email = sillyname() + "@emailaddress.com"
  player.password = ""
  player.sessionMob = getTestMob()
  player.sessionMob.traits.isNpc = false
  player.sessionMob.playerMob = new PlayerMob()
  player.sessionMob.playerMob.mob = player.sessionMob
  player.sessionMob.playerMob.appetite = player.sessionMob.race().appetite
  player.sessionMob.playerMob.experiencePerLevel = 1000
  player.sessionMob.playerMob.experienceToLevel = 1000
  player.mobs.push(player.sessionMob)

  return player
}
