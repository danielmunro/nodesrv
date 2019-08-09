import Move from "../../action/impl/move"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import {MobEntity} from "../entity/mobEntity"
import MobMoveEvent from "../event/mobMoveEvent"
import MobService from "../service/mobService"

export default class FollowMobEventConsumer implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly moveActions: Move[]) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.MobMoved]
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    const action = this.moveActions.find((move: Move) => move.getDirection() === event.direction) as Move
    const followers = this.mobService.getFollowers(event.mob)
      .filter(follower => this.mobService.getLocationForMob(follower).room.uuid === event.source.uuid)
    await Promise.all(followers
      .map((mob: MobEntity) => action.handle(
        new Request(mob, event.source, { requestType: RequestType.South } as EventContext))))
    return EventResponse.none(event)
  }
}
