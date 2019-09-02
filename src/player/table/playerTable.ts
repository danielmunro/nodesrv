import {injectable} from "inversify"
import {MobEntity} from "../../mob/entity/mobEntity"
import Maybe from "../../support/functional/maybe/maybe"
import {PlayerEntity} from "../entity/playerEntity"

@injectable()
export default class PlayerTable {
  constructor(private readonly players: PlayerEntity[] = []) {}

  public add(player: PlayerEntity) {
    this.players.push(player)
  }

  public getPlayerFromMob(mob: MobEntity): Maybe<PlayerEntity> {
    return new Maybe<PlayerEntity>(this.players.find(player =>
      !!player.mobs.find(m => m.uuid === mob.uuid)))
  }
}
