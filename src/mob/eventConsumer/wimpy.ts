import MobEvent from "../../event/event/mobEvent"
import EventConsumer from "../../event/eventConsumer"
import {EventResponse} from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Mob} from "../model/mob"
import {Fight} from "../fight/fight"
import {Definition} from "../../action/definition/definition"
import GameService from "../../gameService/gameService"
import {Request} from "../../request/request"
import LocationService from "../locationService"
import EventContext from "../../request/context/eventContext"
import {RequestType} from "../../request/requestType"
import {Trigger} from "../enum/trigger"

export default class Wimpy implements EventConsumer {
  private static isWimpy(mob: Mob, target: Mob) {
    return target.vitals.hp / target.getCombinedAttributes().vitals.hp < 0.2 || target.level < mob.level - 8
  }

  constructor(
    private readonly gameService: GameService,
    private readonly locationService: LocationService,
    private readonly fleeDefinition: Definition) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRound]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    const fight = event.context as Fight
    const target = fight.getOpponentFor(event.mob)
    if (target.traits.wimpy && Wimpy.isWimpy(event.mob, target)) {
      const response = await this.tryWimpy(target)
      if (response.isSuccessful()) {
        return Promise.resolve(EventResponse.Satisfied)
      }
    }
    return Promise.resolve(EventResponse.None)
  }

  private tryWimpy(mob: Mob) {
    return this.fleeDefinition.handle(
      new Request(
        mob,
        this.locationService.getLocationForMob(mob).room,
        new EventContext(RequestType.Flee, Trigger.AttackRound)))
  }
}
