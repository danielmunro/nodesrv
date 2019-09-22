import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import KafkaService from "../../kafka/kafkaService"
import {MobEntity} from "../../mob/entity/mobEntity"
import DeathEvent from "../../mob/event/deathEvent"
import Death from "../../mob/fight/death"
import {Types} from "../../support/types"
import {PlayerEntity} from "../entity/playerEntity"
import PlayerRepository from "../repository/player"

@injectable()
export default class IncrementDeathCountsEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.KafkaService) private readonly kafkaService: KafkaService,
    @inject(Types.PlayerRepository) private readonly playerRepository: PlayerRepository) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async isEventConsumable(event: DeathEvent): Promise<boolean> {
    return !!event.fight && event.fight.isP2P()
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    await this.incrementDeathCounts(event.death)
    return EventResponse.none(event)
  }

  private async incrementDeathCounts(death: Death) {
    const playerKiller = await this.playerRepository.findOneByMob(death.killer as MobEntity) as PlayerEntity
    playerKiller.kills++

    const playerKilled = await this.playerRepository.findOneByMob(death.mobKilled) as PlayerEntity
    playerKilled.deaths++

    await this.playerRepository.save([ playerKiller, playerKilled ])
    await this.kafkaService.publishPlayer(playerKilled)
    await this.kafkaService.publishPlayer(playerKiller)
  }
}
