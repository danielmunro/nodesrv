import {inject, injectable} from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createRoomMessageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventService from "../../event/service/eventService"
import ResponseMessageBuilder from "../../messageExchange/builder/responseMessageBuilder"
import DeathEvent from "../../mob/event/deathEvent"
import {Types} from "../../support/types"

@injectable()
export default class AutoLootCorpseEventConsumer implements EventConsumer {
  constructor(@inject(Types.EventService) private readonly eventService: EventService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobDeath ]
  }

  public async consume(event: DeathEvent): Promise<EventResponse> {
    const winner = event.death.killer
    if (winner && winner.playerMob && winner.playerMob.autoLoot) {
      const corpse = event.corpse
      await Promise.all(corpse.container.inventory.items.map(async item => {
        winner.inventory.addItem(item)
        await this.eventService.publish(createRoomMessageEvent(
          event.death.room,
          new ResponseMessageBuilder(winner, "{requestCreator} {verb} from {corpse}.")
            .addReplacementForRequestCreator("verb", "loot")
            .addReplacementForTarget("verb", "loots")
            .addReplacement("corpse", corpse.toString())
            .create()))
      }))
    }
    return EventResponse.none(event)
  }
}