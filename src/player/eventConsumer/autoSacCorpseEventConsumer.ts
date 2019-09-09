import {inject, injectable} from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createDestroyItemEvent, createRoomMessageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventService from "../../event/service/eventService"
import ResponseMessageBuilder from "../../messageExchange/builder/responseMessageBuilder"
import DeathEvent from "../../mob/event/deathEvent"
import {Types} from "../../support/types"

@injectable()
export default class AutoSacCorpseEventConsumer implements EventConsumer {
  constructor(@inject(Types.EventService) private readonly eventService: EventService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const death = event.death
    const winner = death.killer
    if (winner && winner.playerMob && winner.playerMob.autoSac) {
      const corpse = death.corpse
      await this.eventService.publish(createDestroyItemEvent(corpse))
      await this.eventService.publish(createRoomMessageEvent(
        death.room,
        new ResponseMessageBuilder(winner, "{requestCreator} {verb} {corpse} to {requestCreator2} diety.")
          .addReplacementForRequestCreator("verb", "sacrifice")
          .addReplacementForRequestCreator("requestCreator2", "your")
          .addReplacementForTarget("verb", "sacrifices")
          .addReplacementForTarget("requestCreator2", "their")
          .addReplacement("corpse", corpse.toString())
          .create()))
    }
    return EventResponse.none(event)
  }
}
