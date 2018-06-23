import * as sillyname from "sillyname"
import { Player } from "../player/model/player"
import { getTestMob } from "./mob"

export function getTestPlayer(): Player {
  const player = new Player()
  player.name = "test " + sillyname()
  player.email = sillyname() + "@emailaddress.com"
  player.password = ""
  player.sessionMob = getTestMob()

  return player
}
