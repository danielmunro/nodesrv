import * as sillyname from "sillyname"
import { Player } from "../player/model/player"
import { getTestMob } from "./mob"
import { PlayerMob } from "../mob/model/playerMob"

export function getTestPlayer(): Player {
  const player = new Player()
  player.name = "test " + sillyname()
  player.email = sillyname() + "@emailaddress.com"
  player.password = ""
  player.sessionMob = getTestMob()
  player.sessionMob.setPlayerMob(new PlayerMob())

  return player
}
