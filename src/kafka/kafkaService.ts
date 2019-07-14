import {inject, injectable} from "inversify"
import * as stringify from "json-stringify-safe"
import {Producer} from "kafkajs"
import {MobEntity} from "../mob/entity/mobEntity"
import Death from "../mob/fight/death"
import {PlayerEntity} from "../player/entity/playerEntity"
import {TickEntity} from "../server/entity/tickEntity"
import {Types} from "../support/types"
import {Topic} from "./topic"

@injectable()
export default class KafkaService {
  @inject(Types.KafkaProducer)
  private producer: Producer

  public async publishPlayer(player: PlayerEntity) {
    return this.producer.send({
      messages: [{ value: stringify(player) }],
      topic: Topic.Player,
    })
  }

  public async publishMob(mob: MobEntity) {
    return this.producer.send({
      messages: [{ value: stringify(mob) }],
      topic: Topic.Mob,
    })
  }

  public async publishDeath(death: Death) {
    return this.producer.send({
      messages: [{
        value: stringify({
          bounty: death.bounty,
          killed: death.mobKilled.uuid,
          killer: death.killer ? death.killer.uuid : undefined,
          room: death.room.uuid,
          roomName: death.room.name,
        }),
      }],
      topic: Topic.MobDeath,
    })
  }

  public async publishTick(tick: TickEntity) {
    return this.producer.send({
      messages: [{
        value: stringify(tick),
      }],
      topic: Topic.Tick,
    })
  }
}
