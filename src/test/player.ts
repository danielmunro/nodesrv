import * as v4 from "uuid"
import { Player } from "./../player/player"
import { getTestMob } from "./mob"

export function getTestPlayer(): Player {
  const player = new Player(v4(), "test")
  player.setMob(getTestMob())

  return player
}
