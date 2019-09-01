import { injectable } from "inversify"
import {EventType} from "../../../../event/enum/eventType"
import {createModifiedMobMoveEvent} from "../../../../event/factory/eventFactory"
import EventConsumer from "../../../../event/interface/eventConsumer"
import EventResponse from "../../../../event/messageExchange/eventResponse"
import {Terrain} from "../../../../region/enum/terrain"
import MobMoveEvent from "../../../event/mobMoveEvent"
import {RaceType} from "../../enum/raceType"

@injectable()
export default class HalflingMvBonusEventConsumer implements EventConsumer {
  public static terrains = [ Terrain.Forest, Terrain.Plains ]

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }

  public consume(event: MobMoveEvent): Promise<EventResponse> {
    if (event.mob.raceType === RaceType.Halfling &&
      HalflingMvBonusEventConsumer.terrains.includes(event.source.region.terrain)) {
      return EventResponse.modified(createModifiedMobMoveEvent(event, event.mvCost / 2))
    }
    return EventResponse.none(event)
  }
}
