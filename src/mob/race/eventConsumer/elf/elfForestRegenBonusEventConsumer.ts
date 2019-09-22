import { injectable } from "inversify"
import {EventType} from "../../../../event/enum/eventType"
import {createModifiedTickEvent} from "../../../../event/factory/eventFactory"
import EventConsumer from "../../../../event/interface/eventConsumer"
import EventResponse from "../../../../event/messageExchange/eventResponse"
import {Terrain} from "../../../../region/enum/terrain"
import TickEvent from "../../../event/tickEvent"

@injectable()
export default class ElfForestRegenBonusEventConsumer implements EventConsumer {
  public static bonusModifier = 0.2

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }

  public async isEventConsumable(event: TickEvent): Promise<boolean> {
    return event.room.region.terrain === Terrain.Forest
  }

  public consume(tickEvent: TickEvent): Promise<EventResponse> {
    return EventResponse.modified(
      createModifiedTickEvent(tickEvent, tickEvent.regenModifier + ElfForestRegenBonusEventConsumer.bonusModifier))
  }
}
