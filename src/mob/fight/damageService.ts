import {ItemEntity} from "../../item/entity/itemEntity"
import WeaponEntity from "../../item/entity/weaponEntity"
import {Equipment} from "../../item/enum/equipment"
import {MobEntity} from "../entity/mobEntity"
import {DamageType} from "./enum/damageType"

export default class DamageService {
  constructor(private readonly mob: MobEntity) {}

  public getDamageType(): DamageType {
    const equipment = this.mob.equipped.find((item: ItemEntity) => item.equipment === Equipment.Weapon) as WeaponEntity
    if (equipment) {
      return equipment.damageType
    }

    return DamageType.Bash
  }
}
