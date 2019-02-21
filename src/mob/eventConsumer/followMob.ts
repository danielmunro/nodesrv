import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import LocationService from "../locationService"
import MobMoveEvent from "../event/mobMoveEvent"
import {Mob} from "../model/mob"
import Move from "../../action/move"
import {Request} from "../../request/request"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/requestType"

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
    mobs.filter((mob: Mob) => mob.follows === event.mob)
      .forEach((mob: Mob) => action.handle(new Request(mob, event.source, new EventContext(RequestType.Follow))))
    return EventResponse.none(event)
  }
}
