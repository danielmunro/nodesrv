import {EventType} from "../../../../event/enum/eventType"
import EventConsumer from "../../../../event/eventConsumer"
import EventResponse from "../../../../event/eventResponse"
import {createModifiedMobMoveEvent} from "../../../../event/factory/eventFactory"
import {Terrain} from "../../../../region/enum/terrain"
import MobMoveEvent from "../../../event/mobMoveEvent"
import {RaceType} from "../../enum/raceType"

export default class HalflingMvBonus implements EventConsumer {
  public static terrains = [ Terrain.Forest, Terrain.Plains ]

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }

  public consume(event: MobMoveEvent): Promise<EventResponse> {
    if (event.mob.raceType === RaceType.Halfling && HalflingMvBonus.terrains.includes(event.source.region.terrain)) {
      return EventResponse.modified(createModifiedMobMoveEvent(event, event.mvCost / 2))
    }
    return EventResponse.none(event)
  }
}
