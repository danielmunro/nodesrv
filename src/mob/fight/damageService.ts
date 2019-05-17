import {Equipment} from "../../item/enum/equipment"
import {Item} from "../../item/model/item"
import Weapon from "../../item/model/weapon"
import {Mob} from "../model/mob"
import {DamageType} from "./damageType"

export default class DamageService {
  constructor(private readonly mob: Mob) {}

  public getDamageType(): DamageType {
    const equipment = this.mob.equipped.find((item: Item) => item.equipment === Equipment.Weapon) as Weapon
    if (equipment) {
      return equipment.damageType
    }

    return DamageType.Bash
  }
}
