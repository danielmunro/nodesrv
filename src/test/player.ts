import { Player } from "./../player/player"
import { getTestMob } from "./mob"

export function getTestPlayer(): Player {
  const player = new Player("test")
  player.setMob(getTestMob())

  return player
}
