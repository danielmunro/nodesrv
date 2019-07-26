// @ts-ignore
import * as sillyname from "sillyname"
import {createPlayerMob} from "../../mob/factory/mobFactory"
import { PlayerEntity } from "../../player/entity/playerEntity"
import {createPlayer} from "../../player/factory/factory"
import { getTestMob } from "./mob"

export function getTestPlayer(): PlayerEntity {
  const player = createPlayer()
  player.name = "test " + sillyname()
  player.email = sillyname() + "@emailaddress.com"
  player.password = ""
  player.sessionMob = getTestMob()
  player.sessionMob.traits.isNpc = false
  player.sessionMob.playerMob = createPlayerMob()
  player.sessionMob.playerMob.mob = player.sessionMob
  player.sessionMob.playerMob.hunger = 0
  player.sessionMob.playerMob.appetite = player.sessionMob.race().appetite
  player.sessionMob.playerMob.experiencePerLevel = 1000
  player.sessionMob.playerMob.experienceToLevel = 1000
  player.sessionMob.playerMob.experience = 0
  player.sessionMob.playerMob.bounty = 0
  player.sessionMob.player = player
  player.mobs.push(player.sessionMob)

  return player
}
