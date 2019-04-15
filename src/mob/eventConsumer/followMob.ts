import Move from "../../action/move"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import EventContext from "../../request/context/eventContext"
import Request from "../../request/request"
import {RequestType} from "../../request/requestType"
import MobMoveEvent from "../event/mobMoveEvent"
import LocationService from "../locationService"
import {Mob} from "../model/mob"

export default class FollowMob implements EventConsumer {
  constructor(
    private readonly locationService: LocationService,
    private readonly moveActions: Move[]) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    const action = this.moveActions.find((move: Move) => move.getDirection() === event.direction) as Move
    const mobs = this.locationService.getMobsByRoom(event.source)
    await Promise.all(mobs.filter((mob: Mob) => mob.follows === event.mob)
      .map((mob: Mob) => action.handle(new Request(mob, event.source, new EventContext(RequestType.South)))))
    return EventResponse.none(event)
  }
}
