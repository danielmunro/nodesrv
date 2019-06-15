import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {createModifiedDamageEvent} from "../../event/factory/eventFactory"
import WeaponEntity from "../../item/entity/weaponEntity"
import {Equipment} from "../../item/enum/equipment"
import DamageEvent from "../../mob/event/damageEvent"
import {DamageType} from "../../mob/fight/enum/damageType"
import {SkillType} from "../skillType"

export default class DamageTypeEventConsumer implements EventConsumer {
  private static bonusAmount = 0.2

  constructor(private readonly skillType: SkillType, private readonly damageType: DamageType) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const has = event.source.skills.find(skill => skill.skillType === this.skillType)
    if (!event.source || has === undefined) {
      return EventResponse.none(event)
    }
    const weapon = event.source.getFirstEquippedItemAtPosition(Equipment.Weapon) as WeaponEntity
    if (weapon && weapon.damageType === this.damageType) {
      return EventResponse.modified(createModifiedDamageEvent(event, DamageTypeEventConsumer.bonusAmount))
    }
    return EventResponse.none(event)
  }
}
