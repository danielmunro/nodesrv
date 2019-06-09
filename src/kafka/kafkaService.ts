import {inject, injectable} from "inversify"
import * as stringify from "json-stringify-safe"
import {Producer} from "kafkajs"
import {Mob} from "../mob/model/mob"
import {Player} from "../player/model/player"
import {Types} from "../support/types"

@injectable()
export default class KafkaService {
  @inject(Types.KafkaProducer)
  private producer: Producer

  public async publishPlayer(player: Player) {
    return this.producer.send({
      messages: [{ value: stringify(player) }],
      topic: "player",
    })
  }

  public async publishMob(mob: Mob) {
    return this.producer.send({
      messages: [{ value: stringify(mob) }],
      topic: "mob",
    })
  }
}
