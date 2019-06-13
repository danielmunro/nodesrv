import {Equipment} from "../../item/enum/equipment"
import {Item} from "../../item/model/item"
import Weapon from "../../item/model/weapon"
import {MobEntity} from "../entity/mobEntity"
import {DamageType} from "./enum/damageType"

export default class DamageService {
  constructor(private readonly mob: MobEntity) {}

  public getDamageType(): DamageType {
    const equipment = this.mob.equipped.find((item: Item) => item.equipment === Equipment.Weapon) as Weapon
    if (equipment) {
      return equipment.damageType
    }

    return DamageType.Bash
  }
}
