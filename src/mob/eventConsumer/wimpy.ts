import Action from "../../action/action"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import EventContext from "../../request/context/eventContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import FightEvent from "../fight/event/fightEvent"
import LocationService from "../locationService"
import {Mob} from "../model/mob"
import MobLocation from "../model/mobLocation"

export default class Wimpy implements EventConsumer {
  private static isWimpy(mob: Mob, target: Mob) {
    return target.vitals.hp / target.getCombinedAttributes().vitals.hp < 0.2 || target.level < mob.level - 8
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

  private tryWimpy(mob: Mob) {
    return this.fleeDefinition.handle(
      new Request(
        mob,
        (this.locationService.getLocationForMob(mob) as MobLocation).room,
        new EventContext(RequestType.Flee)))
  }
}
