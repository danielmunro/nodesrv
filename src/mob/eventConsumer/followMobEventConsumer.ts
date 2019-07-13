import Move from "../../action/impl/move"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import {MobEntity} from "../entity/mobEntity"
import MobMoveEvent from "../event/mobMoveEvent"
import LocationService from "../service/locationService"

export default class FollowMobEventConsumer implements EventConsumer {
  constructor(
    private readonly locationService: LocationService,
    private readonly moveActions: Move[]) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    const action = this.moveActions.find((move: Move) => move.getDirection() === event.direction) as Move
    const mobs = this.locationService.getMobsByRoom(event.source)
    await Promise.all(mobs.filter((mob: MobEntity) => mob.follows === event.mob)
      .map((mob: MobEntity) => action.handle(
        new Request(mob, event.source, { requestType: RequestType.South } as EventContext))))
    return EventResponse.none(event)
  }
}
