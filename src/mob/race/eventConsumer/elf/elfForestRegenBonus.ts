import {EventType} from "../../../../event/enum/eventType"
import {createModifiedTickEvent} from "../../../../event/factory/eventFactory"
import EventConsumer from "../../../../event/interface/eventConsumer"
import EventResponse from "../../../../event/messageExchange/eventResponse"
import {Terrain} from "../../../../region/enum/terrain"
import TickEvent from "../../../event/tickEvent"

export default class ElfForestRegenBonus implements EventConsumer {
  public static bonusModifier = 0.2

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }

  public consume(tickEvent: TickEvent): Promise<EventResponse> {
    if (tickEvent.room.region.terrain === Terrain.Forest) {
      return EventResponse.modified(
        createModifiedTickEvent(tickEvent, tickEvent.regenModifier + ElfForestRegenBonus.bonusModifier))
    }

    return EventResponse.none(tickEvent)
  }
}
