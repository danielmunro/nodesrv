import { inject, injectable } from "inversify"
import Action from "../../action/impl/action"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventContext from "../../messageExchange/context/eventContext"
import {RequestType} from "../../messageExchange/enum/requestType"
import Request from "../../messageExchange/request"
import {Types} from "../../support/types"
import {MobEntity} from "../entity/mobEntity"
import FightEvent from "../fight/event/fightEvent"
import LocationService from "../service/locationService"

@injectable()
export default class WimpyEventConsumer implements EventConsumer {
  private static isWimpy(mob: MobEntity, target: MobEntity) {
    return target.hp / target.attribute().getMaxHp() < 0.2 || target.level < mob.level - 8
  }

  constructor(
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.FleeAction) private readonly fleeDefinition: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRound ]
  }

  public async isEventConsumable(event: FightEvent): Promise<boolean> {
    const target = event.fight.getOpponentFor(event.mob)
    return target && target.traits.wimpy && WimpyEventConsumer.isWimpy(event.mob, target)
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const target = event.fight.getOpponentFor(event.mob)
    const response = await this.tryWimpy(target)
    if (response.isSuccessful()) {
      return EventResponse.satisfied(event)
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
