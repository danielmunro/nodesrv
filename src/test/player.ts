import * as v4 from "uuid"
import { Player } from "./../player/model/player"
import { getTestMob } from "./mob"

export function getTestPlayer(): Player {
  const player = new Player()
  player.name = "test"
  player.sessionMob = getTestMob()

  return player
}
