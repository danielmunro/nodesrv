import Action from "../../action/impl/action"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import {MobEntity} from "../entity/mobEntity"
import FightEvent from "../fight/event/fightEvent"
import LocationService from "../service/locationService"

export default class Wimpy implements EventConsumer {
  private static isWimpy(mob: MobEntity, target: MobEntity) {
    return target.hp / target.attribute().getMaxHp() < 0.2 || target.level < mob.level - 8
  }

  constructor(
    private readonly locationService: LocationService,
    private readonly fleeDefinition: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRound]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const target = event.fight.getOpponentFor(event.mob)
    if (target && target.traits.wimpy && Wimpy.isWimpy(event.mob, target)) {
      const response = await this.tryWimpy(target)
      if (response.isSuccessful()) {
        return EventResponse.satisfied(event)
      }
    }
    return EventResponse.none(event)
  }

  private tryWimpy(mob: MobEntity) {
    return this.fleeDefinition.handle(
      new Request(
        mob,
        this.locationService.getLocationForMob(mob).room,
        { requestType: RequestType.Flee } as EventContext))
  }
}
