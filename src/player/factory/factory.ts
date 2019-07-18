import { MobEntity } from "../../mob/entity/mobEntity"
import {createPlayerMob} from "../../mob/factory/mobFactory"
import { PlayerEntity } from "../entity/playerEntity"
import {getPlayerRepository} from "../repository/player"
import PlayerTable from "../table/playerTable"

export function newPlayer(name: string, sessionMob: MobEntity): PlayerEntity {
  const player = createPlayer()
  player.name = name
  player.sessionMob = sessionMob
  player.sessionMob.playerMob = createPlayerMob()
  player.mobs.push(sessionMob)
  return player
}

export function createPlayer(): PlayerEntity {
  const player = new PlayerEntity()
  player.kills = 0
  player.deaths = 0
  player.mobs = []
  return player
}

export async function getPlayerTable(): Promise<PlayerTable> {
  const repository = await getPlayerRepository()
  return new PlayerTable(await repository.find())
}
