import { Mob } from "../mob/model/mob"
import { Player } from "./model/player"

export function newPlayer(name: string, sessionMob: Mob): Player {
  const player = new Player()
  player.name = name
  player.sessionMob = sessionMob
  player.mobs.push(sessionMob)

  return player
}
