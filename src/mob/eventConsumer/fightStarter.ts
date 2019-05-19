import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import AttackEvent from "../event/attackEvent"
import MobEvent from "../event/mobEvent"
import FightBuilder from "../fight/fightBuilder"
import {Mob} from "../model/mob"
import MobService from "../service/mobService"
import {MobInteractionEvent} from "../../event/event"

export default class FightStarter implements EventConsumer {
  constructor(
    private readonly mobService: MobService,
    private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Attack ]
  }

  public async consume(event: MobInteractionEvent): Promise<EventResponse> {
    const fight = this.mobService.findFightForMob(event.mob)
    if (fight && fight.isParticipant(event.target)) {
      return EventResponse.none(event)
    }
    this.mobService.addFight(this.fightBuilder.create(event.mob, event.target))
    return EventResponse.none(event)
  }
}
