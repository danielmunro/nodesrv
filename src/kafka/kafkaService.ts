import {inject, injectable} from "inversify"
import * as stringify from "json-stringify-safe"
import {Producer} from "kafkajs"
import Death from "../mob/fight/death"
import {Mob} from "../mob/model/mob"
import {Player} from "../player/model/player"
import {Types} from "../support/types"

@injectable()
export default class KafkaService {
  @inject(Types.KafkaProducer)
  private producer: Producer

  public async playerCreated(player: Player) {
    return this.producer.send({
      messages: [{ value: stringify(player) }],
      topic: "player.create",
    })
  }

  public async mobCreated(mob: Mob) {
    return this.producer.send({
      messages: [{ value: stringify(mob) }],
      topic: "mob.create",
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
      topic: "mob.death",
    })
  }
}
