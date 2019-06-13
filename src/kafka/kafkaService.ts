import {inject, injectable} from "inversify"
import * as stringify from "json-stringify-safe"
import {Producer} from "kafkajs"
import {MobEntity} from "../mob/entity/mobEntity"
import Death from "../mob/fight/death"
import {PlayerEntity} from "../player/entity/playerEntity"
import {Types} from "../support/types"
import {Topic} from "./topic"

@injectable()
export default class KafkaService {
  @inject(Types.KafkaProducer)
  private producer: Producer

  public async playerCreated(player: PlayerEntity) {
    return this.producer.send({
      messages: [{ value: stringify(player) }],
      topic: Topic.PlayerCreate,
    })
  }

  public async mobCreated(mob: MobEntity) {
    return this.producer.send({
      messages: [{ value: stringify(mob) }],
      topic: Topic.MobCreate,
    })
  }

  public async mobLeveled(mob: MobEntity) {
    return this.producer.send({
      messages: [ { value: stringify(mob) } ],
      topic: Topic.MobLevel,
    })
  }

  public async death(death: Death) {
    return this.producer.send({
      messages: [{
        value: stringify({
          bounty: death.bounty,
          killed: death.mobKilled.uuid,
          killer: death.killer ? death.killer : undefined,
          room: death.room.uuid,
          roomName: death.room.name,
        }),
      }],
      topic: Topic.MobDeath,
    })
  }
}
