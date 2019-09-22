import { injectable, unmanaged } from "inversify"
import {EventType} from "../../../event/enum/eventType"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {Equipment} from "../../../item/enum/equipment"
import DamageEvent from "../../event/damageEvent"
import {DamageType} from "../../fight/enum/damageType"
import {SkillType} from "../skillType"

@injectable()
export default class DamageTypeEventConsumer implements EventConsumer {
  private static bonusAmount = 0.2

  constructor(
    @unmanaged() private readonly skillType: SkillType,
    @unmanaged() private readonly damageType: DamageType) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public async isEventConsumable(event: DamageEvent): Promise<boolean> {
    const has = event.source.skills.find(skill => skill.skillType === this.skillType)
    const weapon = event.source.getFirstEquippedItemAtPosition(Equipment.Weapon) as ItemEntity
    return !!event.source && !!has && !!weapon && weapon.damageType === this.damageType
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    return EventResponse.modified(createModifiedDamageEvent(event, DamageTypeEventConsumer.bonusAmount))
  }
}
