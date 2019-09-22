import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobInteractionEvent} from "../../event/type/mobInteractionEvent"
import Maybe from "../../support/functional/maybe/maybe"
import {Types} from "../../support/types"
import {MobEntity} from "../entity/mobEntity"
import FightBuilder from "../fight/fightBuilder"
import MobService from "../service/mobService"
import Group from "../type/group"

@injectable()
export default class FightStarterEventConsumer implements EventConsumer {
  constructor(
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.FightBuilder) private readonly fightBuilder: FightBuilder) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Attack ]
  }

  public async isEventConsumable(event: MobInteractionEvent): Promise<boolean> {
    return !this.mobService.findFightForMob(event.mob).get()
  }

  public async consume(event: MobInteractionEvent): Promise<EventResponse> {
    this.mobService.addFight(this.fightBuilder.create(event.mob, event.target))
    Maybe.if(this.mobService.getGroupForMob(event.mob), group =>
      this.groupAttackIfAutoAssisting(group, event.mob, event.target))
    Maybe.if(this.mobService.getGroupForMob(event.target), group =>
      this.groupAttackIfAutoAssisting(group, event.target, event.mob))
    return EventResponse.none(event)
  }

  private groupAttackIfAutoAssisting(group: Group, excludingMob: MobEntity, mob: MobEntity) {
    group.mobs.filter(groupMob =>
      !groupMob.is(excludingMob) && (!groupMob.isPlayerMob() || groupMob.playerMob.autoAssist))
      .forEach(groupMob => this.mobService.addFight(this.fightBuilder.create(groupMob, mob)))
  }
}
