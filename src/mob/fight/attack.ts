import { SkillType } from "../../skill/skillType"
import { Mob } from "../model/mob"

export enum AttackResult {
  Hit,
  Miss,
  Dodge,
  Parry,
}

export function getAttackResultFromSkillType(skill: SkillType) {
  if (skill === SkillType.Dodge) {
    return AttackResult.Dodge
  }
}

export class Attack {
  public readonly attacker: Mob
  public readonly defender: Mob
  public readonly result: AttackResult
  public readonly damage: number
  public readonly isDefenderAlive: boolean

  constructor(attacker: Mob, defender: Mob, result: AttackResult, damage: number) {
    this.attacker = attacker
    this.defender = defender
    this.result = result
    this.damage = damage
    this.isDefenderAlive = defender.vitals.hp > 0
  }
}
