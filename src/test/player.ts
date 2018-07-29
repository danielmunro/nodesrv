import * as sillyname from "sillyname"
import { PlayerMob } from "../mob/model/playerMob"
import { Player } from "../player/model/player"
import { getTestMob } from "./mob"
import appetite from "../mob/race/appetite"

export function getTestPlayer(): Player {
  const player = new Player()
  player.name = "test " + sillyname()
  player.email = sillyname() + "@emailaddress.com"
  player.password = ""
  player.sessionMob = getTestMob()
  player.sessionMob.setPlayerMob(new PlayerMob())
  player.sessionMob.playerMob.appetite = appetite(player.sessionMob.race)

  return player
}
